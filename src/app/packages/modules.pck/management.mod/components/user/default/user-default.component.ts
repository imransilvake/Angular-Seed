// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';

// app
import * as moment from 'moment';
import { UserService } from '../../../services/user.service';
import { AppViewTypeEnum } from '../../../enums/app-view-type.enum';
import { UserViewInterface } from '../../../interfaces/user-view.interface';
import { MemberService } from '../../../../member.mod/services/member.service';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';
import { UserListTypeEnum } from '../../../enums/user-list-type.enum';
import { ProxyService } from '../../../../../core.pck/proxy.mod/services/proxy.service';
import { AppServices } from '../../../../../../../app.config';

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
		private _memberService: MemberService,
		private _proxyService: ProxyService
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
						//this.mapUsers(res.existingUsers, UserListTypeEnum.CONFIRMED);
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
		let observables = [];
		users && users.data.map(user => {
			let forkList = [
				this._memberService.memberFetchAssignedHotels(
					Array.isArray(user.HotelIDs) ? user.HotelIDs : [user.HotelIDs]
				)
			];

			// image
			if (user.Image !== null) {
				//forkList.push(this._proxyService.postAPI(AppServices['Utilities']['Fetch_Profile_Image'], { bodyParams: { image: user.Image } }))
			}

			observables.push(forkList);
		});

		forkJoin(observables)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe((observablesList: any) => {
				let allTableRows = [];
				let uniqueProperties = {};
				observablesList.forEach((res, i) => {
					let date;
					res.subscribe(a => {
						const role = users.data[i].Type ? HelperService.capitalizeString(users.data[i].Type.replace('_', ' ').toLowerCase()) : '-';
						let hotelsList = [];
						if (a.items) {
							hotelsList = a.items.map(hotel => {
								return hotel.Name;
							});
						} else {
							hotelsList = a.map(hotel => {
								return hotel.text;
							});
						}

						const result = {
							//image: users.data[i].Image !== null ? res.imageUrl.image : HelperService.getFirstLetter(users.data[i].Name).toUpperCase(),
							hotels: hotelsList
						};

						// handle date & uniquer tables properties
						if (userListType === UserListTypeEnum.APPLIED) {
							date = users.data[i].CreateDate ? moment.utc(users.data[i].CreateDate).format('DD. MMMM YYYY, hh:mm:ss') : '-';
							uniqueProperties = {
								'Reg. Date': date
							};
						} else {
							date = users.data[i].LoginDate ? moment.utc(users.data[i].LoginDate).format('DD. MMMM YYYY, hh:mm:ss') : '-';
							uniqueProperties = {
								'Last Login': date,
								Role: role,
								Hotels: result.hotels.join(', ')
							};
						}

						// row
						const row = {
							...users.data[i],
							...uniqueProperties,
							Image: 'svg'
						};

						// add row to the list
						allTableRows.push(row);

						// set users list based on user list type
						if (userListType === UserListTypeEnum.APPLIED) {
							this.userNewRegistrationsList = { ...users, data: allTableRows };
						} else {
							this.userExistingUsersList = { ...users, data: allTableRows };
						}
					});
				});
			});
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
