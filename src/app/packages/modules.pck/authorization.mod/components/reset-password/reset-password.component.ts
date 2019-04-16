// angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['../auth.component.scss']
})

export class ResetPasswordComponent {
	public routing = ROUTING;
	public formFields;

	constructor() {
		// form fields
		this.formFields = new FormGroup({
			firstName: new FormControl('', [
				Validators.required,
				Validators.minLength(2)
			]),
			lastName: new FormControl('', [
				Validators.required,
				Validators.minLength(2)
			]),
			email: new FormControl('', [
				Validators.required,
				ValidationService.emailValidator
			])
		});
	}

	/**
	 * setters
	 */
	get firstName() {
		return this.formFields.get('firstName');
	}

	get lastName() {
		return this.formFields.get('lastName');
	}

	get email() {
		return this.formFields.get('email');
	}

	get validForm() {
		return this.formFields.valid;
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		// console.info(this.formFields);
	}
}
