// angular
import { Component, OnDestroy } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

// app
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../authorization.mod/services/auth.service';
import { SidebarService } from '../../../../frame.pck/services/sidebar.service';
import { AppViewTypeEnum } from '../../enums/app-view-type.enum';
import { UserListTypeEnum } from '../../enums/user-list-type.enum';
import { UserFormComponent } from './form/user-form.component';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html'
})

export class UserComponent implements OnDestroy {
	public pageView: AppViewTypeEnum = AppViewTypeEnum.DEFAULT;
	public id;
	public data;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _userService: UserService,
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

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * open form component in a modal
	 */
	public openUserFormModal() {
		// open modal
		const modal = this._dialog.open(UserFormComponent, {
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

	/**
	 * trigger all components services
	 */
	private triggerServices() {
		// set current user state
		this._userService.currentUser = this._authService.currentUserState;

		// set app state
		this._userService.appState = this._sidebarService.appState;

		// refresh user services
		forkJoin({
			newUsers: this._userService.userFetchList(this.id, UserListTypeEnum.APPLIED),
			existingUsers: this._userService.userFetchList(this.id, UserListTypeEnum.CONFIRMED)
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
