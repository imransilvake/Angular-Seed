// angular
import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { SelectDefaultInterface } from '../../../core.pck/fields.mod/interfaces/select-default-interface';

@Injectable()
export class SalutationListService {
	constructor(private _i18n: I18n) {
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
					id: 'Error_Salutation_Mr'
				})
			},
			{
				id: 'female',
				text: this._i18n({
					value: 'Salutation: Mrs',
					id: 'Error_Salutation_Mrs'
				})
			},
			{
				id: 'individual',
				text: this._i18n({
					value: 'Salutation: Individual',
					id: 'Error_Salutation_Individual'
				})
			}
		];

		return salutationList;
	}
}
