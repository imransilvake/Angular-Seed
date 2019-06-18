// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

// app
import { UserService } from '../../services/user.service';
import { StorageTypeEnum } from '../../../../core.pck/storage.mod/enums/storage-type.enum';
import { AuthService } from '../../../authorization.mod/services/auth.service';
import { SidebarService } from '../../../../frame.pck/services/sidebar.service';
import { StorageService } from '../../../../core.pck/storage.mod/services/storage.service';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit, OnDestroy {
	public newUsersTableApiUrl;
	public existingUsersTableApiUrl;
	public userNewRegistrationsList;
	public userOldAccountsList;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _userService: UserService,
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

	ngOnInit() {
		// set table api
		this.newUsersTableApiUrl = this._userService.userTablesServices.newUsers;
		this.existingUsersTableApiUrl = this._userService.userTablesServices.existingUsers;

		// listen: new registrations
		this._userService.userDataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && (res.newUsers || res.existingUsers)) {
					// set new users list
					this.userNewRegistrationsList = res.newUsers;

					// set old user accounts list
					this.userOldAccountsList = res.existingUsers;
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
		// set app state
		this._userService.appState = this._sidebarService.appState;

		// set current user state
		this._userService.currentUser = this._authService.currentUserState;

		// clear memory storage to get fresh data on refresh
		this._storageService.remove(null, StorageTypeEnum.MEMORY);

		// refresh user services
		forkJoin({
			newUsers: this._userService.userFetchNewRegistrations(),
			existingUsers: this._userService.userFetchExistingAccounts()
		}).pipe(takeUntil(this._ngUnSubscribe)).subscribe(res => {
			const result = {
				newUsers: res.newUsers,
				existingUsers: res.existingUsers
			};

			// save to user data
			this._userService.userData = result;

			// emit result
			this._userService.userDataEmitter.next(result);
		});
	}

	/**
	 * registration: update table row
	 *
	 * @param id
	 */
	public onClickNewRegistrationFetchId(id?: string) {
		console.log(id);
	}

	/**
	 * create new user
	 */
	public onClickCreateNewUser() {
	}

	/**
	 * old users: update table row
	 *
	 * @param id
	 */
	public onClickOldUserFetchId(id?: string) {
		console.log(id);
	}
}
