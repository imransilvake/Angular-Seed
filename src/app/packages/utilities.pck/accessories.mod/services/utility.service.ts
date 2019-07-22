// angular
import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { of } from 'rxjs';

// app
import { SelectDefaultInterface } from '../../../core.pck/fields.mod/interfaces/select-default-interface';
import { AppOptions, AppServices } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AuthService } from '../../../modules.pck/authorization.mod/services/auth.service';
import { NotificationsFiltersEnums } from '../../../modules.pck/notification.mod/enums/notifications-filters.enums';
import { GuestPeriodsEnum } from '../../../modules.pck/guest.mod/enums/guest-periods.enum';
import { GuestTargetGroupsEnum } from '../../../modules.pck/guest.mod/enums/guest-target-groups.enum';

@Injectable({ providedIn: 'root' })
export class UtilityService {
	public currentUser;
	public countryList;
	public hotelList: Array<string> = [];
	public userRoleList;

	constructor(
		private _proxyService: ProxyService,
		private _i18n: I18n,
		private _authService: AuthService
	) {
		// get current user info
		this.currentUser = this._authService.currentUserState;

		// user roles
		this.userRoleList = UtilityService.getUserRoleList();

		// country list
		this.getCountryList().subscribe(res => this.countryList = res);

		// hotels list
		this.getHotelList().subscribe(res => {
			if (res) {
				res.forEach(hotel => {
					if (hotel) {
						this.hotelList[hotel.id] = hotel.text;
					}
				});
			}
		});
	}

	/**
	 * user roles
	 */
	public static getUserRoleList() {
		const userRoleList: SelectDefaultInterface[] = [
			{
				id: 'ADMIN',
				text: 'Admin'
			},
			{
				id: 'GROUP_MANAGER',
				text: 'Group Manager'
			},
			{
				id: 'HOTEL_MANAGER',
				text: 'Hotel Manager'
			},
			{
				id: 'HOTEL_SUB_MANAGER',
				text: 'Hotel Sub Manager'
			},
			{
				id: 'HOUSEKEEPING',
				text: 'House Keeping'
			}
		];

		return userRoleList;
	}

	/**
	 * auth languages
	 */
	public getAuthLanguageList() {
		const languageList: SelectDefaultInterface[] = [
			{
				id: AppOptions.languages['en'],
				text: this._i18n({
					value: 'English',
					id: 'Language_English'
				})
			},
			{
				id: AppOptions.languages['de'],
				text: this._i18n({
					value: 'German',
					id: 'Language_German'
				})
			}
		];

		return languageList;
	}

	/**
	 * system languages
	 */
	public getSystemLanguageList() {
		const languageList: SelectDefaultInterface[] = [
			{
				id: AppOptions.languages['en'],
				text: this._i18n({
					value: 'English',
					id: 'Language_English'
				})
			},
			{
				id: AppOptions.languages['de'],
				text: this._i18n({
					value: 'German',
					id: 'Language_German'
				})
			},
			{
				id: AppOptions.languages['fr'],
				text: this._i18n({
					value: 'French',
					id: 'Language_French'
				})
			},
			{
				id: AppOptions.languages['es'],
				text: this._i18n({
					value: 'Spanish',
					id: 'Language_Spanish'
				})
			}
		];

		return languageList;
	}

	/**
	 * salutation list
	 */
	public getSalutationList() {
		const salutationList: SelectDefaultInterface[] = [
			{
				id: 'MALE',
				text: this._i18n({
					value: 'Salutation: Mr',
					id: 'Salutation_Mr'
				})
			},
			{
				id: 'FEMALE',
				text: this._i18n({
					value: 'Salutation: Mrs',
					id: 'Salutation_Mrs'
				})
			},
			{
				id: 'INDIVIDUAL',
				text: this._i18n({
					value: 'Salutation: Individual',
					id: 'Salutation_Individual'
				})
			}
		];

		return salutationList;
	}

	/**
	 * country list
	 */
	public getCountryList() {
		const payload = {
			language: this.currentUser && this.currentUser.profile.language || AppOptions.languages['de']
		};
		return this._proxyService.getAPI(AppServices['Utilities']['CountryList'], { queryParams: payload });
	}

	/**
	 * all hotels
	 */
	public getHotelList() {
		return this._proxyService.getAPI(AppServices['Utilities']['Hotels_List']);
	}

