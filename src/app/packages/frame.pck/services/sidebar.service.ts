// angular
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

// app
import { faDatabase, faExternalLinkAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import { ROUTING } from '../../../../environments/environment';
import { SidebarInterface } from '../interfaces/sidebar.interface';
import { SelectGroupInterface } from '../../core.pck/fields.mod/interfaces/select-group.interface';
import { StorageTypeEnum } from '../../core.pck/storage.mod/enums/storage-type.enum';
import { AppServices, NeutralStorageItems } from '../../../../app.config';
import { StorageService } from '../../core.pck/storage.mod/services/storage.service';
import { AuthService } from '../../modules.pck/authorization.mod/services/auth.service';
import { ProxyService } from '../../core.pck/proxy.mod/services/proxy.service';
import { UserRoleEnum } from '../../modules.pck/authorization.mod/enums/user-role.enum';

@Injectable()
export class SidebarService {
	public hotelGroupListRoutes = [
		`/${ ROUTING.management.routes.client }`
	];

	constructor(
		private _authService: AuthService,
		private _storageService: StorageService,
		private _proxyService: ProxyService
	) {
	}

	/**
	 * set app state
	 *
	 * @param data
	 */
	set appState(data) {
		const storagePlace = this._authService.currentUserState.rememberMe ? StorageTypeEnum.PERSISTANT : StorageTypeEnum.SESSION;
		this._storageService.put(NeutralStorageItems.appState, data, storagePlace);
	}

	/**
	 * get app state
	 */
	get appState() {
		const storagePlace = this._authService.currentUserState.rememberMe ? StorageTypeEnum.PERSISTANT : StorageTypeEnum.SESSION;
		return this._storageService.get(NeutralStorageItems.appState, storagePlace);
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
						url: `/${ ROUTING.dashboard }`,
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
						name: 'Notifications',
						url: `/${ ROUTING.management.routes.notification }`,
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

		return this._proxyService
			.getAPI(AppServices['Utilities']['HotelListGroup'], {
				pathParams: { groupId: groupId },
				queryParams: { 'HotelIDs[]': hotelIds }
			})
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

					// mapping
					const mapped = response
						.filter(hotel => hotel.hasOwnProperty('HotelID'))
						.reduce((acc, hotel) => {
							// role: ADMIN
							if (role !== UserRoleEnum[UserRoleEnum.ADMIN]) {
								hotelByGroupList.push({
									id: (role === UserRoleEnum[UserRoleEnum.HOTEL_MANAGER]) ? hotel.HotelID : hotel.GroupID,
									name: (role === UserRoleEnum[UserRoleEnum.HOTEL_MANAGER]) ? hotel.Name : hotel.GroupID
								});
							} else { // role: GROUP_MANAGER & HOTEL_MANAGER
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

					// role: ADMIN
					if (role === UserRoleEnum[UserRoleEnum.ADMIN]) {
						for (const key in mapped) {
							if (mapped.hasOwnProperty(key)) {
								hotelByGroupList.push({
									id: key,
									name: key,
									items: mapped[key]
								});
							}
						}
					} else { // role: GROUP_MANAGER & HOTEL_MANAGER
						hotelByGroupList = Array
							.from(new Set(hotelByGroupList.map(a => a.id)))
							.map(id => {
								return hotelByGroupList.find(a => a.id === id)
							});
					}

					return hotelByGroupList;
				})
			);
	}
}
