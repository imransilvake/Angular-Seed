// angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { InputStyleEnum } from '../../../../core.pck/fields.mod/enums/input-style.enum';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { SessionService } from '../../../../core.pck/session.mod/services/session.service';

@Component({
	selector: 'app-lock-screen',
	templateUrl: './lock-screen.component.html',
	styleUrls: ['./lock-screen.component.scss']
})

export class LockScreenComponent {
	public routing = ROUTING;
	public formFields;
	public lockPasswordIcons = [faLock, faLockOpen];
	public lockPasswordStyleType = InputStyleEnum.INFO;

	constructor(private _sessionService: SessionService) {
		// form fields
		this.formFields = new FormGroup({
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(8),
				ValidationService.passwordValidator
			])
		});
	}

	/**
	 * getters
	 */
	get password() {
		return this.formFields.get('password');
	}

	get isFormValid() {
		return this.formFields.valid;
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		// console.info(this.formFields);
	}
}
