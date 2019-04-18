// angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';

@Component({
	selector: 'app-confirm-password',
	templateUrl: './confirm-password.component.html',
	styleUrls: ['../auth.component.scss']
})

export class ConfirmPasswordComponent {
	public routing = ROUTING;
	public formFields;
	public version = '1.0.0';

	constructor() {
		// form fields
		this.formFields = new FormGroup({
			verificationCode: new FormControl('', [
				Validators.required,
				Validators.minLength(2)
			]),
			password: new FormControl('', [
				Validators.required,
				ValidationService.passwordValidator
			]),
			confirmPassword: new FormControl('', [
				Validators.required,
				ValidationService.passwordValidator,
				ValidationService.confirmPasswordValidator
			])
		});

		// listen to password change
		this.password.valueChanges.subscribe(() => this.confirmPassword.updateValueAndValidity());
	}

	/**
	 * setters
	 */
	get verificationCode() {
		return this.formFields.get('verificationCode');
	}

	get password() {
		return this.formFields.get('password');
	}

	get confirmPassword() {
		return this.formFields.get('confirmPassword');
	}

	get isFormValid() {
		return this.formFields.valid;
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		console.log(this.formFields.value);
	}
}
