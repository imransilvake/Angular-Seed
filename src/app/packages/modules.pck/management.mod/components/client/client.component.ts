// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';

// app
import { ClientViewTypeEnum } from '../../enums/client-view-type.enum';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../../authorization.mod/services/auth.service';
import { SidebarService } from '../../../../frame.pck/services/sidebar.service';
import { StorageService } from '../../../../core.pck/storage.mod/services/storage.service';
import { StorageTypeEnum } from '../../../../core.pck/storage.mod/enums/storage-type.enum';

@Component({
	selector: 'app-client',
	templateUrl: './client.component.html'
})

export class ClientComponent implements OnInit, OnDestroy {
	public pageView: ClientViewTypeEnum = ClientViewTypeEnum.DEFAULT;
	public id;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _clientService: ClientService,
		private _authService: AuthService,
		private _sidebarService: SidebarService,
		private _storageService: StorageService
	) {
		// set current user state
		this._clientService.currentUser = this._authService.currentUserState;
	}

	ngOnInit() {
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

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * load component services
	 */
	private loadComponentServices() {
		// set app state
		this._clientService.appState = this._sidebarService.appState;

		// set current user state
		this._clientService.currentUser = this._authService.currentUserState;

		// clear memory storage to get fresh data on refresh
		this._storageService.remove(null, StorageTypeEnum.MEMORY);

		// refresh client services
		forkJoin({
			hotelGroupList: this._clientService.clientRefreshHotelGroupList(this.id),
			licenseSystemData: this._clientService.clientFetchLicenseSystem(this.id),
			hgaModules: this._clientService.clientFetchHGAModules(),
			hgaOverride: this._clientService.clientFetchOverrideHGA(this.id),
			hsaModules: this._clientService.clientFetchHotelStaffAppModules(),
			hmaModules: this._clientService.clientFetchHotelManagerAppModules()
		}).pipe(takeUntil(this._ngUnSubscribe)).subscribe(res => {
			const result = {
				hotelGroupList: res.hotelGroupList,
				licenseSystemData: res.licenseSystemData,
				hgaModules: res.hgaModules,
				hgaOverride: res.hgaOverride,
				hsaModules: res.hsaModules,
				hmaModules: res.hmaModules
			};

			// save to client data
			this._clientService.clientData = result;

			// emit result
			this._clientService.clientDataEmitter.next(result);
		});
	}
}
