// angular
import { FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

// patterns
export const patterns: any = {
	password: /^.{8,256}$/,
	email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

@Injectable({ providedIn: 'root' })
export class ValidationService {
	/**
	 * password validator
	 *
	 * @param control
	 */
	static passwordValidator(control: FormControl) {
		const value = control.value;

		if (value && value.match(patterns.password)) {
			return null;
		}

		return { password: true };
	}

	/**
	 * confirm password validator
	 *
	 * @param control
	 */
	static confirmPasswordValidator(control: FormControl) {
		const password = control.parent && control.parent.controls['password'].value;
		const confirmPassword = control.parent && control.parent.controls['confirmPassword'].value;

		if (confirmPassword && password === confirmPassword) {
			return null;
		}

		return { confirmPassword: true };
	}

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
