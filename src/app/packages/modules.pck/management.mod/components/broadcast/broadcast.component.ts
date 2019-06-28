// angular
import { Component, OnDestroy } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';

// app
import { AppViewTypeEnum } from '../../enums/app-view-type.enum';
import { BroadcastService } from '../../services/broadcast.service';
import { AuthService } from '../../../authorization.mod/services/auth.service';
import { SidebarService } from '../../../../frame.pck/services/sidebar.service';

@Component({
	selector: 'app-system-broadcast',
	templateUrl: './broadcast.component.html',
})

export class BroadcastComponent implements OnDestroy {
	public pageView: AppViewTypeEnum = AppViewTypeEnum.DEFAULT;
	public id;
	public data;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _broadcastService: BroadcastService,
		private _authService: AuthService,
		private _sidebarService: SidebarService,
		private _dialog: MatDialog
	) {
		// listen: router event
		this.router.events
			.pipe(
				takeUntil(this._ngUnSubscribe),
				filter(event => event instanceof NavigationEnd)
			)
			.subscribe(() => this.triggerServices());
	}

	/**
	 * open form component in a modal
	 */
	public openBroadcastFormModal() {
		// open modal
		const modal = this._dialog.open(null, {
			disableClose: true,
			width: '700px',
			data: this.data
		});

		// modal after closed
		modal.afterClosed()
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res) {
					this.triggerServices();
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
	private triggerServices() {
		// set current user state
		this._broadcastService.currentUser = this._authService.currentUserState;

		// set app state
		this._broadcastService.appState = this._sidebarService.appState;
	}
}
