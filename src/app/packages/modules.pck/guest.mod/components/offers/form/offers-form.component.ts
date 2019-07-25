// angular
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { I18n } from '@ngx-translate/i18n-polyfill';

// store
import { Store } from '@ngrx/store';

// app
import * as moment from 'moment';
import * as ErrorHandlerActions from '../../../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';
import { faPauseCircle, faPlayCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { GuestViewInterface } from '../../../interfaces/guest-view.interface';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';
import { SelectTypeEnum } from '../../../../../core.pck/fields.mod/enums/select-type.enum';
import { SelectDefaultInterface } from '../../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { GuestOffersService } from '../../../services/guest-offers.service';
import { GuestTypeEnum } from '../../../enums/guest-type.enum';
import { OfferInterface } from '../../../interfaces/offer.interface';
import { GuestPeriodsEnum } from '../../../enums/guest-periods.enum';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';
import { SelectGroupInterface } from '../../../../../core.pck/fields.mod/interfaces/select-group.interface';
import { ErrorHandlerInterface } from '../../../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';

@Component({
	selector: 'app-offers-form',
	templateUrl: './offers-form.component.html',
	styleUrls: ['./offers-form.component.scss']
})

export class OffersFormComponent implements OnInit, OnDestroy {
	@Output() changeOffersView: EventEmitter<any> = new EventEmitter();
	@Input() id;
	@Input() data;

	public faIcons = [faSpinner, faPlayCircle, faPauseCircle];
	public formFields;
	public systemLanguages;
	public systemInfo;
	public tabsList = [];
	public minDateFrom = moment().toDate();
	public minDateTo = moment().toDate();
	public title = 'Form';
	public previewSource;

	public isAccess = false;
	public isState = false;
	public selectTypeDefault = SelectTypeEnum.DEFAULT;
	public selectTypeGroup = SelectTypeEnum.GROUP;
	public hotelList: SelectDefaultInterface[] = [];
	public hotelListGroup: SelectGroupInterface[] = [];
	public selectedHotels = [];
	public targetGroupsList: SelectDefaultInterface[] = [];

	public currentRole;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];
	public roleGroupManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.GROUP_MANAGER];
	public roleHotelManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.HOTEL_MANAGER];
	public roleHotelSubManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.HOTEL_SUB_MANAGER];
	public permissionLevel2 = false;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _guestOfferService: GuestOffersService,
		private _utilityService: UtilityService,
		private _helperService: HelperService,
		private _formBuilder: FormBuilder,
		private _store: Store<{ ErrorHandlerInterface: ErrorHandlerInterface }>,
		private _i18n: I18n
	) {
		// target groups list
		this.targetGroupsList = this._utilityService.getTargetGroups();

		// languages
		this.systemLanguages = this._utilityService.getSystemLanguageList();

		// form group
		this.formFields = new FormGroup({
			languages: this._formBuilder.array([]),
			state: new FormControl(false),
			hotels: new FormControl('', [Validators.required]),
			targetGroups: new FormControl('', [Validators.required]),
			access: new FormControl(false),
			validity: new FormGroup({
				from: new FormControl(this.minDateFrom, [Validators.required]),
				to: new FormControl('', [Validators.required])
			}),
			barCode: new FormControl(false),
			redeem: new FormControl(false)
		});
	}

	ngOnInit() {
		// set current role
		this.currentRole = this._guestOfferService.appState.role;
		if (this.currentRole) {
			this.permissionLevel2 = this._helperService.permissionLevel2(this.currentRole);
		}

		// listen: fetch form languages
		this._guestOfferService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// form languages
				if (res && res.formLanguages) {
					// reset tab list
					this.tabsList = [];

					// tabs list
					this.systemInfo = res.formLanguages;
					if (this.systemInfo && this.systemInfo['System'] && this.systemInfo['System'].Languages.length > 1) {
						this.systemInfo['System'].Languages.forEach((language, index) => {
							// add form groups dynamically
							this.addLanguageSpecificFields();

							// add tabs
							this.tabsList.push(
								...this.systemLanguages.filter(item => item.id === language)
							);

							// title, text
							const title = this.formFields.controls['languages'].controls[index].controls['title'];
							const text = this.formFields.controls['languages'].controls[index].controls['description'];

							// update existing data
							if (this.data) {
								title.setValue(this.data.Titles[language]);
								this.title = this.data.Titles[language];
								text.setValue(this.data.Text[language]);
							}

							// listen: title field
							title.valueChanges
								.pipe(takeUntil(this._ngUnSubscribe))
								.subscribe(x => this.title = x);
						});
					}

					// update existing data
					if (this.data) {
						// access, state
						this.isAccess = this.data.Access.toLowerCase() !== 'group';
						this.access.setValue(this.isAccess);
						this.isState = this.data.State.toLowerCase() === 'active';
						this.state.setValue(this.isState);

						// barcode, redeem
						this.barCode.setValue(this.data.Data.Barcode);
						this.redeem.setValue(this.data.Data.Redeem);

						// send date
						if (this.data.SendDate) {
							const date = moment(this.data.SendDate).toDate();
							if (!moment(this.data.SendDate).isBefore(moment())) {
								this.validity.controls['from'].setValue(date);
							}
						}

						// expire date
						if (this.data.ExpDate) {
							const date = moment(this.data.ExpDate).toDate();
							if (!moment(this.data.ExpDate).isBefore(moment())) {
								this.validity.controls['to'].setValue(date);
							}
						}

						// target groups
						const selectedGroups = this.targetGroupsList.filter(target => target.id === this.data['Target Group']);
						if (selectedGroups.length) {
							this.targetGroups.setValue(...selectedGroups);
						} else {
							this.targetGroups.setValue(this.targetGroupsList[0]);
						}

						// image
						if (this.data.Image && typeof this.data.Image === 'object') {
							this.data.Image.then(x => {
								this.previewSource = x;
							});
						}
					}
				}
			});

		// listen: validity from
		this.validity.controls['from'].valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res) {
					// reset date when from is after to.
					if (moment(res).isAfter(this.validity.controls['to'].value)) {
						this.validity.controls['to'].reset();
					}
					this.minDateTo = moment(res).toDate();
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
					pathParams: { groupId: this._guestOfferService.appState.groupId }
				};

				// hotel list
				this.getGroupHotels(payload);
				break;
			case this.roleHotelManager:
			case this.roleHotelSubManager:
				// payload
				const hotelIds = this._guestOfferService.currentUser.profile['custom:hotelId'].split(',');
				payload = {
					pathParams: { groupId: this._guestOfferService.appState.groupId },
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
	get formArray() {
		return <FormArray>this.formFields.controls.languages.controls;
	}

	get state() {
		return this.formFields.get('state');
	}

	get validity() {
		return this.formFields.get('validity');
	}

	get targetGroups() {
		return this.formFields.get('targetGroups');
	}

	get hotels() {
		return this.formFields.get('hotels');
	}

	get access() {
		return this.formFields.get('access');
	}

	get barCode() {
		return this.formFields.get('barCode');
	}

	get redeem() {
		return this.formFields.get('redeem');
	}

	get isFormValid() {
		return this.formFields.valid;
	}

	/**
	 * add forms groups for each language
	 */
	public addLanguageSpecificFields() {
		(<FormArray>this.formFields.controls['languages']).push(
			new FormGroup({
				title: new FormControl('', [
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(64)
				]),
				description: new FormControl('', [
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(2000)
				])
			})
		);
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		const formData = this.formFields.getRawValue();

		// title & description
		const title = {};
		const description = {};
		if (this.tabsList && this.tabsList.length) {
			for (let i = 0; i < this.tabsList.length; i++) {
				title[this.tabsList[i].id] = formData.languages[i].title;
				description[this.tabsList[i].id] = formData.languages[i].description;
			}
		}

		// state, access
		const state = (this.state.value) ? 'ACTIVE' : 'INACTIVE';
		let access = (this.access.value) ? 'HOTEL' : 'GROUP';

		// permission level: 4
		if (this._helperService.permissionLevel4(this.currentRole)) {
			access = 'HOTEL';
		}

		// id
		const id = (!!this.data) ? {ID: this.data.ID} : {};

		// form
		const formPayload: OfferInterface = {
			...id,
			Type: GuestTypeEnum.OFFER,
			State: state,
			Title: title,
			Text: description,
			Image: this.previewSource,
			Barcode: !!this.barCode.value,
			Redeem: !!this.redeem.value,
			Trigger: GuestPeriodsEnum.ADHOC,
			SendDate: HelperService.getUTCDate(moment(this.validity.controls['from'].value)),
			ExpDate: HelperService.getUTCDate(moment(this.validity.controls['to'].value)),
			Targets: [this.targetGroups.value.id],
			HotelID: this.hotels.value.map(hotel => hotel.id),
			Access: access
		};

		// service
		this._guestOfferService.guestUpdateOffer(formPayload, this.data, this.changeOffersView);
	}

	/**
	 * close form
	 */
	public onClickCloseForm() {
		const payload: GuestViewInterface = {
			view: AppViewTypeEnum.DEFAULT
		};
		this.changeOffersView.emit(payload);
	}

	/**
	 * on tab change
	 *
	 * @param tabEvent
	 */
	public onChangeTab(tabEvent: any) {
		const titleValue = this.formArray[tabEvent.index].controls['title'].value;
		this.title = titleValue ? titleValue : 'Form';
	}

	/**
	 * toggle state
	 */
	public onClickToggleState() {
		this.isState = !this.isState;
		this.state.setValue(this.isState);
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
