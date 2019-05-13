// angular
import { Component, OnDestroy } from '@angular/core';
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

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['../auth-common.component.scss']
})

export class ResetPasswordComponent implements OnDestroy {
	public routing = ROUTING;
	public formFields;
	public queryParams;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _route: ActivatedRoute,
		private _loadingAnimationService: LoadingAnimationService,
		private _authService: AuthService
	) {
		this._route.queryParams
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe((params) => this.queryParams = params);

		// form group
		this.formFields = new FormGroup({
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

		// listen to password change: update confirm password
		this.password.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => this.confirmPassword.updateValueAndValidity());
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * getters
	 */
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
