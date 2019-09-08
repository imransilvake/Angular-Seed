// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

// app
import { TrackingService } from '../services/tracking.service';
import { AuthService } from '../../authorization.mod/services/auth.service';
import { SidebarService } from '../../../frame.pck/services/sidebar.service';

@Component({
	selector: 'app-tracking',
	templateUrl: './tracking.component.html'
})

export class TrackingComponent implements OnInit, OnDestroy {
	public mapData;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _router: Router,
		private _trackingService: TrackingService,
		private _authService: AuthService,
		private _sidebarService: SidebarService
	) {
		// listen: router event
		this._router.events
			.pipe(
				takeUntil(this._ngUnSubscribe),
				filter(event => event instanceof NavigationEnd)
			)
			.subscribe(() => this.triggerServices());
	}

	ngOnInit() {
		// listen: fetch realtime map data
		this._trackingService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && res.realtimeMapData) {
					this.mapData = res.realtimeMapData;
				}
			});
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
		this._trackingService.currentUser = this._authService.currentUserState;

		// set app state
		this._trackingService.appState = this._sidebarService.appState;

		// refresh services
		forkJoin({
			realtimeMapData: this._trackingService.fetchRealtimeMapData()
		}).pipe(takeUntil(this._ngUnSubscribe)).subscribe(res => {
			const result = {
				realtimeMapData: res.realtimeMapData
			};

			// emit result
			this._trackingService.dataEmitter.next(result);
		});
	}
}
