// angular
import { EventEmitter, Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

// app
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AppOptions, AppServices } from '../../../../../app.config';
import { LicenseSystemInterface } from '../interfaces/license-system.interface';
import { LoadingAnimationService } from '../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { LicenseIdentifierInterface } from '../interfaces/license-identifier.interface';
import { DialogTypeEnum } from '../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';
import { HgaOverrideInterface } from '../interfaces/hga-override.interface';
import { SystemEndpointInterface } from '../interfaces/system-endpoint.interface';
import { ClientAppTypeEnum } from '../enums/client-app-type.enum';
import { ClientAppInterface } from '../interfaces/client-app.interface';
import { UserRoleEnum } from '../../authorization.mod/enums/user-role.enum';
import { AppStateEnum } from '../../../frame.pck/enums/app-state.enum';
import { HelperService } from '../../../utilities.pck/accessories.mod/services/helper.service';

@Injectable()
export class ClientService {
	public appState;
	public tableServices;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);
	public errorMessage: EventEmitter<string> = new EventEmitter();
	public newlyCreatedGroupId: EventEmitter<string> = new EventEmitter();

	constructor(
		private _proxyService: ProxyService,
		private _helperService: HelperService,
		private _i18n: I18n,
		private _loadingAnimationService: LoadingAnimationService,
		private _dialogService: DialogService
	) {
	}

	/**
	 * fetch client hotel group list
	 *
	 * @param id
	 */
	public clientFetchHotelGroupList(id: string) {
		const allApi = AppServices['Management']['Client_List_All'];
		const hotelGroupApi = AppServices['Management']['Client_List_Group'];
		const hotelApi = AppServices['Management']['Client_List_Hotel'];
		const queryParamsPayload = {
			offset: 0,
			limit: AppOptions.tablePageSizeLimit
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
					payload = {
						queryParams: queryParamsPayload
					};

					// set table resources
					this.tableServices = {
						...this.tableServices,
						hotelsByGroup: allApi,
						payload: payload,
						uniqueID: 'Id'
					};
					break;
				case AppStateEnum.GROUP:
					// set api
					api = hotelGroupApi;

					// set payload
					payload = {
						pathParams: {
							groupId: this.appState && this.appState.groupId
						},
						queryParams: queryParamsPayload
					};

					// set table resources
					this.tableServices = {
						...this.tableServices,
						hotelsByGroup: hotelGroupApi,
						payload: payload,
						uniqueID: 'Id'
					};
					break;
				case AppStateEnum.HOTEL:
					// set api
					api = hotelApi;

					// set payload
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
						hotelsByGroup: hotelApi,
						payload: payload,
						uniqueID: 'Id'
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
	 * fetch license & system information
	 *
	 * @param id
	 */
	public clientFetchLicenseSystem(id: string) {
		return !id || this.appState.role !== UserRoleEnum[UserRoleEnum.ADMIN] ? of(null) : this._proxyService
			.getAPI(AppServices['Management']['Client_Form_License_And_System'], {
				pathParams: { groupId: id }
			})
			.pipe(map(res => res));
	}

	/**
	 * get license list for Licence and System
	 */
	public clientFetchLicenseList() {
		return [
			{
				id: 1,
				text: this._i18n({
					value: '1 Hotel',
					id: 'Management_Client_License_List_1'
				}),
				value: 2
			},
			{
				id: 5,
				text: this._i18n({
					value: '2 to 5 Hotels',
					id: 'Management_Client_License_List_2_5'
				}),
				value: 12
			},
			{
				id: 20,
				text: this._i18n({
					value: '6 to 20 Hotels',
					id: 'Management_Client_License_List_6_20'
				}),
				value: 56
			},
			{
				id: 50,
				text: this._i18n({
					value: '21 to 50 Hotels',
					id: 'Management_Client_License_List_21_50'
				}),
				value: 150
			},
			{
				id: 100,
				text: this._i18n({
					value: '51 to 100 Hotels',
					id: 'Management_Client_License_List_51_100'
				}),
				value: 320
			},
			{
				id: 150,
				text: this._i18n({
					value: '101 to 150 Hotels',
					id: 'Management_Client_License_List_101_150'
				}),
				value: 510
			},
			{
				id: 250,
				text: this._i18n({
					value: '151 to 250 hotels',
					id: 'Management_Client_License_List_151_250'
				}),
				value: 900
			}
		];
	}

	/**
	 * validate license
	 *
	 * @param formPayload
	 * @param formFields
	 */
	public clientValidateLicenseIdentifier(formPayload: LicenseIdentifierInterface, formFields: FormGroup) {
		this._proxyService
			.postAPI(AppServices['Management']['Client_Form_Validate_License_Group'], { bodyParams: formPayload })
			.subscribe(() => this.errorMessage.emit(), (err: HttpErrorResponse) => {
				if (err.error.detail.code === 'InvalidGroupID') {
					const message = this._i18n({
						value: 'Description: Invalid Group ID Exception',
						id: 'Member_Client_License_SystemIdentifier_Error_InvalidGroupID_Description'
					});

					// set field to show error message
					formFields.get('GroupID').setErrors({ backendError: true, text: message });

					// message
					this.errorMessage.emit(message);
				}
			});
	}

	/**
	 * validate system endpoint
	 *
	 * @param validateFormPayload
	 * @param formFields
	 * @param licenseData
	 */
	public clientValidateSystemEndpoint(validateFormPayload: SystemEndpointInterface, formFields: FormGroup, licenseData: LicenseSystemInterface) {
		this._proxyService
			.postAPI(AppServices['Management']['Client_Form_Validate_System_Endpoint'], { bodyParams: validateFormPayload })
			.subscribe(res => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// validate
				if (res && res.success) {
					// clear message
					this.errorMessage.emit();

					// payload
					const updateFormPayload: LicenseSystemInterface = {
						...licenseData,
						System: {
							BackendEndpointURL: formFields.value.BackendEndpointURL,
							BackendUsername: formFields.value.BackendUsername,
							BackendPassword: formFields.value.BackendPassword,
							BackendEndpointToken: formFields.value.BackendEndpointToken,
							IsReservationRequired: formFields.value.Reservation,
							UseTargetGroups: formFields.value.UseTargetGroups,
							SyncInterval: formFields.value.SyncInterval,
							Languages: [
								formFields.value.PrimaryLanguageName && formFields.value.PrimaryLanguageName.id,
								formFields.value.SecondaryLanguageName && formFields.value.SecondaryLanguageName.id
							],
							BackendType: 'TOURISMUSSUITE'
						}
					};

					// update system information
					this.clientUpdateLicenseAndSystem(updateFormPayload);
				}
			}, (err) => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				if (err && err.status === 500) {
					const message = this._i18n({
						value: 'Description: Invalid Endpoint Credentials Exception',
						id: 'Member_Client_System_Error_InvalidEndpointCredentials_Description'
					});

					// set fields to show error message
					formFields.get('BackendUsername').setErrors({ backendError: true, text: message });
					formFields.get('BackendPassword').setErrors({ backendError: true, text: message });
					formFields.get('BackendEndpointToken').setErrors({ backendError: true, text: message });

					// message
					this.errorMessage.emit(message);
				} else {
					const message = this._i18n({
						value: 'Description: Invalid Endpoint Url Exception',
						id: 'Member_Client_System_Error_InvalidEndpointUrl_Description'
					});

					// set field to show error message
					formFields.get('BackendEndpointURL').setErrors({ backendError: true, text: message });

					// message
					this.errorMessage.emit(message);
				}
			});
	}

	/**
	 * update license & system information
	 *
	 * @param formPayload
	 */
	public clientUpdateLicenseAndSystem(formPayload: LicenseSystemInterface) {
		this._proxyService
			.postAPI(AppServices['Management']['Client_Form_Update_License_And_System_Group'], { bodyParams: formPayload })
			.subscribe(() => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// payload
				const dialogPayload = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						icon: 'dialog_tick',
						title: this._i18n({
							value: 'Title: Client License & System Data Updated',
							id: 'Management_Client_License_System_Success_Title'
						}),
						message: this._i18n({
							value: 'Description: Client License & System Data Updated',
							id: 'Management_Client_License_System_Success_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
					}
				};

				// dialog service
				this._dialogService
					.showDialog(dialogPayload)
					.subscribe(() =>
						// pass newly created group id
						this.newlyCreatedGroupId.emit(formPayload.GroupID)
					);
			});
	}

	/**
	 * fetch hga override status
	 *
	 * @param id
	 */
	public clientFetchOverrideHGA(id: string) {
		// role: ADMIN & GROUP_MANAGER
		if (this._helperService.permissionLevel2(this.appState.role)) {
			return this._proxyService
				.getAPI(AppServices['Management']['Client_Form_HGA_Override_All'], {
					pathParams: {
						groupId: this.appState.role === UserRoleEnum[UserRoleEnum.ADMIN] ? id : this.appState.groupId,
						appId: ClientAppTypeEnum.HGA
					}
				})
				.pipe(map(res => res));
		}

		// role: HOTEL_MANAGER && HOTEL_SUB_MANAGER
		if (this._helperService.permissionLevel4(this.appState.role)) {
			return this._proxyService
				.getAPI(AppServices['Management']['Client_Form_HGA_Override_Hotel'], {
					pathParams: {
						groupId: this.appState.role === UserRoleEnum[UserRoleEnum.ADMIN] ? id : this.appState.groupId,
						hotelId: this.appState.hotelId,
						appId: ClientAppTypeEnum.HGA
					}
				})
				.pipe(map(res => res));
		}
	}

	/**
	 * update hga override state
	 *
	 * @param formPayload
	 */
	public clientUpdateOverrideHGA(formPayload: HgaOverrideInterface) {
		this._proxyService
			.postAPI(AppServices['Management']['Client_Form_HGA_Override_Group'], {
				bodyParams: formPayload,
				pathParams: { groupId: formPayload.GroupID }
			})
			.subscribe(() => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
	}

	/**
	 * fetch HGA / HSA / HMA modules
	 *
	 * @param id
	 * @param clientAppType
	 */
	public clientFetchAppModules(id: string, clientAppType: string) {
		if (id) {
			const isHotel = this.appState && (this.appState.hotelId !== this.appState.groupId);
			if (isHotel) {
				return this._proxyService
					.getAPI(AppServices['Management']['Client_Form_App_List_Hotel'], {
						pathParams: {
							groupId: id,
							hotelId: this.appState && this.appState.hotelId,
							appId: clientAppType
						}
					})
					.pipe(map(res => {
						if (res && res.Modules) {
							switch (clientAppType) {
								case ClientAppTypeEnum.HGA:
									return this.mapHGAModules(res.Modules);
								case ClientAppTypeEnum.HSA:
									return this.mapHSAModules(res.Modules);
								case ClientAppTypeEnum.HMA:
									return this.mapHMAModules(res.Modules);
							}
						}
						return null;
					}));
			} else {
				return this._proxyService
					.getAPI(AppServices['Management']['Client_Form_App_List_Group'], {
						pathParams: {
							groupId: id,
							appId: clientAppType
						}
					})
					.pipe(map(res => {
						if (res && res.Modules) {
							switch (clientAppType) {
								case ClientAppTypeEnum.HGA:
									return this.mapHGAModules(res.Modules);
								case ClientAppTypeEnum.HSA:
									return this.mapHSAModules(res.Modules);
								case ClientAppTypeEnum.HMA:
									return this.mapHMAModules(res.Modules);
							}
						}
						return null;
					}));
			}
		} else {
			return of(null);
		}
	}

	/**
	 * update HGA / HSA / HMA modules
	 *
	 * @param id
	 * @param clientAppType
	 * @param rawFormData
	 * @param modules
	 */
	public clientUpdateAppModules(id: string, clientAppType: string, rawFormData: any, modules: any) {
		// map modules
		const mapModules = rawFormData.modules
			.map((module, index) => {
				return {
					ModuleID: modules[index].data.ModuleID,
					Licensed: module.Licensed ? module.Licensed : false,
					Active: module.Active ? module.Active : false,
					Preferred: module.Preferred ? 1 : 0,
					Params: {}
				};
			});

		// form payload
		const formPayload: ClientAppInterface = {
			AppID: clientAppType,
			GroupID: id,
			Modules: mapModules
		};

		// service
		const isHotel = this.appState.hotelId && (this.appState.hotelId !== this.appState.groupId);
		if (isHotel) {
			this._proxyService
				.postAPI(AppServices['Management']['Client_Form_App_Update_Hotel'], {
					pathParams: {
						groupId: id,
						hotelId: this.appState.hotelId
					},
					bodyParams: { ...formPayload, HotelID: this.appState.hotelId }
				})
				.subscribe(() => {
					// stop loading animation
					this._loadingAnimationService.stopLoadingAnimation();

					// payload
					const dialogPayload = {
						type: DialogTypeEnum.NOTICE,
						payload: {
							icon: 'dialog_tick',
							title: this._i18n({
								value: 'Title: App Data Updated',
								id: 'Management_Client_App_Success_Title'
							}),
							message: this._i18n({
								value: 'Description: App Data Updated',
								id: 'Management_Client_App_Success_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
						}
					};

					// dialog service
					this._dialogService.showDialog(dialogPayload).subscribe();
				});
		} else {
			this._proxyService
				.postAPI(AppServices['Management']['Client_Form_App_Update_Group'], {
					pathParams: { groupId: id },
					bodyParams: formPayload
				})
				.subscribe(() => {
					// stop loading animation
					this._loadingAnimationService.stopLoadingAnimation();

					// payload
					const dialogPayload = {
						type: DialogTypeEnum.NOTICE,
						payload: {
							icon: 'dialog_tick',
							title: this._i18n({
								value: 'Title: App Data Updated',
								id: 'Management_Client_App_Success_Title'
							}),
							message: this._i18n({
								value: 'Description: App Data Updated',
								id: 'Management_Client_App_Success_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
						}
					};

					// dialog service
					this._dialogService.showDialog(dialogPayload).subscribe();
				});
		}
	}

	/**
	 * map HGA modules
	 *
	 * @param response
	 */
	private mapHGAModules(response: any) {
		return [
			{
				'name': 'General',
				'modules': [response.filter(module => module.ModuleID === 'HGA_GUEST_NOTIFICATIONS')[0] ? {
					data: response.filter(module => module.ModuleID === 'HGA_GUEST_NOTIFICATIONS')[0],
					details: {
						title: this._i18n({
							value: 'Guest Push Notifications',
							id: 'Management_Client_HGA_General_Guest_Push_Notifications_Title'
						}),
						description: this._i18n({
							value: 'Send individual and automatic push notifications to your guests',
							id: 'Management_Client_HGA_General_Guest_Push_Notifications_Description'
						})
					}
				} : null]
			},
			{
				'name': 'Hotel Room',
				'modules': [response.filter(module => module.ModuleID === 'HGA_ROOM_KEY')[0] ? {
					data: response.filter(module => module.ModuleID === 'HGA_ROOM_KEY')[0],
					details: {
						title: this._i18n({
							value: 'Room Key Code',
							id: 'Management_Client_HGA_Room_KeyCode_Title'
						}),
						description: this._i18n({
							value: 'Offer your guests access to the digital room key',
							id: 'Management_Client_HGA_Room_KeyCode_Description'
						})
					}
				} : null, response.filter(module => module.ModuleID === 'HGA_ROOM_CLEANING')[0] ? {
					data: response.filter(module => module.ModuleID === 'HGA_ROOM_CLEANING')[0],
					details: {
						title: this._i18n({
							value: 'Room Cleaning Status',
							id: 'Management_Client_HGA_Room_CleaningStatus_Title'
						}),
						description: this._i18n({
							value: 'Guests can see if the room is in cleaning process',
							id: 'Management_Client_HGA_Room_CleaningStatus_Description'
						})
					}
				} : null, response.filter(module => module.ModuleID === 'HGA_ROOM_EMERGENCY')[0] ? {
					data: response.filter(module => module.ModuleID === 'HGA_ROOM_EMERGENCY')[0],
					details: {
						title: this._i18n({
							value: 'Room Emergency Button',
							id: 'Management_Client_HGA_Room_EmergencyButton_Title'
						}),
						description: this._i18n({
							value: 'Offer your Guests the possibility to send an emergency message to the reception',
							id: 'Management_Client_HGA_Room_EmergencyButton_Description'
						})
					}
				} : null, response.filter(module => module.ModuleID === 'HGA_ROOM_REPAIR')[0] ? {
					data: response.filter(module => module.ModuleID === 'HGA_ROOM_REPAIR')[0],
					details: {
						title: this._i18n({
							value: 'Room Repair Message',
							id: 'Management_Client_HGA_Room_RepairMessage_Title'
						}),
						description: this._i18n({
							value: 'Guests can inform the hotel manager about necessary room repairs',
							id: 'Management_Client_HGA_Room_RepairMessage_Description'
						})
					}
				} : null]
			},
			{
				'name': 'Hotel General',
				'modules': [response.filter(module => module.ModuleID === 'HGA_HOTEL_DEALS')[0] ? {
					data: response.filter(module => module.ModuleID === 'HGA_HOTEL_DEALS')[0],
					details: {
						title: this._i18n({
							value: 'Hotel Deals',
							id: 'Management_Client_HGA_Hotel_HotelDeals_Title'
						}),
						description: this._i18n({
							value: 'Inform your guests about specific offers in your hotel',
							id: 'Management_Client_HGA_Hotel_HotelDeals_Description'
						})
					}
				} : null, response.filter(module => module.ModuleID === 'HGA_HOTEL_DETAILS')[0] ? {
					data: response.filter(module => module.ModuleID === 'HGA_HOTEL_DETAILS')[0],
					details: {
						title: this._i18n({
							value: 'Hotel Details',
							id: 'Management_Client_HGA_Hotel_HotelDetails_Title'
						}),
						description: this._i18n({
							value: 'Guests can have a direct access to all facilities of your hotel',
							id: 'Management_Client_HGA_Hotel_HotelDetails_Description'
						})
					}
				} : null, response.filter(module => module.ModuleID === 'HGA_HOTEL_TRAVEL')[0] ? {
					data: response.filter(module => module.ModuleID === 'HGA_HOTEL_TRAVEL')[0],
					details: {
						title: this._i18n({
							value: 'Guest Travel Details',
							id: 'Management_Client_HGA_Hotel_GuestTravelDetails_Title'
						}),
						description: this._i18n({
							value: 'Guests can see their stay details',
							id: 'Management_Client_HGA_Hotel_GuestTravelDetails_Description'
						})
					}
				} : null]
			},
			{
				'name': 'Hotel Magazine',
				'modules': [response.filter(module => module.ModuleID === 'HGA_HOTEL_MAGAZINE')[0] ? {
					data: response.filter(module => module.ModuleID === 'HGA_HOTEL_MAGAZINE')[0],
					details: {
						title: this._i18n({
							value: 'Hotel Magazine',
							id: 'Management_Client_HGA_Hotel_HotelMagazine_Title'
						}),
						description: this._i18n({
							value: 'Guests can read your digital hotel magazine',
							id: 'Management_Client_HGA_Hotel_HotelMagazine_Description'
						})
					}
				} : null]
			},
			{
				'name': 'Hotel Reviews',
				'modules': [response.filter(module => module.ModuleID === 'HGA_HOTEL_RATINGS')[0] ? {
					data: response.filter(module => module.ModuleID === 'HGA_HOTEL_RATINGS')[0],
					details: {
						title: this._i18n({
							value: 'TrustYou Hotel Ratings',
							id: 'Management_Client_HGA_Hotel_TrustYouHotelRatings_Title'
						}),
						description: this._i18n({
							value: 'Guest can leave a hotel rating during stay',
							id: 'Management_Client_HGA_Hotel_TrustYouHotelRatings_Description'
						})
					}
				} : null]
			}
		].map(m => {
			return {
				name: m.name,
				modules: m.modules.filter(n => n)
			};
		});
	}

	/**
	 * map HSA modules
	 *
	 * @param response
	 */
	private mapHSAModules(response: any) {
		return [
			{
				'name': 'All',
				'modules': [response.filter(module => module.ModuleID === 'HSA_CLEANING')[0] ? {
					data: response.filter(module => module.ModuleID === 'HSA_CLEANING')[0],
					details: {
						title: this._i18n({
							value: 'House Keeping',
							id: 'Management_Client_HSA_HouseKeeping_Title'
						}),
						description: this._i18n({
							value: 'Housekeeping Description',
							id: 'Management_Client_HSA_HouseKeeping_Description'
						})
					}
				} : null, response.filter(module => module.ModuleID === 'HSA_REPAIR')[0] ? {
					data: response.filter(module => module.ModuleID === 'HSA_REPAIR')[0],
					details: {
						title: this._i18n({
							value: 'Repairs',
							id: 'Management_Client_HSA_Repairs_Title'
						}),
						description: this._i18n({
							value: 'Repairs Description',
							id: 'Management_Client_HSA_Repairs_Description'
						})
					}
				} : null]
			}
		].map(m => {
			return {
				name: m.name,
				modules: m.modules.filter(n => n)
			};
		});
	}

	/**
	 * map HMA modules
	 *
	 * @param response
	 */
	private mapHMAModules(response: any) {
		return [
			{
				'name': 'All',
				'modules': [response.filter(module => module.ModuleID === 'HMA_STATISTICS')[0] ? {
					data: response.filter(module => module.ModuleID === 'HMA_STATISTICS')[0],
					details: {
						title: this._i18n({
							value: 'Online Booking Statistics',
							id: 'Management_Client_HAM_OnlineBooking_Title'
						}),
						description: this._i18n({
							value: 'Online Booking Statistics Description',
							id: 'Management_Client_HAM_OnlineBooking_Description'
						})
					}
				} : null, response.filter(module => module.ModuleID === 'HMA_STATISTICS')[0] ? {
					data: response.filter(module => module.ModuleID === 'HMA_STATISTICS')[0],
					details: {
						title: this._i18n({
							value: 'International Guest Overview',
							id: 'Management_Client_HAM_GuestOverview_Title'
						}),
						description: this._i18n({
							value: 'Guest Overview Description',
							id: 'Management_Client_HAM_GuestOverview_Description'
						})
					}
				} : null]
			}
		].map(m => {
			return {
				name: m.name,
				modules: m.modules.filter(n => n)
			};
		});
	}
}
