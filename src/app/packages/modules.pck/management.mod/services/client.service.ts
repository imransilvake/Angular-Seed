// angular
import { EventEmitter, Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import TableData from '../../../../../assets/dummy/table-data';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';

@Injectable()
export class ClientService {
	public currentUser;
	public clientData;
	public clientDataEmitter: EventEmitter<any> = new EventEmitter();

	constructor(
		private _proxyService: ProxyService,
		private _i18n: I18n
	) {
	}

	/**
	 * refresh client hotels list
	 */
	public clientRefreshHotelsList() {
		this.clientData = { ...this.clientData, hotelsList: TableData };
		this.clientDataEmitter.emit(this.clientData);
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
					id: 'HGA_License_List_1'
				}),
				value: 2
			},
			{
				id: 5,
				text: this._i18n({
					value: '2 to 5 Hotels',
					id: 'HGA_License_List_2_5'
				}),
				value: 12
			},
			{
				id: 20,
				text: this._i18n({
					value: '6 to 20 Hotels',
					id: 'HGA_License_List_6_20'
				}),
				value: 56
			},
			{
				id: 50,
				text: this._i18n({
					value: '21 to 50 Hotels',
					id: 'HGA_License_List_21_50'
				}),
				value: 150
			},
			{
				id: 100,
				text: this._i18n({
					value: '51 to 100 Hotels',
					id: 'HGA_License_List_51_100'
				}),
				value: 320
			},
			{
				id: 150,
				text: this._i18n({
					value: '101 to 150 Hotels',
					id: 'HGA_License_List_101_150'
				}),
				value: 510
			},
			{
				id: 250,
				text: this._i18n({
					value: '151 to 250 hotels',
					id: 'HGA_License_List_151_250'
				}),
				value: 900
			}
		];
	}

	/**
	 * refresh HGA modules
	 *
	 */
	public clientRefreshHotelGuestAppModules() {
		const response = [
			{
				'ModuleID': 'HGA_GUEST_NOTIFICATIONS',
				'Licensed': true,
				'Active': true,
				'Preferred': 1,
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
				'Active': false,
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
		if (result) {
			this.clientData = { ...this.clientData, hgaModules: result };
			this.clientDataEmitter.emit(this.clientData);
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
				'modules': [{
					data: response.filter(module => module.ModuleID === 'HGA_GUEST_NOTIFICATIONS')[0],
					details: {
						title: this._i18n({
							value: 'Guest Push Notifications',
							id: 'Client_HGA_General_Guest_Push_Notifications_Title'
						}),
						description: this._i18n({
							value: 'Send individual and automatic push notifications to your guests',
							id: 'Client_HGA_General_Guest_Push_Notifications_Description'
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
							id: 'Client_HGA_Room_KeyCode_Title'
						}),
						description: this._i18n({
							value: 'Offer your guests access to the digital room key',
							id: 'Client_HGA_Room_KeyCode_Description'
						})
					}
				}, {
					data: response.filter(module => module.ModuleID === 'HGA_ROOM_CLEANING_STATUS')[0],
					details: {
						title: this._i18n({
							value: 'Room Cleaning Status',
							id: 'Client_HGA_Room_CleaningStatus_Title'
						}),
						description: this._i18n({
							value: 'Guests can see if the room is in cleaning process',
							id: 'Client_HGA_Room_CleaningStatus_Description'
						})
					}
				}, {
					data: response.filter(module => module.ModuleID === 'HGA_ROOM_EMERGENCY_BUTTON')[0],
					details: {
						title: this._i18n({
							value: 'Room Emergency Button',
							id: 'Client_HGA_Room_EmergencyButton_Title'
						}),
						description: this._i18n({
							value: 'Offer your Guests the possibility to send an emergency message to the reception',
							id: 'Client_HGA_Room_EmergencyButton_Description'
						})
					}
				}, {
					data: response.filter(module => module.ModuleID === 'HGA_ROOM_REPAIR_MESSAGE')[0],
					details: {
						title: this._i18n({
							value: 'Room Repair Message',
							id: 'Client_HGA_Room_RepairMessage_Title'
						}),
						description: this._i18n({
							value: 'Guests can inform the hotel manager about necessary room repairs',
							id: 'Client_HGA_Room_RepairMessage_Description'
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
							id: 'Client_HGA_Hotel_HotelDeals_Title'
						}),
						description: this._i18n({
							value: 'Inform your guests about specific offers in your hotel',
							id: 'Client_HGA_Hotel_HotelDeals_Description'
						})
					}
				}, {
					data: response.filter(module => module.ModuleID === 'HGA_HOTEL_DETAILS')[0],
					details: {
						title: this._i18n({
							value: 'Hotel Details',
							id: 'Client_HGA_Hotel_HotelDetails_Title'
						}),
						description: this._i18n({
							value: 'Guests can have a direct access to all facilities of your hotel',
							id: 'Client_HGA_Hotel_HotelDetails_Description'
						})
					}
				}, {
					data: response.filter(module => module.ModuleID === 'HGA_HOTEL_GUEST_DETAILS')[0],
					details: {
						title: this._i18n({
							value: 'Guest Travel Details',
							id: 'Client_HGA_Hotel_GuestTravelDetails_Title'
						}),
						description: this._i18n({
							value: 'Guests can see their stay details',
							id: 'Client_HGA_Hotel_GuestTravelDetails_Description'
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
							id: 'Client_HGA_Hotel_HotelMagazine_Title'
						}),
						description: this._i18n({
							value: 'Guests can read your digital hotel magazine',
							id: 'Client_HGA_Hotel_HotelMagazine_Description'
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
							id: 'Client_HGA_Hotel_TrustYouHotelRatings_Title'
						}),
						description: this._i18n({
							value: 'Guest can leave a hotel rating during stay',
							id: 'Client_HGA_Hotel_TrustYouHotelRatings_Description'
						})
					}
				}]
			}
		];
	}
}
