// angular
import { Component, OnDestroy } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';

// app
import { AppViewTypeEnum } from '../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { AuthService } from '../../../authorization.mod/services/auth.service';
import { SidebarService } from '../../../../frame.pck/services/sidebar.service';
import { UserRoleEnum } from '../../../authorization.mod/enums/user-role.enum';
import { VersionService } from '../../services/version.service';
import { UtilityService } from '../../../../utilities.pck/accessories.mod/services/utility.service';

@Component({
	selector: 'app-version',
	templateUrl: './version.component.html',
})

export class VersionComponent implements OnDestroy {
	public pageView: AppViewTypeEnum = AppViewTypeEnum.DEFAULT;
	public id;
	public data;
	public currentRole;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _versionService: VersionService,
		private _authService: AuthService,
		private _sidebarService: SidebarService,
		private _utilityService: UtilityService,
	) {
		// set current user role
		this.currentRole = this._authService.currentUserState.profile['cognito:groups'][0];

		// role: admin
		if (this.currentRole === this.roleAdmin) {
			// listen: router event
			this.router.events
				.pipe(
					takeUntil(this._ngUnSubscribe),
					filter(event => event instanceof NavigationEnd)
				)
				.subscribe(() => this.triggerServices());
		}
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
		this._versionService.currentUser = this._authService.currentUserState;

		// set app state
		this._versionService.appState = this._sidebarService.appState;

		// refresh services
		forkJoin({
			versionList: this._versionService.versionFetchList(this.id),
			formLanguages: this._utilityService.getSystemSelectedLanguages(this.pageView, this._versionService.appState)
		}).pipe(takeUntil(this._ngUnSubscribe)).subscribe(res => {
			const result = {
				versionList: res.versionList,
				formLanguages: res.formLanguages
			};

			// emit result
			this._versionService.dataEmitter.next(result);
		});
	}
}
