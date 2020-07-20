// angular
import { FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

// patterns
export const patterns: any = {
	email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

@Injectable({ providedIn: 'root' })
export class ValidationService {
	/**
	 * email validator
	 *
	 * @param control
	 */
	static emailValidator(control: FormControl) {
		const value = control.value;

		if (value && value.match(patterns.email)) {
			return null;
		}

		return { email: true };
	}
}
