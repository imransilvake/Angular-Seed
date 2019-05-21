// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { LoadingAnimationService } from '../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { AuthForgotInterface } from '../../interfaces/auth-forgot.interface';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['../auth-common.component.scss']
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {
	public routing = ROUTING;
	public formFields;
	public errorMessage;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _authService: AuthService
	) {
		// form group
		this.formFields = new FormGroup({
			firstName: new FormControl('', [
				Validators.required,
				Validators.minLength(2),
				ValidationService.textValidator,
				Validators.maxLength(125)
			]),
			lastName: new FormControl('', [
				Validators.required,
				Validators.minLength(2),
				ValidationService.textValidator,
				Validators.maxLength(125)
			]),
			email: new FormControl('', [
				Validators.required,
				ValidationService.emailValidator
			])
		});
	}

	ngOnInit() {
		// listen to error message
		this._authService.errorMessage
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => this.errorMessage = res);
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * getters
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

	get isFormValid() {
		return this.formFields.valid;
	}

	/**
	 * on submit form
	 */
	public onSubmitForm() {
		// start loading animation
		this._loadingAnimationService.startLoadingAnimation();

		// payload
		const formPayload: AuthForgotInterface = {
			email: this.email.value
		};

		// start forgot password process
		this._authService.authForgotPassword(formPayload, this.formFields);
	}
}
