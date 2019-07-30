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
import { GuestRepairInterface } from '../../../interfaces/guest-repair.interface';

@Component({
	selector: 'app-guest-repairs-form',
	templateUrl: './guest-repairs-form.component.html',
	styleUrls: ['./guest-repairs-form.component.scss']
})

export class GuestRepairsFormComponent implements OnInit, OnDestroy {
	@Output() changeRepairsView: EventEmitter<any> = new EventEmitter();
	@Output() categoryEmitter: EventEmitter<any> = new EventEmitter();
	@Input() id;
	@Input() data;

	public formFields;
	public entryFormFields;
	public systemLanguages;
	public systemInfo;
	public languageList = [];
	public title = 'Form';
	public categoryId;
	public subCategoryId;

	public isAccess = false;
	public hideSelectedEntryButtons = -1;
	public selectTypeDefault = SelectTypeEnum.DEFAULT;
	public selectTypeGroup = SelectTypeEnum.GROUP;
	public hotelList: SelectDefaultInterface[] = [];
	public hotelListGroup: SelectGroupInterface[] = [];
	public selectedHotels = [];
	public subCategoriesList = [];

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
					if (this.languageList.length !== 0) {
						const control = <FormArray>this.formFields.controls.languages;
						const control2 = <FormArray>this.entryFormFields.controls.languages;
						for (let i = control.length - 1; i >= 0; i--) {
							control.removeAt(i);
							control2.removeAt(i);
						}
					}
					this.languageList = [];
					this.title = 'Form';
					this.hideSelectedEntryButtons = -1;

					// languages list
					this.systemInfo = res.formLanguages;
					if (this.systemInfo && this.systemInfo['System'] && this.systemInfo['System'].Languages.length > 1) {
						this.systemInfo['System'].Languages.forEach((language, index) => {
							// add form groups dynamically
							this.addLanguageSpecificFields();

							// add language
							this.languageList.push(
								...this.systemLanguages.filter(item => item.id === language)
							);

							// update existing data
							if (this.data) {
								const category = this.formFields.controls['languages'].controls[index].controls['field'];
								category.setValue(this.data.Name[language]);
								if (this.title && this.title === 'Form') {
									this.title = this.data.Name[language];
								}
							}
						});

						// listen: category field
						const categoryListener = this.formFields.controls['languages'].controls[0].controls['field'];
						categoryListener.valueChanges
							.pipe(takeUntil(this._ngUnSubscribe))
							.subscribe(x => this.title = x);
					}
				}

				// update existing data
				if (this.data) {
					// category id
					this.categoryId = this.data.ID;

					// access
					this.isAccess = this.data.Access.toLowerCase() !== 'group';
					this.access.setValue(this.isAccess);

					// set entry list
					this._guestRepairsService.guestRepairsSubCategoriesFetch(this.data)
						.pipe(takeUntil(this._ngUnSubscribe))
						.subscribe(list => this.subCategoriesList = list.data);
				}
			});

		// listen: category creation
		this.categoryEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// set category id;
				if (res && res.data) {
					this.categoryId = res.data;
				}

				// set entry list
				if (this.data) {
					this._guestRepairsService.guestRepairsSubCategoriesFetch(this.data)
						.pipe(takeUntil(this._ngUnSubscribe))
						.subscribe(list => this.subCategoriesList = list.data);
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
	 *
	 * @param repairEntryForm
	 * @param subCategoryId
	 */
	public onSubmitForm(repairEntryForm: boolean, subCategoryId?: number) {
		const formData = this.formFields.getRawValue();
		const entryFormData = this.entryFormFields.getRawValue();

		// category
		const category = {};
		if (this.languageList && this.languageList.length) {
			for (let i = 0; i < this.languageList.length; i++) {
				if (repairEntryForm) {
					category[this.languageList[i].id] = entryFormData.languages[i].field;
				} else {
					category[this.languageList[i].id] = formData.languages[i].field;
				}
			}
		}

		// hotels
		const hotels = this.hotels.value && this.hotels.value.length > 0 && this.hotels.value.map(h => h.id);

		// state, access
		let access = (this.access.value) ? 'HOTEL' : 'GROUP';

		// permission level: 4
		if (this._helperService.permissionLevel4(this.currentRole)) {
			access = 'HOTEL';
		}

		// category form
		const catData = !repairEntryForm ? { Parent: null, Level: 1 } : { Parent: this.categoryId, Level: 2 };

		// id
		let id = (!!this.data && !repairEntryForm) ? { ID: this.data.ID, Sort: this.data.Sort } : {};
		id = subCategoryId ? { ID: subCategoryId, Sort: this.data.Sort } : id;

		// form
		const formPayload: GuestRepairInterface = {
			...id,
			...catData,
			GroupID: this._guestRepairsService.appState.groupId,
			HotelIDs: hotels,
			Name: category,
			Access: access
		};

		// modal message state
		const modalMessageState = !!(this.data && formPayload.Level === 1 || this.data && formPayload.Level === 2 && subCategoryId);

		// service
		this._guestRepairsService.guestUpdateRepair(formPayload, this.categoryEmitter, modalMessageState);

		// repair entry form
		if (repairEntryForm) {
			// reset entry form fields
			this.entryFormFields.reset();

			// reset buttons
			this.hideSelectedEntryButtons = -1;
		}
	}

	/**
	 * on submit form
	 */
	public onSubmitEntryForm() {
		// submit form
		this.onSubmitForm(true, this.subCategoryId);

		// reset
		this.subCategoryId = null;
	}

	/**
	 * edit entry
	 *
	 * @param row
	 * @param index
	 */
	public onClickEditEntry(row: any, index: number) {
		// hide buttons
		this.hideSelectedEntryButtons = index;

		// set sub category id
		this.subCategoryId = row.ID;

		// set values
		if (this.languageList && this.languageList.length) {
			for (let i = 0; i < this.languageList.length; i++) {
				const name = row.Name[this.languageList[i].id];
				this.entryFormLanguages[i].controls['field'].setValue(name);
			}
		}
	}

	/**
	 * delete entry
	 *
	 * @param row
	 * @param index
	 */
	public onClickDeleteEntry(row: any, index: number) {

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
