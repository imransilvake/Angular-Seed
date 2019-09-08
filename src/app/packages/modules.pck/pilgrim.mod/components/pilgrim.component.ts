// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

// app
import { AuthService } from '../../authorization.mod/services/auth.service';
import { SidebarService } from '../../../frame.pck/services/sidebar.service';
import { PilgrimService } from '../services/pilgrim.service';

@Component({
	selector: 'app-pilgrim',
	templateUrl: './pilgrim.component.html'
})

export class PilgrimComponent implements OnInit, OnDestroy {
	public pilgrimData;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _router: Router,
		private _pilgrimService: PilgrimService,
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
		// listen: fetch pilgrim data
		this._pilgrimService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && res.pilgrimData) {
					this.pilgrimData = res.pilgrimData;
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
		this._pilgrimService.currentUser = this._authService.currentUserState;

		// set app state
		this._pilgrimService.appState = this._sidebarService.appState;

		// refresh services
		forkJoin({
			pilgrimData: this._pilgrimService.fetchPilgrimData()
		}).pipe(takeUntil(this._ngUnSubscribe)).subscribe(res => {
			const result = {
				pilgrimData: res.pilgrimData
			};

			// emit result
			this._pilgrimService.dataEmitter.next(result);
		});
	}
}