	/**
	 * hotels by group
	 *
	 * @param payload
	 */
	public getHotelListByGroup(payload: any) {
		if (payload) {
			return this._proxyService.getAPI(AppServices['Utilities']['Hotels_List_Group'], payload);
		} else {
			return of(null);
		}
	}

	/**
	 * notification filters list
	 */
	public getNotificationFilters() {
		const notificationFiltersList: SelectDefaultInterface[] = [
			{
				id: NotificationsFiltersEnums.ALL,
				text: this._i18n({
					value: 'All notifications',
					id: 'Notifications_Filters_All'
				})
			},
			{
				id: NotificationsFiltersEnums.OPEN,
				text: this._i18n({
					value: 'Only open notifications',
					id: 'Notifications_Filters_Open'
				})
			},
			{
				id: NotificationsFiltersEnums.ADMIN,
				text: this._i18n({
					value: 'Only admin notifications',
					id: 'Notifications_Filters_Admin'
				})
			},
			{
				id: NotificationsFiltersEnums.REGISTRATIONS,
				text: this._i18n({
					value: 'Only registrations',
					id: 'Notifications_Filters_Registrations'
				})
			},
			{
				id: NotificationsFiltersEnums.ROOM,
				text: this._i18n({
					value: 'Only room notifications',
					id: 'Notifications_Filters_Room'
				})
			},
			{
				id: NotificationsFiltersEnums.REPAIR,
				text: this._i18n({
					value: 'Only repair notifications',
					id: 'Notifications_Filters_Repair'
				})
			},
			{
				id: NotificationsFiltersEnums.ALERT,
				text: this._i18n({
					value: 'Only alert notifications',
					id: 'Notifications_Filters_Alert'
				})
			}
		];

		return notificationFiltersList;
	}

	/**
	 * guest periods list
	 */
	public getGuestPeriods() {
		const notificationPeriodsList: SelectDefaultInterface[] = [
			{
				id: GuestPeriodsEnum.ADHOC,
				text: this._i18n({
					value: 'Adhoc',
					id: 'Guest_Periods_Adhoc'
				})
			},
			{
				id: GuestPeriodsEnum.FIRST_LOGIN,
				text: this._i18n({
					value: 'First Login',
					id: 'Guest_Periods_First_Login'
				})
			},
			{
				id: GuestPeriodsEnum.MIDDLE_STAY,
				text: this._i18n({
					value: 'Middle Stay',
					id: 'Guest_Periods_Middle_Stay'
				})
			},
			{
				id: GuestPeriodsEnum.DAY_BEFORE_CHECKOUT,
				text: this._i18n({
					value: 'Day Before Checkout',
					id: 'Guest_Periods_Day_Before_Checkout'
				})
			},
			{
				id: GuestPeriodsEnum.DAY_AFTER_CHECKIN,
				text: this._i18n({
					value: 'Day Before Checkout',
					id: 'Guest_Periods_Day_After_Checkout'
				})
			}
		];

		return notificationPeriodsList;
	}

	/**
	 * guest periods list
	 */
	public getTargetGroups() {
		const targetGroupsList: SelectDefaultInterface[] = [
			{
				id: GuestTargetGroupsEnum.ALL,
				text: this._i18n({
					value: 'All guests',
					id: 'Guest_Target_Groups_All'
				})
			},
			{
				id: GuestTargetGroupsEnum.CLASSIC,
				text: this._i18n({
					value: 'Member only',
					id: 'Guest_Target_Groups_Members_Only'
				})
			},
			{
				id: GuestTargetGroupsEnum.PREMIUM,
				text: this._i18n({
					value: 'Standard guests only',
					id: 'Guest_Target_Groups_Standard_Guest_Only'
				})
			}
		];

		return targetGroupsList;
	}

	/**
	 * upload image to dynamoDB
	 *
	 * @param imageSrc
	 * @param extra
	 */
	public uploadImage(imageSrc: string, extra?: any) {
		// payload
		let payload: any = {
			accessToken: this.currentUser.credentials.accessToken,
			image: imageSrc
		};

		// extra payload
		if (extra) {
			payload = {
				...payload,
				...extra
			};
		}

		// service
		return this._proxyService.postAPI(AppServices['Utilities']['Profile_Image_Change'], { bodyParams: payload });
	}
}
