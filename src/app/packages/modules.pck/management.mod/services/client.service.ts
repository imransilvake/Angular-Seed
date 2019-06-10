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
import { AppViewTypeEnum } from '../../../frame.pck/enums/app-view-type.enum';
import { LicenseSystemInterface } from '../interfaces/license-system.interface';
import { LoadingAnimationService } from '../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { LicenseIdentifierInterface } from '../interfaces/license-identifier.interface';
import { SystemBackendEndpointUrlInterface } from '../interfaces/system-backend-endpoint-url.interface';

@Injectable()
export class ClientService {
	public appState;
	public currentUser;
	public clientData;
	public clientTablesServices;
	public clientDataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);
	public errorMessage: EventEmitter<string> = new EventEmitter();

	constructor(
		private _proxyService: ProxyService,
		private _i18n: I18n,
		private _loadingAnimationService: LoadingAnimationService
	) {
	}

	/**
	 * refresh client hotels list
	 */
	public clientRefreshHotelGroupList() {
		const allApi = AppServices['Management']['Client_Default_List'];
		const hotelGroupApi = AppServices['Management']['Client_Default_List_Hotel'];
		const payload = {
			offset: 0,
			limit: AppOptions.tablePageSizeLimit
		};

		// call service based on app state
		if (this.appState.type === AppViewTypeEnum.ALL) {
			// set table service
			this.clientTablesServices = { ...this.clientTablesServices, hotelsByGroup: allApi };

			// service
			return this._proxyService
				.getAPI(allApi, { queryParams: payload })
				.pipe(map(res => res));
		}

		// set table service
		this.clientTablesServices = { ...this.clientTablesServices, hotelsByGroup: hotelGroupApi };

		// service
		return this._proxyService
			.getAPI(hotelGroupApi, {
				pathParams: { id: this.appState.id },
				queryParams: payload
			})
			.pipe(map(res => res));
	}

	/**
	 * fetch license & system information
	 *
	 * @param groupId
	 */
	public clientFetchLicenseSystem(groupId: string) {
		return !groupId ? of(null) : this._proxyService
			.getAPI(AppServices['Management']['Client_Form_License_HotelGroup_Fetch'], {
				pathParams: { id: groupId }
			})
			.pipe(map(res => res));
	}

	/**
	 * validate license
	 *
	 * @param formPayload
	 * @param formFields
	 */
	public clientValidateLicense(formPayload: LicenseIdentifierInterface, formFields: FormGroup) {
		this._proxyService
			.postAPI(AppServices['Management']['Client_Form_License_HotelGroup_Validate'], { bodyParams: formPayload })
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
	public clientValidateSystemEndpoint(validateFormPayload: SystemBackendEndpointUrlInterface, formFields: FormGroup, licenseData: LicenseSystemInterface) {
		this._proxyService
			.postAPI(AppServices['Management']['Client_Form_System_HotelGroup_Validate'], { bodyParams: validateFormPayload })
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
				} else {

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
			.postAPI(AppServices['Management']['Client_Form_License_System_HotelGroup_Update'], { bodyParams: formPayload })
			.subscribe(() => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
	}

	/**
	 * get license list - HGA / HSA
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
	 * refresh HGA modules
	 */
	public clientRefreshHotelGuestAppModules() {
		const response = [
			{
				'ModuleID': 'HGA_GUEST_NOTIFICATIONS',
				'Licensed': true,
				'Active': true,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_ROOM_KEY',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_ROOM_CLEANING_STATUS',
				'Licensed': true,
				'Active': false,
				'Preferred': 1,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_ROOM_EMERGENCY_BUTTON',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_ROOM_REPAIR_MESSAGE',
				'Licensed': false,
				'Active': true,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_HOTEL_DEALS',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_HOTEL_DETAILS',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_HOTEL_GUEST_DETAILS',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_MAGAZINE_HOTEL_MAGAZINE',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			},
			{
				'ModuleID': 'HGA_REVIEWS_TRUSTYOU',
				'Licensed': false,
				'Active': false,
				'Preferred': 0,
				'Params': {}
			}
		];

		const result = this.mapHGAModules(response);
		return of(result);
	}

	/**
	 * refresh HSA modules
	 */
	public clientRefreshHotelStaffAppModules() {
		const response = [
			{
				'ModuleID': 'HSA_HOUSE_KEEPING',
				'Licensed': true,
				'Active': true,
				'Params': {}
			},
			{
				'ModuleID': 'HSA_REPAIRS',
				'Licensed': false,
				'Active': false,
				'Params': {}
			}
		];

		const result = this.mapHSAModules(response);
		return of(result);
	}

	/**
	 * refresh HAM modules
	 */
	public clientRefreshHotelManagerAppModules() {
		const response = [
			{
				'ModuleID': 'HAM_ONLINE_BOOKING_STATISTICS',
				'Licensed': false,
				'Active': true,
				'Params': {}
			},
			{
				'ModuleID': 'HAM_INTERNATIONAL_GUEST_OVERVIEW',
				'Licensed': false,
				'Active': true,
				'Params': {}
			}
		];

		const result = this.mapHAMModules(response);
		return of(result);
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
				'modules': [{
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
				}]
			},
			{
				'name': 'Hotel Room',
				'modules': [{
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
				}, {
					data: response.filter(module => module.ModuleID === 'HGA_ROOM_CLEANING_STATUS')[0],
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
				}, {
					data: response.filter(module => module.ModuleID === 'HGA_ROOM_EMERGENCY_BUTTON')[0],
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
				}, {
					data: response.filter(module => module.ModuleID === 'HGA_ROOM_REPAIR_MESSAGE')[0],
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
				}]
			},
			{
				'name': 'Hotel General',
				'modules': [{
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
				}, {
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
				}, {
					data: response.filter(module => module.ModuleID === 'HGA_HOTEL_GUEST_DETAILS')[0],
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
				}]
			},
			{
				'name': 'Hotel Magazine',
				'modules': [{
					data: response.filter(module => module.ModuleID === 'HGA_MAGAZINE_HOTEL_MAGAZINE')[0],
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
				}]
			},
			{
				'name': 'Hotel Reviews',
				'modules': [{
					data: response.filter(module => module.ModuleID === 'HGA_REVIEWS_TRUSTYOU')[0],
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
				}]
			}
		];
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
				'modules': [{
					data: response.filter(module => module.ModuleID === 'HSA_HOUSE_KEEPING')[0],
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
				}, {
					data: response.filter(module => module.ModuleID === 'HSA_REPAIRS')[0],
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
				}]
			}
		];
	}

	/**
	 * map HAM modules
	 *
	 * @param response
	 */
	private mapHAMModules(response: any) {
		return [
			{
				'name': 'All',
				'modules': [{
					data: response.filter(module => module.ModuleID === 'HAM_ONLINE_BOOKING_STATISTICS')[0],
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
				}, {
					data: response.filter(module => module.ModuleID === 'HAM_INTERNATIONAL_GUEST_OVERVIEW')[0],
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
				}]
			}
		];
	}
}
