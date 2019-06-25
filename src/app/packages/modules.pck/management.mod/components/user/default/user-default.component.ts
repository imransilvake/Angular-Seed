// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import * as moment from 'moment';
import { UserService } from '../../../services/user.service';
import { AppViewTypeEnum } from '../../../enums/app-view-type.enum';
import { UserViewInterface } from '../../../interfaces/user-view.interface';
import { MemberService } from '../../../../member.mod/services/member.service';
import { UserListTypeEnum } from '../../../enums/user-list-type.enum';
import { ProxyService } from '../../../../../core.pck/proxy.mod/services/proxy.service';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';

@Component({
	selector: 'app-user-default',
	templateUrl: './user-default.component.html',
	styleUrls: ['./user-default.component.scss']
})

export class UserDefaultComponent implements OnInit, OnDestroy {
	@Output() changeUserView: EventEmitter<any> = new EventEmitter();

	public userNewRegistrationsList;
	public userExistingUsersList;
	public newUsersTableApiUrl;
	public existingUsersTableApiUrl;
	public buttonType;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _userService: UserService,
		private _memberService: MemberService,
		private _proxyService: ProxyService,
		private _utilityService: UtilityService
	) {
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
				const role = user.Type ? HelperService.capitalizeString(user.Type.replace('_', ' ').toLowerCase()) : '-';
				let date;
				let uniqueProperties = {};
				let hotels = [];

				if (userListType === UserListTypeEnum.APPLIED) {
					// date
					date = user.CreateDate ? moment.utc(user.CreateDate).format('DD. MMMM YYYY, hh:mm:ss') : '-';

					// object properties
					uniqueProperties = {
						'Reg. Date': date
					};
				} else {
					// date
					date = user.LoginDate ? moment.utc(user.LoginDate).format('DD. MMMM YYYY, hh:mm:ss') : '-';

					// hotels
					user.HotelIDs && user.HotelIDs.forEach(hotel => {
						hotels.push(this._utilityService.hotelList[hotel]);
					});

					// object properties
					uniqueProperties = {
						Id: user.ID,
						'Last Login': date,
						Role: role,
						Hotels: hotels.length !== 0 ? hotels.join(', ') : '-'
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
		// this.changeUserView.emit(payload);
		console.log(id);
	}

	/**
	 * edit new user
	 */
	public onClickEditNewUser() {
		this.buttonType = 1;
	}

	/**
	 * delete new user
	 */
	public onClickDeleteNewUser() {
		this.buttonType = 2;
	}

	/**
	 * edit existing user
	 */
	public onClickEditExistingUser() {
		this.buttonType = 3;
	}

	/**
	 * delete existing user
	 */
	public onClickDeleteExistingUser() {
		this.buttonType = 4;
	}
}
