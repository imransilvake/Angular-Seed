// angular
import { Component, OnDestroy } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

// app
import { AppViewTypeEnum } from '../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { AuthService } from '../../../authorization.mod/services/auth.service';
import { SidebarService } from '../../../../frame.pck/services/sidebar.service';
import { PushMessageService } from '../../services/push-message.service';
import { GuestNotificationTypeEnum } from '../../enums/guest-notification-type.enum';
import { UtilityService } from '../../../../utilities.pck/accessories.mod/services/utility.service';

@Component({
	selector: 'app-push-message',
	templateUrl: './guest-push-message.component.html'
})

export class GuestPushMessageComponent implements OnDestroy {
	public pageView: AppViewTypeEnum = AppViewTypeEnum.DEFAULT;
	public id;
	public data;
	public isHotel = false;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _authService: AuthService,
		private _sidebarService: SidebarService,
		private _utilityService: UtilityService,
		private _pushMessageService: PushMessageService
	) {
		// listen: router event
		this.router.events
			.pipe(
				takeUntil(this._ngUnSubscribe),
				filter(event => event instanceof NavigationEnd)
			)
			.subscribe(() => this.triggerServices());
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * trigger all components services
	 */
	public triggerServices() {
		// set current user state
		this._pushMessageService.currentUser = this._authService.currentUserState;

		// set app state
		this._pushMessageService.appState = this._sidebarService.appState;

		// validate hotel selection
		this.isHotel = this._sidebarService.appState.hotelId.split('_')[1];

		// only available when hotel is selected
		if (this.isHotel) {
			// refresh services
			forkJoin({
				periodicGuestNotifications: this._pushMessageService.guestNotificationsFetch(this.id, GuestNotificationTypeEnum.PERIODIC),
				recentGuestNotifications: this._pushMessageService.guestNotificationsFetch(this.id, GuestNotificationTypeEnum.RECENT),
				formLanguages: this._utilityService.getSystemSelectedLanguages(this.pageView, this._pushMessageService.appState)
			}).pipe(takeUntil(this._ngUnSubscribe)).subscribe(res => {
				const result = {
					periodicGuestNotifications: res.periodicGuestNotifications,
					recentGuestNotifications: res.recentGuestNotifications,
					formLanguages: res.formLanguages
				};

				// emit result
				this._pushMessageService.dataEmitter.next(result);
			});
		}
	}
}