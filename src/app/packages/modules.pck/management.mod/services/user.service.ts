// angular
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// app
import { AppOptions, AppServices } from '../../../../../app.config';
import { AppStateEnum } from '../../../frame.pck/enums/app-state.enum';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { UserInterface } from '../interfaces/user.interface';
import { UserRoleEnum } from '../../authorization.mod/enums/user-role.enum';
import { DialogTypeEnum } from '../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';
import { UserListTypeEnum } from '../enums/user-list-type.enum';

@Injectable()
export class UserService {
	public currentUser;
	public appState;
	public tableServices;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);
	public errorMessage: EventEmitter<string> = new EventEmitter();
	public formLoadingState: EventEmitter<boolean> = new EventEmitter();

	constructor(
		private _proxyService: ProxyService,
		private _i18n: I18n,
		private _dialogService: DialogService
	) {
	}

	/**
	 * fetch new/existing users
	 *
	 * @param id
	 * @param userListType
	 */
	public userFetchList(id: string, userListType: string) {
		const allApi = AppServices['Management']['User_List_All'];
		const hotelGroupApi = AppServices['Management']['User_List_Group'];
		const hotelApi = AppServices['Management']['User_List_Hotel'];
		const searchAllApi = AppServices['Management']['User_List_Search_All'];
		const searchHotelGroupApi = AppServices['Management']['User_List_Search_Group'];
		const searchHotelApi = AppServices['Management']['User_List_Search_Hotel'];
		const queryParamsPayload = {
			offset: 0,
			limit: AppOptions.tablePageSizeLimit,
			state: userListType,
			column: 'CreateDate',
			sort: 'desc'
		};

		// validate app state
		if (this.appState || !id) {
			let payload = {};
			let api;
			switch (this.appState.type) {
				case AppStateEnum.ALL:
					// set api
					api = allApi;

					// set payload
					if (userListType === UserListTypeEnum.APPLIED) {
						payload = {
							queryParams: queryParamsPayload
						};

						// set table resources
						this.tableServices = {
							...this.tableServices,
							new: {
								api: allApi,
								payload: payload
							}
						};
					} else {
						payload = {
							queryParams: queryParamsPayload
						};

						// set table resources
						this.tableServices = {
							...this.tableServices,
							existing: {
								api: allApi,
								payload: payload
							}
						};
					}

					// set table resources
					this.tableServices = {
						...this.tableServices,
						searchApi: searchAllApi,
						uniqueID: 'ID',
						sortDefaultColumn: 'CreateDate'
					};
					break;
				case AppStateEnum.GROUP:
					// set api
					api = hotelGroupApi;

					// set payload
					if (userListType === UserListTypeEnum.APPLIED) {
						payload = {
							pathParams: {
								groupId: this.appState && this.appState.groupId
							},
							queryParams: queryParamsPayload
						};

						// set table resources
						this.tableServices = {
							...this.tableServices,
							new: {
								api: hotelGroupApi,
								payload: payload
							}
						};
					} else {
						payload = {
							pathParams: {
								groupId: this.appState && this.appState.groupId
							},
							queryParams: queryParamsPayload
						};

						// set table resources
						this.tableServices = {
							...this.tableServices,
							existing: {
								api: hotelGroupApi,
								payload: payload
							}
						};
					}

					// set table resources
					this.tableServices = {
						...this.tableServices,
						searchApi: searchHotelGroupApi,
						uniqueID: 'ID',
						sortDefaultColumn: 'CreateDate'
					};
					break;
				case AppStateEnum.HOTEL:
					// set api
					api = hotelApi;

					// set payload
					if (userListType === UserListTypeEnum.APPLIED) {
						payload = {
							pathParams: {
								groupId: this.appState && this.appState.groupId,
								hotelId: this.appState && this.appState.hotelId
							},
							queryParams: queryParamsPayload
						};

						// set table resources
						this.tableServices = {
							...this.tableServices,
							new: {
								api: hotelApi,
								payload: payload
							}
						};
					} else {
						payload = {
							pathParams: {
								groupId: this.appState && this.appState.groupId,
								hotelId: this.appState && this.appState.hotelId
							},
							queryParams: queryParamsPayload
						};

						// set table resources
						this.tableServices = {
							...this.tableServices,
							existing: {
								api: hotelApi,
								payload: payload
							}
						};
					}

					// set table resources
					this.tableServices = {
						...this.tableServices,
						searchApi: searchHotelApi,
						uniqueID: 'ID',
						sortDefaultColumn: 'CreateDate'
					};
					break;
			}

			// service
			return this._proxyService
				.getAPI(api, payload)
				.pipe(map(res => res));
		} else {
			return of(null);
		}
	}

	/**
	 * remove user
	 *
	 * @param type
	 * @param row
	 * @param text
	 * @param refreshEmitter
	 */
	public userRemove(type: number, row: any, text: any, refreshEmitter: any) {
		// dialog payload
		const data = {
			type: DialogTypeEnum.CONFIRMATION,
			payload: {
				...text,
				icon: 'dialog_confirmation',
				buttonTexts: [
					this._i18n({
						value: 'Button - OK',
						id: 'Common_Button_OK'
					}),
					this._i18n({
						value: 'Button - Cancel',
						id: 'Common_Button_Cancel'
					}),
				]
			}
		};

		// listen: dialog service
		this._dialogService
			.showDialog(data)
			.subscribe(res => {
				// delete / decline
				if (res) {
					// payload
					let payload: any = {
						bodyParams: {
							email: row.Email,
							ID: row.ID
						}
					};

					let api;
					switch (this.appState.type) {
						case AppStateEnum.ALL:
							// set api
							api = AppServices['Management']['User_List_Remove_All'];
							break;
						case AppStateEnum.GROUP:
							// set api
							api = AppServices['Management']['User_List_Remove_Group'];

							// set payload
							payload = {
								...payload,
								pathParams: {
									groupId: this.appState && this.appState.groupId
								}
							};
							break;
						case AppStateEnum.HOTEL:
							// set api
							api = AppServices['Management']['User_List_Remove_Hotel'];

							payload = {
								...payload,
								pathParams: {
									groupId: this.appState && this.appState.groupId,
									hotelId: this.appState && this.appState.hotelId
								}
							};
							break;
					}

					// service
					this._proxyService
						.postAPI(api, payload)
						.subscribe(() => refreshEmitter.emit());
				}
			});
	}

	/**
	 * create new user
	 *
	 * @param formPayload
	 * @param formFields
	 * @param dialogRef
	 */
	public userCreate(formPayload: UserInterface, formFields: FormGroup, dialogRef: any) {
		const role = this.appState.role;
		let api;
		let payload;
		switch (role) {
			case UserRoleEnum[UserRoleEnum.ADMIN]:
				// set api
				api = AppServices['Management']['User_Form_Create_All'];

				// set payload
				payload = {
					bodyParams: formPayload
				};
				break;
			case UserRoleEnum[UserRoleEnum.GROUP_MANAGER]:
				// set api
				api = AppServices['Management']['User_Form_Create_Group'];

				// set payload
				payload = {
					bodyParams: formPayload,
					pathParams: {
						groupId: this.appState && this.appState.groupId
					}
				};
				break;
			case UserRoleEnum[UserRoleEnum.HOTEL_MANAGER]:
				// set api
				api = AppServices['Management']['User_Form_Create_Hotel'];

				// set payload
				payload = {
					bodyParams: formPayload,
					pathParams: {
						groupId: this.appState && this.appState.groupId,
						hotelId: this.appState && this.appState.hotelId
					}
				};
				break;
		}

		// service
		this._proxyService.postAPI(api, payload)
			.subscribe(() => {
				// payload
				const dialogPayload = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						icon: 'dialog_tick',
						title: this._i18n({ value: 'Title: New User Created', id: 'Management_User_Form_NewUserCreated_Success_Title' }),
						message: this._i18n({
							value: 'Description: New User Created',
							id: 'Management_User_Form_NewUserCreated_Success_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
					}
				};

				// dialog service
				this._dialogService
					.showDialog(dialogPayload)
					.subscribe(() => dialogRef.close(true));
			}, (err: HttpErrorResponse) => {
				if (err.error.detail.code === 'UsernameExistsException') {
					const message = this._i18n({
						value: 'Description: Username Exists Exception',
						id: 'Management_User_Form_Error_UsernameExistsException_Description'
					});

					// set field to show error message
					formFields.get('email').setErrors({ backendError: true, text: message });

					// message
					this.errorMessage.emit(message);
				}
			});
	}

	/**
	 * create new user
	 *
	 * @param formPayload
	 * @param dialogRef
	 * @param updateUser
	 */
	public userUpdate(formPayload: UserInterface, dialogRef: any, updateUser: string) {
		const role = this.appState.role;
		let api;
		let payload;
		switch (role) {
			case UserRoleEnum[UserRoleEnum.ADMIN]:
				// set api
				if (updateUser && updateUser !== '-') {
					api = AppServices['Management']['User_Form_Update_All'];
				} else {
					api = AppServices['Management']['User_Form_Confirm_All'];
				}

				// set payload
				payload = {
					bodyParams: formPayload
				};
				break;
			case UserRoleEnum[UserRoleEnum.GROUP_MANAGER]:
				// set api
				if (updateUser && updateUser !== '-') {
					api = AppServices['Management']['User_Form_Update_Group'];
				} else {
					api = AppServices['Management']['User_Form_Confirm_Group'];
				}

				// set payload
				payload = {
					bodyParams: formPayload,
					pathParams: {
						groupId: this.appState && this.appState.groupId
					}
				};
				break;
			case UserRoleEnum[UserRoleEnum.HOTEL_MANAGER]:
				// set api
				if (updateUser && updateUser !== '-') {
					api = AppServices['Management']['User_Form_Update_Hotel'];
				} else {
					api = AppServices['Management']['User_Form_Confirm_Hotel'];
				}

				// set payload
				payload = {
					bodyParams: formPayload,
					pathParams: {
						groupId: this.appState && this.appState.groupId,
						hotelId: this.appState && this.appState.hotelId
					}
				};
				break;
		}

		// service
		this._proxyService.postAPI(api, payload)
			.subscribe(() => {
				// update loading state
				this.formLoadingState.emit();

				// payload
				const dialogPayload = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						icon: 'dialog_tick',
						title: this._i18n({ value: 'Title: User Updated', id: 'Management_UserUpdated_Form_Success_Title' }),
						message: this._i18n({
							value: 'Description: User Updated',
							id: 'Management_UserUpdated_Form_Success_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
					}
				};

				// dialog service
				this._dialogService
					.showDialog(dialogPayload)
					.subscribe(() => dialogRef.close(true));
			});
	}
}
