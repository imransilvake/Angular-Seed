// angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
import * as ErrorHandlerActions from '../../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['../auth.component.scss']
})

export class ForgotPasswordComponent {
	public routing = ROUTING;
	public formFields;
	public version = '1.0.0';

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _dialogService: DialogService,
		private _store: Store<ErrorHandlerInterface>,
		private _forgotPasswordService: ForgotPasswordService
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

	/**
	 * setters
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
			.subscribe((res) => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				if (res && res.code === 'UserNotFoundException') {
					// error payload
					const data = {
						type: ErrorHandlerTypeEnum.COMMON_ERROR,
						payload: {
							title: res.code,
							message: res.message,
							buttonTexts: ['Close']
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
							title: 'Password has been reset',
							message: 'Please follow the instructions in the mail we sent you to reset your password.',
							buttonTexts: ['OK']
						}
					};

					// dialog service
					this._dialogService.showDialog(data);
				}
			}, () => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// error payload
				const data = {
					type: ErrorHandlerTypeEnum.COMMON_ERROR,
					payload: {
						title: 'Registration Error',
						message: 'Registration process is failed due to some reason. Please contact the administration!',
						buttonTexts: ['Close']
					}
				};

				// error dispatch
				this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(data));
			});
	}
}
