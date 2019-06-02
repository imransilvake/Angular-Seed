// angular
import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { ClientViewTypeEnum } from '../../enums/client-view-type.enum';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../../authorization.mod/services/auth.service';

@Component({
	selector: 'app-client',
	templateUrl: './client.component.html'
})

export class ClientComponent implements OnDestroy {
	public pageView: ClientViewTypeEnum = ClientViewTypeEnum.DEFAULT;
	public hotelId;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _clientService: ClientService,
		private _authService: AuthService
	) {
		// initialize reload system
		this.initReloadSystem();
	}

	/**
	 * initialize reload system
	 */
	private initReloadSystem() {
		// listen: router event
		this.router.events
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe((e: any) => {
				if (e instanceof NavigationEnd) {
					// load component services
					this.loadComponentServices();
				}
			});
	}

	/**
	 * load component services
	 */
	private loadComponentServices() {
		// set current user state
		this._clientService.currentUser = this._authService.currentUserState;

		// client hotels list
		this._clientService.getClientHotelsList();
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}
}
