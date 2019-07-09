// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import * as moment from 'moment';
import { HelperService } from '../../../../utilities.pck/accessories.mod/services/helper.service';
import { ROUTING } from '../../../../../../environments/environment';
import { AuthService } from '../../../../modules.pck/authorization.mod/services/auth.service';
import { StorageTypeEnum } from '../../../../core.pck/storage.mod/enums/storage-type.enum';
import { AppServices, LocalStorageItems, SessionStorageItems } from '../../../../../../app.config';
import { StorageService } from '../../../../core.pck/storage.mod/services/storage.service';
import { ProxyService } from '../../../../core.pck/proxy.mod/services/proxy.service';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
	selector: 'app-menu-notification',
	templateUrl: './notification-menu.component.html',
	styleUrls: ['./notification-menu.component.scss']
})

export class NotificationMenuComponent implements OnInit, OnDestroy {
	public routing = ROUTING;
	public totalNotifications = 0;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _authService: AuthService,
		private _storageService: StorageService,
		private _proxyService: ProxyService,
		private _sidebarService: SidebarService
	) {
	}

	ngOnInit() {
		// listen: last request time
		this._authService.notificationLRT
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => this.totalNotifications = res);
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * stop propagation
	 * @param event
	 */
	public onClickStopPropagation(event) {
		HelperService.stopPropagation(event);
	}

	/**
	 * on notification menu open
	 */
	public onNotificationMenuOpen() {
		// reset to 0
		this.totalNotifications = 0;

		// current time in utc
		const currentTime = HelperService.getUTCDate(moment());

		// payload
		const appState = this._sidebarService.appState;
		const payload = {
			pathParams: {
				groupId: appState.groupId,
				hotelId: appState.hotelId
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
