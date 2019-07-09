// angular
import { Injectable } from '@angular/core';

// app
import { AppServices, LocalStorageItems, SessionStorageItems } from '../../../../app.config';
import { StorageTypeEnum } from '../../core.pck/storage.mod/enums/storage-type.enum';
import { ProxyService } from '../../core.pck/proxy.mod/services/proxy.service';
import { AuthService } from '../../modules.pck/authorization.mod/services/auth.service';
import { StorageService } from '../../core.pck/storage.mod/services/storage.service';

@Injectable()
export class MenuService {
	constructor(
		private _proxyService: ProxyService,
		private _authService: AuthService,
		private _storageService: StorageService
	) {
	}

	/**
	 * update last request time
	 *
	 * @param payload
	 * @param currentTime
	 */
	public updateNotificationLRT(payload: any, currentTime: any) {
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
