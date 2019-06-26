// angular
import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { SelectDefaultInterface } from '../../../core.pck/fields.mod/interfaces/select-default-interface';
import { AppOptions, AppServices } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AuthService } from '../../../modules.pck/authorization.mod/services/auth.service';

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
				id: 'male',
				text: this._i18n({
					value: 'Salutation: Mr',
					id: 'Salutation_Mr'
				})
			},
			{
				id: 'female',
				text: this._i18n({
					value: 'Salutation: Mrs',
					id: 'Salutation_Mrs'
				})
			},
			{
				id: 'individual',
				text: this._i18n({
					value: 'Salutation: Individual',
					id: 'Salutation_Individual'
				})
			}
		];

		return salutationList;
	}

	/**
	 * all hotels
	 */
	public getHotelList() {
		return this._proxyService.getAPI(AppServices['Utilities']['HotelList']);
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
}
