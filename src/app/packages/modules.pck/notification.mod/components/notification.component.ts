// angular
import { Component, OnDestroy } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

// app
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../../authorization.mod/services/auth.service';
import { SidebarService } from '../../../frame.pck/services/sidebar.service';

@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html'
})

export class NotificationComponent implements OnDestroy {
	public data;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _authService: AuthService,
		private _sidebarService: SidebarService,
		private _notificationService: NotificationService
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
	private triggerServices() {
		// set current user state
		this._notificationService.currentUser = this._authService.currentUserState;

		// set app state
		this._notificationService.appState = this._sidebarService.appState;

		// refresh services
		forkJoin({
			notificationList: this._notificationService.notificationFetchList(this.data)
		}).pipe(takeUntil(this._ngUnSubscribe)).subscribe(res => {
			const result = {
				notificationList: res.notificationList,
			};

			// emit result
			this._notificationService.notificationDataEmitter.next(result);
		});
	}
}
