// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { LoadingAnimationService } from '../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { AuthResetInterface } from '../../interfaces/auth-reset.interface';
import { AuthService } from '../../services/auth.service';
import { HelperService } from '../../../../utilities.pck/accessories.mod/services/helper.service';
import { AuthLoginInterface } from '../../interfaces/auth-login.interface';
import { AppOptions } from '../../../../../../app.config';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['../auth-common.component.scss']
})

export class ResetPasswordComponent implements OnInit, OnDestroy {
	public routing = ROUTING;
	public formFields;
	public queryParams;
	public errorMessage;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _route: ActivatedRoute,
		private _loadingAnimationService: LoadingAnimationService,
		private _authService: AuthService
	) {
		// listen: query params event
		this._route.queryParams
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe((params) => this.queryParams = params);

		// form group
		this.formFields = new FormGroup({
			languageName: new FormControl(AppOptions.languages['de']),
			password: new FormControl('', [
				Validators.required,
				ValidationService.passwordValidator,
				ValidationService.passwordStrengthValidator
			]),
			confirmPassword: new FormControl('', [
				Validators.required,
				ValidationService.passwordValidator,
				ValidationService.passwordStrengthValidator,
				ValidationService.confirmPasswordValidator
			])
		});

		// listen: to password change (update confirm password field)
		this.password.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => this.confirmPassword.updateValueAndValidity());
	}

	ngOnInit() {
		// listen: error message
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
	get languageName() {
		return this.formFields.get('languageName');
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
		// start loading animation
		this._loadingAnimationService.startLoadingAnimation();

		// reset or login
		if (this.queryParams && this.queryParams.autoLogin) {
			// payload
			const formPayload: AuthLoginInterface = {
				username: this.queryParams && this.queryParams.user,
				password: this.queryParams && this.queryParams.verification,
				newPassword: HelperService.hashPassword(this.password.value)
			};

			// start login process
			this._authService.authLogin(
				formPayload,
				this.formFields
			);
		} else {
			// payload
			const formPayload: AuthResetInterface = {
				email: this.queryParams && this.queryParams.user,
				verificationCode: this.queryParams && this.queryParams.verification,
				password: HelperService.hashPassword(this.password.value)
			};

			// start reset password process
			this._authService.authResetPassword(formPayload, this.formFields);
		}
	}
}
