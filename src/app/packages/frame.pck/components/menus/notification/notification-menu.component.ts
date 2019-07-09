// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { HelperService } from '../../../../utilities.pck/accessories.mod/services/helper.service';
import { ROUTING } from '../../../../../../environments/environment';
import { AuthService } from '../../../../modules.pck/authorization.mod/services/auth.service';

@Component({
	selector: 'app-menu-notification',
	templateUrl: './notification-menu.component.html',
	styleUrls: ['./notification-menu.component.scss']
})

export class NotificationMenuComponent implements OnInit, OnDestroy {
	public routing = ROUTING;
	public totalNotifications = 0;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _authService: AuthService) {
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
}
