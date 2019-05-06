// angular
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { LoadingAnimationService } from '../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { DialogService } from '../../../../utilities.pck/dialog.mod/services/dialog.service';
import { AuthResetInterface } from '../../interfaces/auth-reset.interface';
import { DialogTypeEnum } from '../../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { AuthService } from '../../services/auth.service';
import { HelperService } from '../../../../utilities.pck/accessories.mod/services/helper.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['../auth.component.scss']
})

export class ResetPasswordComponent implements OnDestroy {
	public routing = ROUTING;
	public formFields;
	public queryParams;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _route: ActivatedRoute,
		private _loadingAnimationService: LoadingAnimationService,
		private _dialogService: DialogService,
		private _authService: AuthService,
		private _router: Router,
		private _i18n: I18n
	) {
		this._route.queryParams
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe((params) => {
				this.queryParams = params;
			});

		// form fields
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
		this._authService.authResetPassword(formPayload)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// clear the form
				this.formFields.reset();

				// dialog payload
				const data = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						title: this._i18n({ value: 'Title: Reset Password', id: 'Auth_Reset_Password_Form_Success_Title' }),
						message: this._i18n({
							value: 'Description: Reset Password',
							id: 'Auth_Reset_Password_Form_Success_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
					}
				};

				// dialog service
				this._dialogService.showDialog(data)
					.pipe(takeUntil(this._ngUnSubscribe))
					.subscribe(() => {
						// navigate to login route
						this._router.navigate([ROUTING.authorization.login]).then();
					});
			});
	}
}
