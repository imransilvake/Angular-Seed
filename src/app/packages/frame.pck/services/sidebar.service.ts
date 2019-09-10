// angular
import { EventEmitter, Injectable } from '@angular/core';

// app
import { faCalendarAlt, faHome, faMapMarkerAlt, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { ROUTING } from '../../../../environments/environment';
import { SidebarInterface } from '../interfaces/sidebar.interface';
import { StorageTypeEnum } from '../../core.pck/storage.mod/enums/storage-type.enum';
import { LocalStorageItems, SessionStorageItems } from '../../../../app.config';
import { StorageService } from '../../core.pck/storage.mod/services/storage.service';
import { AuthService } from '../../modules.pck/authorization.mod/services/auth.service';
import { ProxyService } from '../../core.pck/proxy.mod/services/proxy.service';
import { HelperService } from '../../utilities.pck/accessories.mod/services/helper.service';

@Injectable({ providedIn: 'root' })
export class SidebarService {
	public sidebarToggle: EventEmitter<boolean> = new EventEmitter(false);

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
				url: `/${ ROUTING.pages.dashboard }`
			},
			{
				name: 'Tracking',
				icon: faMapMarkerAlt,
				url: `/${ ROUTING.tracking.routes.realtimeMap }`
			},
			{
				name: 'Pilgrims',
				icon: faUser,
				url: `/${ ROUTING.pilgrim.routes.pilgrim }`
			},
			{
				name: 'Groups',
				icon: faUsers,
				url: `/${ ROUTING.group.routes.group }`
			},
			{
				name: 'Campaign',
				icon: faCalendarAlt,
				url: `/${ ROUTING.group.routes.group }/remove`
			}
		];

		return sidebarMenuList;
	}
}
