// angular
import { FormControl } from '@angular/forms';

// patterns
export const patterns: any = {
	username: /^[a-zA-Z0-9@\-_.]{5,256}$/,
	password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,256}$/,
	email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

export class ValidationService {
	/**
	 * username validator
	 *
	 * @param control
	 */
	static usernameValidator(control: FormControl) {
		const value = control.value;

		if (value && value.match(patterns.username)) {
			return null;
		}

		return { username: true, usernameMinLength: value.length <= 256, usernameRequiredLength: value.length <= 256 ? 5 : 256 };
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
}
