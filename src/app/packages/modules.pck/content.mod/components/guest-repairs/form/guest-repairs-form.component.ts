// angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { I18n } from '@ngx-translate/i18n-polyfill';

// store
import { Store } from '@ngrx/store';

// app
import * as ErrorHandlerActions from '../../../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { GuestViewInterface } from '../../../interfaces/guest-view.interface';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';
import { SelectDefaultInterface } from '../../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';
import { SelectGroupInterface } from '../../../../../core.pck/fields.mod/interfaces/select-group.interface';
import { ErrorHandlerInterface } from '../../../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { SelectTypeEnum } from '../../../../../core.pck/fields.mod/enums/select-type.enum';
import { GuestRepairsService } from '../../../services/guest-repairs.service';

@Component({
	selector: 'app-guest-repairs-form',
	templateUrl: './guest-repairs-form.component.html',
	styleUrls: ['./guest-repairs-form.component.scss']
})

export class GuestRepairsFormComponent implements OnInit, OnDestroy {
	@Output() changeRepairsView: EventEmitter<any> = new EventEmitter();
	@Input() id;
	@Input() data;

	public formFields;
	public entryFormFields;
	public systemLanguages;
	public systemInfo;
	public languageList = [];
	public title = 'Form';

	public isAccess = false;
	public selectTypeDefault = SelectTypeEnum.DEFAULT;
	public selectTypeGroup = SelectTypeEnum.GROUP;
	public hotelList: SelectDefaultInterface[] = [];
	public hotelListGroup: SelectGroupInterface[] = [];
	public selectedHotels = [];

