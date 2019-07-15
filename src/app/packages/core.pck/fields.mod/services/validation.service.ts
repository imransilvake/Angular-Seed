// angular
import { FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

// app
import * as zxcvbn from 'zxcvbn';

// patterns
export const patterns: any = {
	text: /^[A-Za-z]+$/,
	password: /^.{8,256}$/,
	email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	url: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
	time: /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/
};

@Injectable({ providedIn: 'root' })
export class ValidationService {
	/**
	 * text validator
	 *
	 * @param control
	 */
	static textValidator(control: FormControl) {
		const value = control.value;

		if (value && value.match(patterns.text)) {
			return null;
		}

		return { text: true };
	}

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

	/**
	 * password strength validator
	 *
	 * @param control
	 */
	static passwordStrengthValidator(control: FormControl) {
		const value = control.value;

		if (value) {
			const result = zxcvbn(value);
			const score = result.score;

			if (score > 0) {
				return null;
			}
		}

		return { passwordStrength: true };
	}

	/**
	 * autocomplete option validator
	 *
	 * @param control
	 */
	static autocompleteOptionValidator(control: FormControl) {
		const value = control.value;

		if (value && typeof value === 'object') {
			return null;
		}

		return { invalidOption: true };
	}

	/**
	 * url validator
	 *
	 * @param control
	 */
	static urlValidator(control: FormControl) {
		const value = control.value;

		if (!value || value && value.match(patterns.url)) {
			return null;
		}

		return { invalidUrl: true };
	}

	/**
	 * time validator
	 *
	 * @param control
	 */
	static timeValidator(control: FormControl) {
		const value = control.value;

		if (!value || value && value.match(patterns.time)) {
			return null;
		}

		return { invalidTime: true };
	}
}
