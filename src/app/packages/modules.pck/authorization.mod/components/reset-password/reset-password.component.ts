// angular
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// store
import { Store } from '@ngrx/store';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { LoadingAnimationService } from '../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { DialogService } from '../../../../utilities.pck/dialog.mod/services/dialog.service';
import { ErrorHandlerInterface } from '../../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { AuthResetInterface } from '../../interfaces/auth-reset.interface';
import { ResetPasswordService } from '../../services/reset-password.service';
import { ErrorHandlerTypeEnum } from '../../../../utilities.pck/error-handler.mod/enums/error-handler-type.enum';
import { DialogTypeEnum } from '../../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import * as ErrorHandlerActions from '../../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['../auth.component.scss']
})

export class ResetPasswordComponent implements OnDestroy {
	public routing = ROUTING;
	public formFields;
	public userState;
	public version = '1.0.0';

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _activatedRouter: ActivatedRoute,
		private _loadingAnimationService: LoadingAnimationService,
		private _dialogService: DialogService,
		private _store: Store<ErrorHandlerInterface>,
		private _resetPasswordService: ResetPasswordService,
		private _router: Router,
		private _i18n: I18n
	) {
		// user state
		this._activatedRouter.queryParams.subscribe(() => {
			const currentNavigation = this._router.getCurrentNavigation();
			this.userState = currentNavigation && currentNavigation.extras && currentNavigation.extras.state;
		});

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
		// start loading animation
		this._loadingAnimationService.startLoadingAnimation();

		// reset payload
		const resetPayload: AuthResetInterface = {
			email: this.userState.email,
			verificationCode: this.verificationCode.value,
			password: this.password.value
		};

		this._resetPasswordService.authResetPassword(resetPayload)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe((res) => {
				if (res && res.code === 'CodeMismatchException') {
					// error payload
					const data = {
						type: ErrorHandlerTypeEnum.COMMON_ERROR,
						payload: {
							title: this._i18n({
								value: 'Title: User Not Found Exception',
								id: 'Auth_Reset_Password_Form_Error_CodeMismatchException_Title'
							}),
							message: this._i18n({
								value: 'Description: User Not Found Exception',
								id: 'Auth_Reset_Password_Form_Error_CodeMismatchException_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
						}
					};

					// error dispatch
					this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(data));
				} else {
					// clear the form
					this.formFields.reset();

					// dialog payload
					const data = {
						type: DialogTypeEnum.NOTICE,
						payload: {
							title: this._i18n({ value: 'Title: Password Reset', id: 'Auth_Reset_Password_Form_Success_Title' }),
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
				}
			}, () => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// error payload
				const data = {
					type: ErrorHandlerTypeEnum.COMMON_ERROR,
					payload: {
						title: this._i18n({ value: 'Title: Error Generic', id: 'Auth_Reset_Password_Form_Error_Generic_Title' }),
						message: this._i18n({
							value: 'Description: Error Generic',
							id: 'Auth_Reset_Password_Form_Error_Generic_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
					}
				};

				// error dispatch
				this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(data));
			});
	}
}