// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import * as moment from 'moment';
import { UserService } from '../../../services/user.service';
import { AppViewTypeEnum } from '../../../enums/app-view-type.enum';
import { UserViewInterface } from '../../../interfaces/user-view.interface';
import { MemberService } from '../../../../member.mod/services/member.service';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';
import { UserListTypeEnum } from '../../../enums/user-list-type.enum';

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

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _userService: UserService,
		private _memberService: MemberService
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
		const mapNewUsersData = users && users.data.map(user => {
			// set values
			const image = user.Image === null ? HelperService.getFirstLetter(user.Name).toUpperCase() : user.Image;
			const role = user.Type ? HelperService.capitalizeString(user.Type.replace('_', ' ').toLowerCase()) : '-';
			const hotelNames = this._memberService
				.memberFetchAssignedHotels(this._userService.appState.groupId, user.HotelIDs)
				.pipe(
					map(hotelRes => {
						return hotelRes.items && hotelRes.items.map(hotel => {
							return hotel.Name;
						});
					})
				);
			let date;
			let uniqueProperties = {};
			if (userListType === UserListTypeEnum.APPLIED) {
				date = user.CreateDate ? moment.utc(user.CreateDate).format('DD. MMMM YYYY, hh:mm:ss') : '-';
				uniqueProperties = {
					'Reg. Date': date
				};
			} else {
				date = user.LoginDate ? moment.utc(user.LoginDate).format('DD. MMMM YYYY, hh:mm:ss') : '-';
				uniqueProperties = {
					'Last Login': date
				};
			}

			// prepare table row
			return {
				...user,
				...uniqueProperties,
				Image: image,
				Role: role,
				Hotels: ['Dummy1', 'Dummy2'].join(', ')
			};
		});

		// set users list based on user list type
		if (userListType === UserListTypeEnum.APPLIED) {
			this.userNewRegistrationsList = { ...users, data: mapNewUsersData };
		} else {
			this.userExistingUsersList = { ...users, data: mapNewUsersData };
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
		this.changeUserView.emit(payload);
	}
}
