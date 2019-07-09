// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import * as moment from 'moment';
import { HelperService } from '../../../../utilities.pck/accessories.mod/services/helper.service';
import { ROUTING } from '../../../../../../environments/environment';
import { AuthService } from '../../../../modules.pck/authorization.mod/services/auth.service';
import { SidebarService } from '../../../services/sidebar.service';
import { MenuService } from '../../../services/menu.service';

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
		private _sidebarService: SidebarService,
		private _menuService: MenuService
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

		// service: update LRT
		this._menuService.updateNotificationLRT(payload, currentTime);
	}
}
