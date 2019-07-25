// angular
import { EventEmitter, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

// app
import { faBook, faDatabase, faEnvelopeOpenText, faExternalLinkAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import { ROUTING } from '../../../../environments/environment';
import { SidebarInterface } from '../interfaces/sidebar.interface';
import { SelectGroupInterface } from '../../core.pck/fields.mod/interfaces/select-group.interface';
import { StorageTypeEnum } from '../../core.pck/storage.mod/enums/storage-type.enum';
import { AppServices, LocalStorageItems, SessionStorageItems } from '../../../../app.config';
import { StorageService } from '../../core.pck/storage.mod/services/storage.service';
import { AuthService } from '../../modules.pck/authorization.mod/services/auth.service';
import { ProxyService } from '../../core.pck/proxy.mod/services/proxy.service';
import { UserRoleEnum } from '../../modules.pck/authorization.mod/enums/user-role.enum';
import { HelperService } from '../../utilities.pck/accessories.mod/services/helper.service';

@Injectable({ providedIn: 'root' })
export class SidebarService {
	public hotelGroupListEvent: EventEmitter<boolean> = new EventEmitter(false);
	public hotelGroupListRoutes = [
		`/${ ROUTING.notifications.routes.overview }`,
		`/${ ROUTING.management.routes.user }`,
		`/${ ROUTING.management.routes.client }`,
		`/${ ROUTING.content.routes.guestOffers }`,
		`/${ ROUTING.content.routes.guestPushMessage }`
	];

	constructor(
		private _authService: AuthService,
		private _storageService: StorageService,
		private _helperService: HelperService,
		private _proxyService: ProxyService
	) {
	}

	/**
	 * set app state
	 *
	 * @param data
	 */
	set appState(data) {
		const storageItem = this._authService.currentUserState.rememberMe ? LocalStorageItems.appState : SessionStorageItems.appState;
		const storageType = this._authService.currentUserState.rememberMe ? StorageTypeEnum.PERSISTANT : StorageTypeEnum.SESSION;
		this._storageService.put(storageItem, data, storageType);
	}

	/**
	 * get app state
	 */
	get appState() {
		return (
			this._storageService.get(LocalStorageItems.appState, StorageTypeEnum.PERSISTANT) ||
			this._storageService.get(SessionStorageItems.appState, StorageTypeEnum.SESSION)
		);
	}

	/**
	 * get sidebar menu list
	 */
	public static getSidebarMenuList() {
		const sidebarMenuList: SidebarInterface[] = [
			{
				name: 'Dashboard',
				icon: faHome,
				children: [
					{
						name: 'Home',
						url: `/${ ROUTING.pages.dashboard }`,
					}
				]
			},
			{
				name: 'Content',
				icon: faBook,
				children: [
					{
						name: 'Guest Offers',
						url: `/${ ROUTING.content.routes.guestOffers }`,
						externalIcon: faExternalLinkAlt
					},
					{
						name: 'Guest Push Message',
						url: `/${ ROUTING.content.routes.guestPushMessage }`,
						externalIcon: faExternalLinkAlt
					}
				]
			},
			{
				name: 'Notifications',
				icon: faEnvelopeOpenText,
				children: [
					{
						name: 'Overview',
						url: `/${ ROUTING.notifications.routes.overview }`,
						externalIcon: faExternalLinkAlt
					}
				]
			},
			{
				name: 'Management',
				icon: faDatabase,
				children: [
					{
						name: 'User',
						url: `/${ ROUTING.management.routes.user }`,
						externalIcon: faExternalLinkAlt
					},
					{
						name: 'Client',
						url: `/${ ROUTING.management.routes.client }`,
						externalIcon: faExternalLinkAlt
					},
					{
						name: 'Broadcast',
						url: `/${ ROUTING.management.routes.broadcast }`,
						externalIcon: faExternalLinkAlt
					}
				]
			}
		];

		return sidebarMenuList;
	}

	/**
	 * get hotel by group list
	 */
	public getHotelsByGroup() {
		const groupId = this._authService.currentUserState.profile['custom:hotel_group_id'];
		const hotelIds = this._authService.currentUserState.profile['custom:hotelId'].split(',');
		const role = this._authService.currentUserState.profile['cognito:groups'][0];
		let api;
		let payload;

		switch (role) {
			case UserRoleEnum[UserRoleEnum.ADMIN]:
				// set api
				api = AppServices['Utilities']['Hotels_List_All'];
				break;
			case UserRoleEnum[UserRoleEnum.GROUP_MANAGER]:
				// set api
				api = AppServices['Utilities']['Hotels_List_Group'];

				// set payload
				payload = {
					pathParams: { groupId: groupId }
				};
				break;
			case UserRoleEnum[UserRoleEnum.HOTEL_MANAGER]:
			case UserRoleEnum[UserRoleEnum.HOTEL_SUB_MANAGER]:
				// set api
				api = AppServices['Utilities']['Hotels_List_Group'];

				// set payload
				payload = {
					pathParams: { groupId: groupId },
					queryParams: { 'HotelIDs[]': hotelIds }
				};
				break;
		}

		return this._proxyService
			.getAPI(api, payload)
			.pipe(
				map(res => {
					const response = res.items;
					let hotelByGroupList: SelectGroupInterface[] = [];

					// role: ADMIN
					if (role === UserRoleEnum[UserRoleEnum.ADMIN]) {
						hotelByGroupList.push({
							id: 'All',
							name: 'All'
						});
					}

					// map response
					const mapped = response
						.filter(hotel => hotel.hasOwnProperty('HotelID'))
						.reduce((acc, hotel) => {
							// role: HOTEL_MANAGER & HOTEL_SUB_MANAGER
							if (this._helperService.permissionLevel4(role)) {
								hotelByGroupList.push({
									id: (this._helperService.permissionLevel4(role)) ? hotel.HotelID : hotel.GroupID,
									name: (this._helperService.permissionLevel4(role)) ? hotel.Name : hotel.GroupID
								});
							}

							// role: ADMIN & GROUP_MANAGER
							if (this._helperService.permissionLevel2(role)) {
								if (!acc.hasOwnProperty(hotel.GroupID)) {
									acc[hotel.GroupID] = [];
								}
								acc[hotel.GroupID].push({
									id: hotel.HotelID,
									text: hotel.Name
								});
								return acc;
							}
						}, {});

					// role: ADMIN & GROUP_MANAGER
					if (this._helperService.permissionLevel2(role)) {
						for (const key in mapped) {
							if (mapped.hasOwnProperty(key)) {
								hotelByGroupList.push({
									id: key,
									name: key,
									items: mapped[key]
								});
							}
						}
					}

					// role: HOTEL_MANAGER && HOTEL_SUB_MANAGER
					if (this._helperService.permissionLevel4(role)) {
						hotelByGroupList = Array
							.from(new Set(hotelByGroupList.map(a => a.id)))
							.map(id => hotelByGroupList.find(a => a.id === id));
					}

					return hotelByGroupList;
				})
			);
	}
}
