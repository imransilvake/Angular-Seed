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
import { AuthService } from '../../services/auth.service';
import { AuthChangePasswordInterface } from '../../interfaces/auth-change-password.interface';

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
			email: new FormControl('', [
				Validators.required,
				ValidationService.emailValidator
			]),
			oldPassword: new FormControl('', [
				Validators.required
			]),
			newPassword: new FormControl('', [
				Validators.required,
				ValidationService.passwordValidator,
				ValidationService.passwordStrengthValidator
			])
		});

		// listen: to password change (update new password field)
		this.oldPassword.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => this.newPassword.updateValueAndValidity());

		// set email
		this.email.setValue(this.queryParams.email);
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
	get email() {
		return this.formFields.get('email');
	}

	get oldPassword() {
		return this.formFields.get('oldPassword');
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
		const formPayload: AuthChangePasswordInterface = {
			email: this.email.value,
			oldPassword: this.oldPassword.value,
			newPassword: this.newPassword.value
		};

		// start change password process
		this._authService.authChangePassword(formPayload, this.formFields);
	}
}
