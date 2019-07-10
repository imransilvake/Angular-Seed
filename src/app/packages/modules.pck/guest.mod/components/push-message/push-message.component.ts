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

@Component({
	selector: 'app-push-message',
	templateUrl: './push-message.component.html'
})

export class PushMessageComponent implements OnDestroy {
	public pageView: AppViewTypeEnum = AppViewTypeEnum.DEFAULT;
	public id;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _authService: AuthService,
		private _sidebarService: SidebarService,
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
		// disable dropdown on form view
		this._sidebarService.hotelGroupListEvent.emit(this.pageView === AppViewTypeEnum.DEFAULT);

		// set app state
		this._pushMessageService.appState = this._sidebarService.appState;

		// refresh services
		forkJoin({

		}).pipe(takeUntil(this._ngUnSubscribe)).subscribe(res => {
			const result = {

			};

			// emit result
			this._pushMessageService.dataEmitter.next(result);
		});
	}
}
