// angular
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { ClientViewTypeEnum } from '../../enums/client-view-type.enum';
import { ClientService } from '../../services/client.service';

@Component({
	selector: 'app-client',
	templateUrl: './client.component.html',
	styleUrls: ['./client.component.scss']
})

export class ClientComponent {
	public pageView: ClientViewTypeEnum = ClientViewTypeEnum.DEFAULT;
	public hotelId;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _clientService: ClientService
	) {
		// setup reload
		this.setupReloadSystem();
	}

	/**
	 * setup reload system
	 */
	private setupReloadSystem() {
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
		// client hotels list
		this._clientService.fetchClientHotelsList();
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}
}
