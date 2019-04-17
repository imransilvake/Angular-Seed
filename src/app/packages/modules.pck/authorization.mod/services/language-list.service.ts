// angular
import { Injectable } from '@angular/core';

// app
import { APP_URL } from '../../../../../environments/environment';
import { SelectDefaultInterface } from '../../../core.pck/fields.mod/interfaces/select-default-interface';

@Injectable()
export class LanguageListService {
	/**
	 * fetch language list
	 */
	public getLanguageList() {
		const languageList: SelectDefaultInterface[] = [
			{ value: `${ APP_URL }/en`, viewValue: 'English' },
			{ value: `${ APP_URL }/de`, viewValue: 'Deutsch' }
		];

		return languageList;
	}
}
