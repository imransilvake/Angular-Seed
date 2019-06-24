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
					const mapNewUsersData = res.newUsers && res.newUsers.data.map(user => {
						// hotel ids
						const hotelNames = this._memberService
							.memberFetchAssignedHotels(this._userService.appState.groupId, user.HotelIDs)
							.pipe(
								map(hotelRes => {
									return hotelRes.items && hotelRes.items.map(hotel => {
										return hotel.Name;
									});
								})
							);

						// prepare table row
						return {
							...user,
							Image: user.Image === null ? HelperService.getFirstLetter(user.Name) : user.Image,
							Role: '-',
							Hotels: ['Dummy1', 'Dummy2'].join(', '),
							'Reg. Date': user.CreateDate && moment
								.utc(user.CreateDate)
								.format('DD. MMMM YYYY, hh:mm:ss')
						};
					});
					this.userNewRegistrationsList = { ...res.newUsers, data: mapNewUsersData };

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
