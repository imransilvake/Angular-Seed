// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { LoadingAnimationService } from '../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { AuthLoginInterface } from '../../interfaces/auth-login.interface';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['../auth-common.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
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
			email: new FormControl('', [
				Validators.required,
				ValidationService.emailValidator
			]),
			password: new FormControl('', [
				Validators.required,
				ValidationService.passwordValidator
			]),
			rememberMe: new FormControl(false)
		});
	}

	ngOnInit() {
		// listen: error message
		this._authService.errorMessage
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => this.errorMessage = res);

		// listen: username
		this.email.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => {
				const error = this.password.errors;
				if (!this.password.invalid || error['backendError']) {
					this.password.setErrors(null);
				}
			});

		// listen: password
		this.password.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => {
				const error = this.email.errors;
				if (!this.email.invalid || error['backendError']) {
					this.email.setErrors(null);
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * getters
	 */
	get email() {
		return this.formFields.get('email');
	}

	get password() {
		return this.formFields.get('password');
	}

	get rememberMe() {
		return this.formFields.get('rememberMe');
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
		const formPayload: AuthLoginInterface = {
			username: this.email.value,
			password: this.password.value
		};

		// start login process
		this._authService.authLogin(
			formPayload,
			this.formFields
		);
	}
}
