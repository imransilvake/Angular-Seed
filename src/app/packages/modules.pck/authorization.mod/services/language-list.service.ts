// angular
import { Injectable } from '@angular/core';

// app
import { SelectDefaultInterface } from '../../../core.pck/fields.mod/interfaces/select-default-interface';
import { AppOptions } from '../../../../../app.config';

@Injectable()
export class LanguageListService {
	/**
	 * set of app languages
	 */
	public getLanguageList() {
		const languageList: SelectDefaultInterface[] = [
			{ id: AppOptions.languages['en'], text: 'English' },
			{ id: AppOptions.languages['de'], text: 'Deutsch' }
		];

		return languageList;
	}
}
