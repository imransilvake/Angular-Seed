// angular
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';

// store
import { Store } from '@ngrx/store';

// app
import * as ErrorHandlerActions from '../../../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';
import { SelectTypeEnum } from '../../../../../core.pck/fields.mod/enums/select-type.enum';
import { SelectDefaultInterface } from '../../../../../core.pck/fields.mod/interfaces/select-default-interface';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';
import { ValidationService } from '../../../../../core.pck/fields.mod/services/validation.service';
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';
import { UserService } from '../../../services/user.service';
import { UserInterface } from '../../../interfaces/user.interface';
import { ProxyService } from '../../../../../core.pck/proxy.mod/services/proxy.service';
import { AppServices } from '../../../../../../../app.config';
import { SelectGroupInterface } from '../../../../../core.pck/fields.mod/interfaces/select-group.interface';
import { ErrorHandlerInterface } from '../../../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-user-form',
	templateUrl: './user-form.component.html',
	styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit, OnDestroy {
	public faIcons = [faSpinner];
	public formFields;
	public selectTypeDefault = SelectTypeEnum.DEFAULT;
	public selectTypeGroup = SelectTypeEnum.GROUP;
	public languageList: SelectDefaultInterface[] = [];
	public salutationList: SelectDefaultInterface[] = [];
	public currentRole;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];
	public roleGroupManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.GROUP_MANAGER];
	public roleHotelManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.HOTEL_MANAGER];
	public roleList: SelectDefaultInterface[] = [];
	public hotelList: SelectDefaultInterface[] = [];
	public hotelListGroup: SelectGroupInterface[] = [];
	public selectedHotels = [];
	public errorMessage;
	public loading = false;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public _dialogRef: MatDialogRef<UserFormComponent>,
		private _proxyService: ProxyService,
		private _userService: UserService,
		private _utilityService: UtilityService,
		private _store: Store<{ ErrorHandlerInterface: ErrorHandlerInterface }>,
		private _i18n: I18n
	) {
		// form group
		this.formFields = new FormGroup({
			languageName: new FormControl('', [
				Validators.required
			]),
			salutation: new FormControl('', [
				Validators.required
			]),
			firstName: new FormControl('', [
				Validators.required,
				Validators.minLength(2),
				ValidationService.textValidator,
				Validators.maxLength(125)
			]),
			lastName: new FormControl('', [
				Validators.required,
				Validators.minLength(2),
				ValidationService.textValidator,
				Validators.maxLength(125)
			]),
			email: new FormControl('', [
				Validators.required,
				ValidationService.emailValidator
			]),
			role: new FormControl('', [
				Validators.required
			]),
			hotels: new FormControl('', [
				Validators.required
			])
		});
	}

	ngOnInit() {
		// set current role
		this.currentRole = this._userService.appState.role;

		// set language list
		this.languageList = this._utilityService.getAuthLanguageList();

		// set salutation list
		this.salutationList = this._utilityService.getSalutationList();

		// set salutation list
		this.roleList = this._utilityService.userRoleList;

		// hotels set based on logged in users
		let payload;
		switch (this.currentRole) {
			case this.roleAdmin:
				// hotel list
				this.getAllGroupHotels();

				// hotels
				this.hotels.disable();
				break;
			case this.roleGroupManager:
				// role list
				this.roleList = this.roleList.slice(1, 5);

				// payload
				payload = {
					pathParams: { groupId: this._userService.appState.groupId }
				};

				// hotel list
				this.getGroupHotels(payload);
				break;
			case this.roleHotelManager:
				// role list
				this.roleList = this.roleList.slice(2, 5);

				// payload
				const hotelIds = this._userService.currentUser.profile['custom:hotelId'].split(',');
				payload = {
					pathParams: { groupId: this._userService.appState.groupId },
					queryParams: { 'HotelIDs[]': hotelIds }
				};

				// hotel list
				this.getGroupHotels(payload);
				break;
		}

		// fill form with data
		if (this.data) {
			// language
			if (this.data.Language) {
				const language = this.languageList.filter(item => item.id === this.data.Language.toLowerCase());
				this.languageName.setValue(...language);
			}

			// salutation
			if (this.data.Gender) {
				const salutation = this.salutationList.filter(item => item.id === this.data.Gender.toUpperCase());
				this.salutation.setValue(...salutation);
			}

			// firstName, lastName & email
			this.firstName.setValue(this.data.Firstname);
			this.lastName.setValue(this.data.Lastname);
			this.email.setValue(this.data.Email);
			this.email.disable();

			// current role: group manager
			if (this.currentRole === this.roleGroupManager) {
				this.hotels.disable();
			}

			// check user selected role and pre-select role
			if (this.data.Role) {
				const roleId = this.data.Role.replace(' ', '_').toUpperCase();
				const role = this.roleList.filter(role => role.id === roleId);
				this.role.setValue(...role);

				// current role: not admin and group manager
				if (roleId !== this.roleAdmin && roleId !== this.roleGroupManager) {
					this.hotels.enable();
				}
			}
		}

		// listen: on role change
		this.role.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res) {
					if (
						this.currentRole === this.roleAdmin && res.id === this.roleAdmin ||
						this.currentRole === this.roleGroupManager && res.id === this.roleGroupManager
					) {
						this.hotels.disable();
					} else {
						this.hotels.enable();
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
								id: 'Error_Management_User_GroupSelection_Title'
							}),
							message: this._i18n({
								value: 'Description: Wrong Group Selection Error Exception',
								id: 'Error_Management_User_GroupSelection_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
						};
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
					} else {
						this.selectedHotels = this.hotels.value;
					}
				}
			});

		// listen: form loading state
		this._userService.formLoadingState
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => this.loading = false);

		// listen: error message
		this._userService.errorMessage
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// update loading state
				this.loading = false;

				// error message
				this.errorMessage = res;
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * getters
	 */
	get languageName() {
		return this.formFields.get('languageName');
	}

	get salutation() {
		return this.formFields.get('salutation');
	}

	get firstName() {
		return this.formFields.get('firstName');
	}

	get lastName() {
		return this.formFields.get('lastName');
	}

	get email() {
		return this.formFields.get('email');
	}

	get role() {
		return this.formFields.get('role');
	}

	get hotels() {
		return this.formFields.get('hotels');
	}

	get isFormValid() {
		return this.formFields.valid;
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
					const hotels = this.hotelList.filter(hotel => hotelIds.includes(hotel.id));
					this.hotels.setValue(hotels);
				}
			});
	}

	/**
	 * get all group hotels
	 */
	public getAllGroupHotels() {
		this._proxyService
			.getAPI(AppServices['Utilities']['HotelListAll'])
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
					}
				});

				// pre-select hotels
				if (this.data && this.data.HotelIDs) {
					const hotelIds = this.data.HotelIDs;
					const groupId = hotelIds[0].split('_')[0];
					let selectedItems = [];
					for (let i = 0; i < this.hotelListGroup.length; i++) {
						if (this.hotelListGroup[i].name === groupId) {
							selectedItems = this.hotelListGroup[i].items.filter(hotel => hotelIds.includes(hotel.id))
						}
					}
					this.hotels.setValue(selectedItems);
				}
			});
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		// show spinner
		this.loading = true;

		// prepare group and hotel id.
		let groupId;
		let hotelIds;
		if (this.role.value.id === this.roleAdmin) {
			groupId = 'ANY';
			hotelIds = 'ANY';
		} else if (this.currentRole === this.roleGroupManager && this.role.value.id === this.roleGroupManager) {
			groupId = this._userService.appState.groupId;
			hotelIds = 'ANY';
		} else if(this.currentRole === this.roleAdmin && this.role.value.id === this.roleGroupManager) {
			groupId = this.hotels.value && this.hotels.value[0].id.split('_')[0];
			hotelIds = 'ANY';
		} else {
			const hotels = this.hotels.value.map(hotel => hotel.id);
			groupId = this.hotels.value && this.hotels.value[0].id.split('_')[0];
			hotelIds = hotels;
		}

		// form payload
		const formData: UserInterface = {
			groupId: groupId,
			email: this.email.value,
			lang: this.languageName.value.id,
			salutation: this.salutation.value.id,
			role: this.role.value.id,
			hotelId: hotelIds,
			firstName: this.firstName.value,
			lastName: this.lastName.value
		};

		// create / update user
		let formPayload;
		if (!this.data) {
			formPayload = {
				creator: this._userService.currentUser.profile.email,
				...formData
			};

			// service
			this._userService.userCreate(formPayload, this.formFields, this._dialogRef);
		} else {
			formPayload = {
				ID: this.data.ID,
				...formData
			};

			// service
			this._userService.userUpdate(formPayload, this._dialogRef, this.data && this.data.Role);
		}
	}

	/**
	 * close modal
	 */
	public onClickCloseModal() {
		this._dialogRef.close();
	}
}
