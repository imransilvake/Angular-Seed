// angular
import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';

// app
import { ClientViewTypeEnum } from '../../enums/client-view-type.enum';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../../authorization.mod/services/auth.service';
import { SidebarService } from '../../../../frame.pck/services/sidebar.service';
import { StorageService } from '../../../../core.pck/storage.mod/services/storage.service';
import { StorageTypeEnum } from '../../../../core.pck/storage.mod/enums/storage-type.enum';
import { ClientAppTypeEnum } from '../../enums/client-app-type.enum';

@Component({
	selector: 'app-client',
	templateUrl: './client.component.html'
})

export class ClientComponent implements OnDestroy {
	public pageView: ClientViewTypeEnum = ClientViewTypeEnum.DEFAULT;
	public id;
	public groupName;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _clientService: ClientService,
		private _authService: AuthService,
		private _sidebarService: SidebarService,
		private _storageService: StorageService
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
		// disable dropdown on form view
		this._sidebarService.hotelGroupListEvent.emit(this.pageView !== ClientViewTypeEnum.DEFAULT);

		// set app state
		this._clientService.appState = this._sidebarService.appState;

		// clear memory storage to get fresh data on refresh
		this._storageService.remove(null, StorageTypeEnum.MEMORY);

		// refresh client services
		forkJoin({
			hotelGroupList: this._clientService.clientFetchHotelGroupList(this.id),
			licenseSystemData: this._clientService.clientFetchLicenseSystem(this.id),
			hgaModules: this._clientService.clientFetchAppModules(this.id, ClientAppTypeEnum.HGA),
			hgaOverride: this._clientService.clientFetchOverrideHGA(this.id),
			hsaModules: this._clientService.clientFetchAppModules(this.id, ClientAppTypeEnum.HSA),
			hmaModules: this._clientService.clientFetchAppModules(this.id, ClientAppTypeEnum.HMA)
		}).pipe(takeUntil(this._ngUnSubscribe)).subscribe(res => {
			const result = {
				hotelGroupList: res.hotelGroupList,
				licenseSystemData: res.licenseSystemData,
				hgaModules: res.hgaModules,
				hgaOverride: res.hgaOverride,
				hsaModules: res.hsaModules,
				hmaModules: res.hmaModules
			};

			// emit result
			this._clientService.clientDataEmitter.next(result);
		});
	}
}
