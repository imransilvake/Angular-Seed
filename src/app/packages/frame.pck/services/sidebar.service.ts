// angular
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

// app
import { faHome, faDatabase, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { ROUTING } from '../../../../environments/environment';
import { SidebarInterface } from '../interfaces/sidebar.interface';
import { SelectGroupInterface } from '../../core.pck/fields.mod/interfaces/select-group.interface';
import { StorageTypeEnum } from '../../core.pck/storage.mod/enums/storage-type.enum';
import { NeutralStorageItems } from '../../../../app.config';
import { StorageService } from '../../core.pck/storage.mod/services/storage.service';
import { AuthService } from '../../modules.pck/authorization.mod/services/auth.service';

@Injectable()
export class SidebarService {
	constructor(
		private _authService: AuthService,
		private _storageService: StorageService
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
						url: `/${ROUTING.dashboard}`,
					}
				]
			},
			{
				name: 'Management',
				icon: faDatabase,
				children: [
					{
						name: 'User',
						url: `/${ROUTING.management.routes.user}`,
						externalIcon: faExternalLinkAlt
					},
					{
						name: 'Client',
						url: `/${ROUTING.management.routes.client}`,
						externalIcon: faExternalLinkAlt
					},
					{
						name: 'Notifications',
						url: `/${ROUTING.management.routes.notification}`,
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
	public static getHotelsByGroup() {
		const hotelByGroupList: SelectGroupInterface[] = [
			{
				name: 'All'
			},
			{
				name: 'EMO',
				items: [
					{ id: 'EMO_1', text: 'EMO Aachen' },
					{ id: 'EMO_2', text: 'EMO Bonn' },
					{ id: 'EMO_3', text: 'EMO Düsseldorf' }
				]
			},
			{
				name: 'BBH',
				items: [
					{ id: 'BBH_1', text: 'BBH Keller' },
					{ id: 'BBH_2', text: 'BBH Am Kaiser' },
					{ id: 'BBH_3', text: 'BBH Nierdorf' }
				]
			}
		];

		return of(hotelByGroupList);
	}
}
