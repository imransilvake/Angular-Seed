// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { UserService } from '../../../services/user.service';
import { AppViewTypeEnum } from '../../../enums/app-view-type.enum';
import { UserViewInterface } from '../../../interfaces/user-view.interface';

@Component({
	selector: 'app-user-default',
	templateUrl: './user-default.component.html',
	styleUrls: ['./user-default.component.scss']
})

export class UserDefaultComponent implements OnInit, OnDestroy {
	@Output() changeUserView: EventEmitter<any> = new EventEmitter();

	public userOldAccountsList;
	public newUsersTableApiUrl;
	public existingUsersTableApiUrl;
	public userNewRegistrationsList;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _userService: UserService) {
	}

	ngOnInit() {
		// set tables api
		this.newUsersTableApiUrl = this._userService.userTablesServices.newUsers;
		this.existingUsersTableApiUrl = this._userService.userTablesServices.existingUsers;

		// listen: fetch new users & old user accounts list
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
	 * registration: update table row
	 *
	 * @param id
	 */
	public onClickNewRegistrationFetchId(id?: string) {
		// payload
		const payload: UserViewInterface = {
			view: AppViewTypeEnum.FORM,
			id: id
		};
		this.changeUserView.emit(payload);
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
		// payload
		const payload: UserViewInterface = {
			view: AppViewTypeEnum.FORM,
			id: id
		};
		this.changeUserView.emit(payload);
	}
}
