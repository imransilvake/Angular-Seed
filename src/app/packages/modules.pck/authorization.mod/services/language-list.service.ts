// angular
import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { SelectDefaultInterface } from '../../../core.pck/fields.mod/interfaces/select-default-interface';
import { AppOptions } from '../../../../../app.config';

@Injectable()
export class LanguageListService {
	constructor(private _i18n: I18n) {
	}

	/**
	 * set of app languages
	 */
	public getLanguageList() {
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
}
