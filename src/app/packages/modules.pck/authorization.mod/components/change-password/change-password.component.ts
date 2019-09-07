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
import { AuthLoginInterface } from '../../interfaces/auth-login.interface';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['../auth-common.component.scss']
})

export class ChangePasswordComponent implements OnInit, OnDestroy {
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
			name: new FormControl('', [Validators.required]),
			email: new FormControl('', [
				Validators.required,
				ValidationService.emailValidator
			]),
			password: new FormControl('', [
				Validators.required
			]),
			newPassword: new FormControl('', [
				Validators.required,
				ValidationService.passwordValidator,
				ValidationService.passwordStrengthValidator
			])
		});

		// set email
		if (this.queryParams && this.queryParams.email) {
			this.email.setValue(this.queryParams.email);
		}
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

				// update new password field
				this.newPassword.updateValueAndValidity();
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
	get name() {
		return this.formFields.get('name');
	}

	get email() {
		return this.formFields.get('email');
	}

	get password() {
		return this.formFields.get('password');
	}

	get newPassword() {
		return this.formFields.get('newPassword');
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
			name: this.name.value,
			username: this.email.value,
			password: this.password.value,
			newPassword: this.newPassword.value
		};

		// start change password process
		this._authService.authLogin(formPayload, this.formFields);
	}
}
