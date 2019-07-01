// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { UserService } from '../../../services/user.service';
import { MemberService } from '../../../../member.mod/services/member.service';
import { UserListTypeEnum } from '../../../enums/user-list-type.enum';
import { ProxyService } from '../../../../../core.pck/proxy.mod/services/proxy.service';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';
import { DialogTypeEnum } from '../../../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../../../utilities.pck/dialog.mod/services/dialog.service';
import { LoadingAnimationService } from '../../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { UserViewInterface } from '../../../interfaces/user-view.interface';
import { AppViewTypeEnum } from '../../../enums/app-view-type.enum';
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';

@Component({
	selector: 'app-user-default',
	templateUrl: './user-default.component.html',
	styleUrls: ['./user-default.component.scss']
})

export class UserDefaultComponent implements OnInit, OnDestroy {
	@Output() changeUserView: EventEmitter<any> = new EventEmitter();

	public userNewRegistrationsList;
	public userExistingUsersList;
	public newUsersTable;
	public existingUsersTable;
	public buttonType;
	public currentRole: UserRoleEnum;
	public roleAdmin: UserRoleEnum = UserRoleEnum[UserRoleEnum.ADMIN];
	public roleGroupManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.GROUP_MANAGER];
	public roleHotelManager: UserRoleEnum = UserRoleEnum[UserRoleEnum.HOTEL_MANAGER];

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _userService: UserService,
		private _memberService: MemberService,
		private _proxyService: ProxyService,
		private _utilityService: UtilityService,
		private _i18n: I18n,
		private _dialogService: DialogService,
		private _loadingAnimationService: LoadingAnimationService
	) {
	}

	ngOnInit() {
		// set current user role
		this.currentRole = this._userService.appState.role;

		// listen: fetch new users & old user accounts list
		this._userService.userDataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// set tables resources
				this.newUsersTable = {
					api: this._userService.userTablesServices.newUsers,
					payload: this._userService.userTablesServices.payload1,
					searchApi: this._userService.userTablesServices.searchApi,
					uniqueID: this._userService.userTablesServices.uniqueID,
					sortDefaultColumn: this._userService.userTablesServices.sortDefaultColumn
				};
				this.existingUsersTable = {
					api: this._userService.userTablesServices.existingUsers,
					payload: this._userService.userTablesServices.payload2,
					searchApi: this._userService.userTablesServices.searchApi,
					uniqueID: this._userService.userTablesServices.uniqueID,
					sortDefaultColumn: this._userService.userTablesServices.sortDefaultColumn
				};

				// set tables data
				if (res && (res.newUsers || res.existingUsers)) {
					// map new users list
					if (res.newUsers) {
						this.mapUsers(res.newUsers, UserListTypeEnum.APPLIED);
					}

					// map existing users list
					if (res.existingUsers) {
						this.mapUsers(res.existingUsers, UserListTypeEnum.CONFIRMED);
					}
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * map new/existing users list
	 *
	 * @param users
	 * @param userListType
	 */
	public mapUsers(users: any, userListType: string) {
		if (users.data.length === 0) {
			if (userListType === UserListTypeEnum.APPLIED) {
				this.userNewRegistrationsList = [];
			} else {
				this.userExistingUsersList = [];
			}
		} else {
			const mapNewUsersData = users && users.data.map(user => {
				const image = user.Image === null && user.Name ? HelperService.getFirstLetter(user.Name).toUpperCase() : user.Image;
				const role = user.Type ? HelperService.capitalizeString(user.Type.replace(/_/g, ' ').toLowerCase()) : '-';
				const hotels = [];
				let date;
				let uniqueProperties = {};

				if (userListType === UserListTypeEnum.APPLIED) {
					// date
					date = user.CreateDate ? HelperService.getDateTime(this._userService.currentUser.profile.language, user.CreateDate) : '-';

					// object properties
					uniqueProperties = {
						'Reg. Date': date
					};
				} else {
					// date
					date = user.LoginDate ? HelperService.getDateTime(this._userService.currentUser.profile.language, user.LoginDate) : '-';

					// hotels
					if (user && user.HotelIDs && typeof user.HotelIDs !== 'string') {
						user.HotelIDs.forEach(hotel => {
							if (hotel.split('_')[1]) {
								hotels.push(this._utilityService.hotelList[hotel]);
							}
						});
					}

					// object properties
					uniqueProperties = {
						Id: user.ID,
						'Last Login': date,
						Role: role,
						Hotels: hotels && hotels.length ? hotels.join(', ') : 'ALL',
						Creator: user.Creator ? user.Creator : '-'
					};
				}

				// prepare table row
				return {
					...user,
					...uniqueProperties,
					Image: image === null ? 'UN' : image
				};
			});

			// set users list based on user list type
			if (userListType === UserListTypeEnum.APPLIED) {
				this.userNewRegistrationsList = { ...users, data: mapNewUsersData };
			} else {
				this.userExistingUsersList = { ...users, data: mapNewUsersData };
			}
		}
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
	 * new / old action
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

			// perform action
			this.deleteOrDeclineUser(row, this.buttonType, text);
		} else {
			// change page view
			this.changePageView(row);
		}
	}

	/**
	 * delete or decline user
	 *
	 * @param row
	 * @param state
	 * @param text
	 */
	public deleteOrDeclineUser(row: any, state: number, text: any) {
		// dialog payload
		const data = {
			type: DialogTypeEnum.CONFIRMATION,
			payload: {
				...text,
				icon: 'dialog_confirmation',
				buttonTexts: [
					this._i18n({
						value: 'Button - OK',
						id: 'Common_Button_OK'
					}),
					this._i18n({
						value: 'Button - Cancel',
						id: 'Common_Button_Cancel'
					}),
				]
			}
		};

		// listen: dialog service
		this._dialogService
			.showDialog(data)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// delete / decline
				if (res) {
					// service
					this._userService.userRemove(this.buttonType, row);

					// remove row from client side
					if (this.buttonType === 3) {
						const listData = this.userNewRegistrationsList.data.filter(listRow => listRow.ID !== row.ID);
						this.userNewRegistrationsList = {
							...this.userNewRegistrationsList,
							data: listData,
							total: this.userNewRegistrationsList.total - 1
						};
					} else {
						const listData = this.userExistingUsersList.data.filter(listRow => listRow.ID !== row.ID);
						this.userExistingUsersList = {
							...this.userExistingUsersList,
							data: listData,
							total: this.userExistingUsersList.total - 1
						};
					}
				}

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
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
