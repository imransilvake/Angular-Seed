// angular
import { Component, OnDestroy } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

// app
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../authorization.mod/services/auth.service';
import { SidebarService } from '../../../../frame.pck/services/sidebar.service';
import { AppViewTypeEnum } from '../../enums/app-view-type.enum';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html'
})

export class UserComponent implements OnDestroy {
	public pageView: AppViewTypeEnum = AppViewTypeEnum.DEFAULT;
	public id;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _userService: UserService,
		private _authService: AuthService,
		private _sidebarService: SidebarService
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
		// set app state
		this._userService.appState = this._sidebarService.appState;

		// refresh user services
		forkJoin({
			newUsers: this._userService.userFetchNewRegistrations(this.id),
			existingUsers: this._userService.userFetchExistingAccounts()
		}).pipe(takeUntil(this._ngUnSubscribe)).subscribe(res => {
			const result = {
				newUsers: res.newUsers,
				existingUsers: res.existingUsers
			};

			// emit result
			this._userService.userDataEmitter.next(result);
		});
	}
}
