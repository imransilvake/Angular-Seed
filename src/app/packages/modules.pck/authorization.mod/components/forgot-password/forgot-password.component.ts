// angular
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// store
import { Store } from '@ngrx/store';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { ValidationService } from '../../../../core.pck/fields.mod/services/validation.service';
import { LoadingAnimationService } from '../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { AuthForgotInterface } from '../../interfaces/auth-forgot.interface';
import { ErrorHandlerTypeEnum } from '../../../../utilities.pck/error-handler.mod/enums/error-handler-type.enum';
import { DialogTypeEnum } from '../../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../../utilities.pck/dialog.mod/services/dialog.service';
import { ErrorHandlerInterface } from '../../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { NavigationExtras, Router } from '@angular/router';
import * as ErrorHandlerActions from '../../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['../auth.component.scss']
})

export class ForgotPasswordComponent implements OnDestroy {
	public routing = ROUTING;
	public formFields;
	public version = '1.0.0';

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _dialogService: DialogService,
		private _store: Store<ErrorHandlerInterface>,
		private _forgotPasswordService: ForgotPasswordService,
		private _router: Router,
		private _i18n: I18n
	) {
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

		// forgot payload
		const forgotPayload: AuthForgotInterface = {
			email: this.email.value
		};

		// start forgot password process
		this._forgotPasswordService.authForgotPassword(forgotPayload)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe((res) => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				if (res && res.code === 'UserNotFoundException') {
					// error payload
					const data = {
						type: ErrorHandlerTypeEnum.COMMON_ERROR,
						payload: {
							title: this._i18n({
								value: 'Title: User Not Found Exception',
								id: 'Auth_Forgot_Password_Form_Error_UserNotFoundException_Title'
							}),
							message: this._i18n({
								value: 'Description: User Not Found Exception',
								id: 'Auth_Forgot_Password_Form_Error_UserNotFoundException_Description'
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
							title: this._i18n({ value: 'Title: Password Reset', id: 'Auth_Forgot_Password_Form_Success_Title' }),
							message: this._i18n({
								value: 'Description: Forgot Password',
								id: 'Auth_Forgot_Password_Form_Success_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
						}
					};

					// dialog service
					this._dialogService.showDialog(data)
						.pipe(takeUntil(this._ngUnSubscribe))
						.subscribe(() => {
							// navigate to reset route
							const state: NavigationExtras = {
								state: {
									secretId: 'ham-reset-unlock',
									email: forgotPayload.email
								}
							};
							this._router.navigate([ROUTING.authorization.reset], state).then();
						});
				}
			}, () => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// error payload
				const data = {
					type: ErrorHandlerTypeEnum.COMMON_ERROR,
					payload: {
						title: this._i18n({ value: 'Title: Error Generic', id: 'Auth_Forgot_Password_Form_Error_Generic_Title' }),
						message: this._i18n({
							value: 'Description: Error Generic',
							id: 'Auth_Forgot_Password_Form_Error_Generic_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
					}
				};

				// error dispatch
				this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(data));
			});
	}
}
