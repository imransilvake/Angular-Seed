// angular
import { Injectable } from '@angular/core';

// app
import { SelectDefaultInterface } from '../../../core.pck/fields.mod/interfaces/select-default-interface';

@Injectable()
export class LanguageListService {
	/**
	 * set of app languages
	 */
	public getLanguageList() {
		const languageList: SelectDefaultInterface[] = [
			{ id: 'en', text: 'English' },
			{ id: 'de', text: 'Deutsch' }
		];

		return languageList;
	}
}
