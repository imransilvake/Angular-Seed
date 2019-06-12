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
		return this._proxyService.getAPI(AppServices['Utilities']['HotelList'])
			.pipe(
				map(res => {
					const hotelByGroupList: SelectGroupInterface[] = [{
						name: 'All'
					}];

					// mapping
					const mapped = res
						.filter(hotel => hotel.hasOwnProperty('id'))
						.reduce((acc, hotel) => {
							if (!acc.hasOwnProperty(hotel.group)) {
								acc[hotel.group] = [];
							}
							acc[hotel.group].push(hotel);
							return acc;
						}, {});

					// structuring
					for (const key in mapped) {
						if (mapped.hasOwnProperty(key)) {
							hotelByGroupList.push({
								name: key,
								items: mapped[key]
							});
						}
					}

					return hotelByGroupList;
				})
			);
	}
}
