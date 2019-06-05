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

	constructor(
		private _proxyService: ProxyService,
		private _i18n: I18n,
		private _authService: AuthService
	) {
		// get current user info
		this.currentUser = this._authService.currentUserState;

		// country list
		this.getCountryList().subscribe(res => this.countryList = res);
	}

	/**
	 * set of app auth languages
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
	 * set of app system languages
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
	 * get all hotels
	 */
	public getHotelList() {
		return this._proxyService.getAPI(AppServices['Utilities']['HotelList']);
	}

	/**
	 * get country list
	 */
	public getCountryList() {
		const payload = {
			language: this.currentUser && this.currentUser.profile.language || AppOptions.languages['de']
		};
		return this._proxyService.getAPI(AppServices['Utilities']['CountryList'], { queryParams: payload });
	}
}
