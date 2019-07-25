// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { UserService } from '../../../services/user.service';
import { UserViewInterface } from '../../../interfaces/user-view.interface';
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';

@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit, OnDestroy {
	@Output() changeUserView: EventEmitter<any> = new EventEmitter();
	@Output() refresh: EventEmitter<any> = new EventEmitter();

	public userNewRegistrationsList;
	public userExistingUsersList;
	public newUsersTable;
	public existingUsersTable;

	public currentRole: UserRoleEnum;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];
	public permissionLevel5 = false;

	private buttonType = -1;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _userService: UserService,
		private _helperService: HelperService,
		private _i18n: I18n
	) {
	}

	ngOnInit() {
		// set current user role
		this.currentRole = this._userService.appState.role;
		if (this.currentRole) {
			this.permissionLevel5 = this._helperService.permissionLevel5(this.currentRole);
		}

		// listen: fetch new users & old user accounts list
		this._userService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// set tables data
				if (res && res.newUsers) {
					// set tables resources
					this.newUsersTable = {
						api: this._userService.tableServices.new.api,
						searchApi: this._userService.tableServices.searchApi,
						payload: this._userService.tableServices.new.payload,
						uniqueID: this._userService.tableServices.uniqueID,
						sortDefaultColumn: this._userService.tableServices.sortDefaultColumn
					};

					// map new users list
					this.userNewRegistrationsList = res.newUsers;

				}

				// set tables data
				if (res && res.existingUsers) {
					// set tables resources
					this.existingUsersTable = {
						api: this._userService.tableServices.existing.api,
						searchApi: this._userService.tableServices.searchApi,
						payload: this._userService.tableServices.existing.payload,
						uniqueID: this._userService.tableServices.uniqueID,
						sortDefaultColumn: this._userService.tableServices.sortDefaultColumn
					};

					// map existing users list
					this.userExistingUsersList = res.existingUsers;
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * create new user
	 */
	public onClickCreateNewUser() {
		this.buttonType = 0;

		// change page view
		this.changePageView();
	}

	/**
	 * edit new user
	 */
	public onClickEditNewUser() {
		this.buttonType = 1;
	}

	/**
	 * edit existing user
	 */
	public onClickEditExistingUser() {
		this.buttonType = 2;
	}

	/**
	 * delete new user
	 */
	public onClickDeleteNewUser() {
		this.buttonType = 3;
	}

	/**
	 * delete existing user
	 */
	public onClickDeleteExistingUser() {
		// set button type
		this.buttonType = 4;
	}

	/**
	 * action buttons
	 *
	 * @param row
	 */
	public onClickRowActionButtons(row: any) {
		// delete / decline user
		if (this.buttonType > 2) {
			// set text
			let text;
			if (this.buttonType === 3) {
				text = {
					title: this._i18n({ value: 'Title: Decline User Confirmation', id: 'User_List_Decline_User_Confirmation_Title' }),
					message: this._i18n({ value: 'Description: Decline User Confirmation', id: 'User_List_Decline_User_Confirmation_Description' }),
				};
			} else {
				text = {
					title: this._i18n({ value: 'Title: Delete User Confirmation', id: 'User_List_Delete_User_Confirmation_Title' }),
					message: this._i18n({ value: 'Description: Delete User Confirmation', id: 'User_List_Delete_User_Confirmation_Description' }),
				};
			}

			// service
			this._userService.userRemove(this.buttonType, row, text, this.refresh);
		}

		// edit new / existing user
		if (this.buttonType === 1 || this.buttonType === 2) {
			// change page view
			this.changePageView(row);
		}

		// reset
		this.buttonType = -1;
	}

	/**
	 * change page view
	 *
	 * @param data
	 */
	public changePageView(data?: any) {
		// payload
		const payload: UserViewInterface = {
			view: AppViewTypeEnum.FORM,
			data: data ? data : null
		};
		this.changeUserView.emit(payload);
	}
}