	public currentRole;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];
	public roleGroupManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.GROUP_MANAGER];
	public roleHotelManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.HOTEL_MANAGER];
	public roleHotelSubManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.HOTEL_SUB_MANAGER];
	public permissionLevel2 = false;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _guestRepairsService: GuestRepairsService,
		private _utilityService: UtilityService,
		private _helperService: HelperService,
		private _formBuilder: FormBuilder,
		private _store: Store<{ ErrorHandlerInterface: ErrorHandlerInterface }>,
		private _i18n: I18n
	) {
		// languages
		this.systemLanguages = this._utilityService.getSystemLanguageList();

		// form group
		this.formFields = new FormGroup({
			languages: this._formBuilder.array([]),
			hotels: new FormControl('', [Validators.required]),
			access: new FormControl(false)
		});

		// entry form group
		this.entryFormFields = new FormGroup({
			languages: this._formBuilder.array([])
		});
	}

	ngOnInit() {
		// set current role
		this.currentRole = this._guestRepairsService.appState.role;
		if (this.currentRole) {
			this.permissionLevel2 = this._helperService.permissionLevel2(this.currentRole);
		}

		// listen: fetch form languages
		this._guestRepairsService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// form languages
				if (res && res.formLanguages) {
					// reset language list
					this.languageList = [];

					// languages list
					this.systemInfo = res.formLanguages;
					if (this.systemInfo && this.systemInfo['System'] && this.systemInfo['System'].Languages.length > 1) {
						this.systemInfo['System'].Languages.forEach(language => {
							// add form groups dynamically
							this.addLanguageSpecificFields();

							// add language
							this.languageList.push(
								...this.systemLanguages.filter(item => item.id === language)
							);
						});
					}
				}
			});

		// listen: on hotels change
		this.hotels.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res) {
					const hotels = res.map(hotel => hotel.id.split('_')[0]);
					const uniqueSet = new Set(hotels);
					const hotelsList = [...uniqueSet];
					if (hotelsList.length > 1) {
						// set previous values
						this.hotels.setValue(this.selectedHotels);

						// payload
						payload = {
							icon: 'error_icon',
							title: this._i18n({
								value: 'Title: Wrong Group Selection Error Exception',
								id: 'Error_Common_GroupSelection_Title'
							}),
							message: this._i18n({
								value: 'Description: Wrong Group Selection Error Exception',
								id: 'Error_Common_GroupSelection_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
						};
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
					} else {
						this.selectedHotels = this.hotels.value;
					}
				}
			});

		let payload;
		switch (this.currentRole) {
			case this.roleAdmin:
				// hotel list
				this.getAllGroupHotels();
				break;
			case this.roleGroupManager:
				// payload
				payload = {
					pathParams: { groupId: this._guestRepairsService.appState.groupId }
				};

				// hotel list
				this.getGroupHotels(payload);
				break;
			case this.roleHotelManager:
			case this.roleHotelSubManager:
				// payload
				const hotelIds = this._guestRepairsService.currentUser.profile['custom:hotelId'].split(',');
				payload = {
					pathParams: { groupId: this._guestRepairsService.appState.groupId },
					queryParams: { 'HotelIDs[]': hotelIds }
				};

				// hotel list
				this.getGroupHotels(payload);
				break;
		}
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * getters
	 */
	get formLanguages() {
		return <FormArray>this.formFields.controls.languages.controls;
	}

	get hotels() {
		return this.formFields.get('hotels');
	}

	get access() {
		return this.formFields.get('access');
	}

	get isFormValid() {
		return this.formFields.valid;
	}

	get entryFormLanguages() {
		return <FormArray>this.entryFormFields.controls.languages.controls;
	}

	get isEntryFormValid() {
		return this.entryFormFields.valid;
	}

	/**
	 * add forms groups for each language
	 */
	public addLanguageSpecificFields() {
		// form
		(<FormArray>this.formFields.controls['languages']).push(
			new FormGroup({
				field: new FormControl('', [
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(64)
				])
			})
		);

		// entry form
		(<FormArray>this.entryFormFields.controls['languages']).push(
			new FormGroup({
				field: new FormControl('', [
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(64)
				])
			})
		);
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		const formData = this.formFields.getRawValue();
		console.log(formData);
	}

	/**
	 * on submit entry form
	 */
	public onSubmitEntryForm() {
		const formData = this.entryFormFields.getRawValue();
		console.log(formData);

		// reset
		this.entryFormFields.reset();
	}

	/**
	 * close form
	 */
	public onClickCloseForm() {
		const payload: GuestViewInterface = {
			view: AppViewTypeEnum.DEFAULT
		};
		this.changeRepairsView.emit(payload);
	}

	/**
	 * get particular group hotels
	 *
	 * @param payload
	 */
	public getGroupHotels(payload: any) {
		this._utilityService
			.getHotelListByGroup(payload)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(result => {
				// set hotel list
				this.hotelList = result.items.map(hotel => {
					return {
						id: hotel.HotelID,
						text: hotel.Name
					};
				});

				// pre-select hotels
				if (this.data && this.data.HotelIDs) {
					const hotelIds = this.data.HotelIDs;
					const hotels = this.hotelList.filter(hotel =>
						typeof hotelIds !== 'string' ? hotelIds.includes(hotel.id) : hotel.id === hotelIds
					);
					this.hotels.setValue(hotels);
				}
			});
	}

	/**
	 * get all group hotels
	 */
	public getAllGroupHotels() {
		this._utilityService
			.getAllGroupHotels()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// map response
				const mapped = res.items
					.filter(hotel => hotel.hasOwnProperty('HotelID'))
					.reduce((acc, hotel) => {
						if (!acc.hasOwnProperty(hotel.GroupID)) {
							acc[hotel.GroupID] = [];
						}
						acc[hotel.GroupID].push({
							id: hotel.HotelID,
							text: hotel.Name
						});
						return acc;
					}, {});

				// convert object to array
				// @ts-ignore
				this.hotelListGroup = Object.entries(mapped).map(hotel => {
					return {
						name: hotel[0],
						items: hotel[1]
					};
				});

				// pre-select hotels
				if (this.data && this.data.HotelIDs) {
					const hotelIds = this.data.HotelIDs;
					const groupId = typeof hotelIds !== 'string' ? hotelIds[0].split('_')[0] : hotelIds.split('_')[0];
					let selectedItems = [];
					for (let i = 0; i < this.hotelListGroup.length; i++) {
						if (this.hotelListGroup[i].name === groupId) {
							selectedItems = this.hotelListGroup[i].items.filter(hotel =>
								typeof hotelIds !== 'string' ? hotelIds.includes(hotel.id) : hotel.id === hotelIds
							);
						}
					}
					this.hotels.setValue(selectedItems);
				}
			});
	}
}
