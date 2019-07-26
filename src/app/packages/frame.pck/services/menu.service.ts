// angular
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

// app
import * as moment from 'moment';
import { AppServices, LocalStorageItems, SessionStorageItems } from '../../../../app.config';
import { StorageTypeEnum } from '../../core.pck/storage.mod/enums/storage-type.enum';
import { ProxyService } from '../../core.pck/proxy.mod/services/proxy.service';
import { AuthService } from '../../modules.pck/authorization.mod/services/auth.service';
import { StorageService } from '../../core.pck/storage.mod/services/storage.service';
import { NotificationsFiltersEnums } from '../../modules.pck/notification.mod/enums/notifications-filters.enums';
import { HelperService } from '../../utilities.pck/accessories.mod/services/helper.service';
import { SidebarService } from './sidebar.service';

@Injectable()
export class MenuService {
	constructor(
		private _proxyService: ProxyService,
		private _authService: AuthService,
		private _storageService: StorageService,
		private _sidebarService: SidebarService
	) {
	}

	/**
	 * latest open notifications list
	 */
	public openNotificationsList() {
		// app state
		const appState = this._sidebarService.appState;

		// payload
		const payload = {
			pathParams: {
				groupId: appState.groupId,
				hotelId: (appState.hotelId === appState.groupId || appState.hotelId === 'ANY') ? 'All' : appState.hotelId,
			},
			queryParams: {
				state: NotificationsFiltersEnums.OPEN,
				user: this._authService.currentUserState.profile.email,
				offset: 0,
				limit: 5
			}
		};

		// service
		return this._proxyService
			.getAPI(AppServices['Notifications']['Notifications_List_Hotel'], payload)
			.pipe(map(res => res));
	}

	/**
	 * update last request time on backend
	 */
	public updateNotificationLRTOnBackend() {
		// app state
		const appState = this._sidebarService.appState;

		// current time in utc
		const currentTime = HelperService.getUTCDate(moment());

		// payload
		const payload = {
			pathParams: {
				groupId: appState.groupId,
				hotelId: (appState.hotelId === appState.groupId || appState.hotelId === 'ANY') ? 'All' : appState.hotelId,
			},
			bodyParams: {
				RequestedDate: currentTime,
				UserName: this._authService.currentUserState.profile.email
			}
		};

		// service
		this._proxyService
			.postAPI(AppServices['Notifications']['Notifications_Update_LRT'], payload)
			.subscribe(() => {
				// update current time in web storage
				const storageType = this._authService.currentUserState.rememberMe ? StorageTypeEnum.PERSISTANT : StorageTypeEnum.SESSION;
				const storageItemNotification = this._authService.currentUserState.rememberMe ? LocalStorageItems.notificationState : SessionStorageItems.notificationState;
				this._storageService.put(storageItemNotification, currentTime, storageType);
			});
	}
}
