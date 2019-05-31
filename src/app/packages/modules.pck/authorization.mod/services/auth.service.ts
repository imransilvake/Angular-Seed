// angular
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

// store
import { Store } from '@ngrx/store';

// app
import * as moment from 'moment';
import * as SessionActions from '../../../core.pck/session.mod/store/actions/session.actions';
import { AppOptions, AppServices, LocalStorageItems, SessionStorageItems } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AuthForgotInterface } from '../interfaces/auth-forgot.interface';
import { AuthRegisterInterface } from '../interfaces/auth-register.interface';
import { AuthLoginInterface } from '../interfaces/auth-login.interface';
import { AuthResetInterface } from '../interfaces/auth-reset.interface';
import { StorageTypeEnum } from '../../../core.pck/storage.mod/enums/storage-type.enum';
import { StorageService } from '../../../core.pck/storage.mod/services/storage.service';
import { ROUTING } from '../../../../../environments/environment';
import { SessionInterface } from '../../../core.pck/session.mod/interfaces/session.interface';
import { SessionsEnum } from '../../../core.pck/session.mod/enums/sessions.enum';
import { HelperService } from '../../../utilities.pck/accessories.mod/services/helper.service';
import { LoadingAnimationService } from '../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { DialogTypeEnum } from '../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
	public errorMessage: EventEmitter<string> = new EventEmitter();

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _proxyService: ProxyService,
		private _storageService: StorageService,
		private _router: Router,
		private _store: Store<{ SessionInterface: SessionInterface }>,
		private _i18n: I18n,
		private _dialogService: DialogService
	) {
	}

	/**
	 * set current user state
	 *
	 * @param data
	 */
	set currentUserState(data: any) {
		if (data.rememberMe) {
			this._storageService.put(LocalStorageItems.userState, data, StorageTypeEnum.PERSISTANT);
		} else {
			this._storageService.put(SessionStorageItems.userState, data, StorageTypeEnum.SESSION);
		}
	}

	/**
	 * get current user state
	 */
	get currentUserState() {
		return (
			this._storageService.get(LocalStorageItems.userState, StorageTypeEnum.PERSISTANT) ||
			this._storageService.get(SessionStorageItems.userState, StorageTypeEnum.SESSION)
		);
	}

	/**
	 * perform registration process
	 *
	 * @param formPayload
	 * @param formFields
	 */
	public authRegister(formPayload: AuthRegisterInterface, formFields: FormGroup) {
		this._proxyService
			.postAPI(AppServices['Auth']['Register'], { bodyParams: formPayload })
			.subscribe(() => {
				// clear the form
				formFields.reset();

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// dialog payload
				const data = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						icon: 'dialog_email',
						title: this._i18n({ value: 'Title: Success', id: 'Auth_Register_Form_Success_Title' }),
						message: this._i18n({ value: 'Description: Success', id: 'Auth_Register_Form_Success_Description' }),
						buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
					}
				};

				// dialog service
				this._dialogService
					.showDialog(data)
					.subscribe(() =>
						this._router.navigate([ROUTING.authorization.login]).then()
					);
			}, (err: HttpErrorResponse) => {
				if (err.error.detail.code === 'UsernameExistsException') {
					const message = this._i18n({
						value: 'Description: Username Exists Exception',
						id: 'Auth_Register_Error_UsernameExistsException_Description'
					});

					// set field to show error message
					formFields.get('email').setErrors({ backendError: true, text: message });

					// message
					this.errorMessage.emit(message);
				}

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
	}

	/**
	 * perform login process
	 *
	 * @param formPayload
	 * @param formFields
	 */
	public authLogin(formPayload: AuthLoginInterface, formFields: FormGroup) {
		this._proxyService
			.postAPI(AppServices['Auth']['Login'], { bodyParams: formPayload })
			.subscribe(res => {
				if (res) {
					// decode token
					const userInfo = HelperService.decodeJWTToken(res.idToken.jwtToken);

					// get profile image
					const imagePayload = { image: userInfo.picture };

					// service: fetch profile image
					const imageResponse = !userInfo.picture ?
						of(null) :
						this._proxyService
							.postAPI(AppServices['Utilities']['Fetch_Profile_Image'], { bodyParams: imagePayload });

					// image service response
					imageResponse.subscribe(resp => {
						// set current user state
						this.currentUserState = {
							profile: {
								...userInfo,
								password: formPayload.password,
								language: formFields.value.languageName,
								image: resp ? resp.image : null
							},
							credentials: {
								accessToken: res.accessToken.jwtToken,
								idToken: res.idToken.jwtToken,
								refreshToken: res.refreshToken.token
							},
							rememberMe: formFields.value.rememberMe,
							timestamp: moment()
						};

						// navigate to defined url
						// stop loading animation
						this._router
							.navigate([ROUTING.dashboard])
							.then(() => this._loadingAnimationService.stopLoadingAnimation());
					});
				}
			}, (err: HttpErrorResponse) => {
				let message;
				switch (err.error.detail.code) {
					case 'UserLambdaValidationException':
						message = this._i18n({
							value: 'Description: Block User Exception',
							id: 'Auth_Login_Error_BlockUserException_Description'
						});

						// message
						this.errorMessage.emit(message);
						break;
					case 'UserNotFoundException':
						message = this._i18n({
							value: 'Description: User Not Found Exception',
							id: 'Auth_Login_Error_UserNotFoundException_Description'
						});

						// set field to show error message
						formFields.get('email').setErrors({ backendError: true, text: message });

						// message
						this.errorMessage.emit(message);
						break;
					case 'UserNotConfirmedException':
						message = this._i18n({
							value: 'Description: User Not Confirmed Exception',
							id: 'Auth_Login_Error_UserNotConfirmedException_Description'
						});

						// set field to show error message
						formFields.get('email').setErrors({ backendError: true, text: message });

						// message
						this.errorMessage.emit(message);
						break;
					case 'NotAuthorizedException':
						message = this._i18n({
							value: 'Description: Password Invalid Exception',
							id: 'Auth_Login_Error_PasswordInvalid_Description'
						});

						// set fields to show error message
						if (formFields.get('email')) {
							formFields.get('email').setErrors({ backendError: true, text: message });
						}
						formFields.get('password').setErrors({ backendError: true, text: message });

						// message
						this.errorMessage.emit(message);
						break;
				}

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
	}

	/**
	 * perform forgot password process
	 *
	 * @param formPayload
	 * @param formFields
	 */
	public authForgotPassword(formPayload: AuthForgotInterface, formFields: FormGroup) {
		this._proxyService
			.postAPI(AppServices['Auth']['Forgot_Password'], { bodyParams: formPayload })
			.subscribe(() => {
				// clear the form
				formFields.reset();

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// payload
				const dialogPayload = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						icon: 'dialog_email',
						title: this._i18n({ value: 'Title: Password Reset', id: 'Auth_ForgotPassword_Form_Success_Title' }),
						message: this._i18n({
							value: 'Description: Forgot Password',
							id: 'Auth_ForgotPassword_Form_Success_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
					}
				};

				// dialog service
				this._dialogService
					.showDialog(dialogPayload)
					.subscribe(() =>
						this._router.navigate([ROUTING.authorization.login]).then()
					);
			}, (err: HttpErrorResponse) => {
				let message;
				switch (err.error.detail.code) {
					case 'InvalidParameterException':
						message = this._i18n({
							value: 'Description: Invalid Parameter Exception',
							id: 'Auth_ForgotPassword_Error_InvalidParameterException_Description'
						});

						// set field to show error message
						formFields.get('email').setErrors({ backendError: true, text: message });

						// message
						this.errorMessage.emit(message);
						break;
					case 'UserNotFoundException':
						message = this._i18n({
							value: 'Description: User Not Found Exception',
							id: 'Auth_ForgotPassword_Error_UserNotFoundException_Description'
						});

						// set field to show error message
						formFields.get('email').setErrors({ backendError: true, text: message });

						// message
						this.errorMessage.emit(message);
						break;
					case 'InvalidFirstName':
						message = this._i18n({
							value: 'Description: Invalid First Name Exception',
							id: 'Auth_ForgotPassword_Error_InvalidFirstNameException_Description'
						});

						// set field to show error message
						formFields.get('firstName').setErrors({ backendError: true, text: message });

						// message
						this.errorMessage.emit(message);
						break;
					case 'InvalidLastName':
						message = this._i18n({
							value: 'Description: Invalid Last Name Exception',
							id: 'Auth_ForgotPassword_Error_InvalidLastNameException_Description'
						});

						// set field to show error message
						formFields.get('lastName').setErrors({ backendError: true, text: message });

						// message
						this.errorMessage.emit(message);
						break;
				}

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
	}

	/**
	 * perform reset password process
	 *
	 * @param formPayload
	 * @param formFields
	 */
	public authResetPassword(formPayload: AuthResetInterface, formFields: FormGroup) {
		this._proxyService
			.postAPI(AppServices['Auth']['Reset_Password'], { bodyParams: formPayload })
			.subscribe(() => {
				// clear the form
				formFields.reset();

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();

				// payload
				const dialogPayload = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						icon: 'dialog_tick',
						title: this._i18n({ value: 'Title: Reset Password', id: 'Auth_ResetPassword_Form_Success_Title' }),
						message: this._i18n({
							value: 'Description: Reset Password',
							id: 'Auth_ResetPassword_Form_Success_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
					}
				};

				// dialog service
				this._dialogService
					.showDialog(dialogPayload)
					.subscribe(() =>
						this._router.navigate([ROUTING.authorization.login]).then()
					);
			}, (err: HttpErrorResponse) => {
				let message;
				switch (err.error.detail.code) {
					case 'CodeMismatchException':
						message = this._i18n({
							value: 'Description: Mismatch Verification Code Exception',
							id: 'Auth_ResetPassword_Error_CodeMismatchException_Description'
						});

						// message
						this.errorMessage.emit(message);
						break;
					case 'ExpiredCodeException':
						message = this._i18n({
							value: 'Description: Expired Verification Code Exception',
							id: 'Auth_ResetPassword_Error_ExpiredCodeException_Description'
						});

						// message
						this.errorMessage.emit(message);
						break;
				}

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
	}

	/**
	 * authenticate logged-in user
	 */
	public authenticateUser() {
		const userState = this.currentUserState;
		if (userState) {
			const storageValidity = moment().diff(userState.timestamp, 'days');
			if (storageValidity <= AppOptions.rememberMeValidityInDays) {
				// payload
				const sessionValidityPayload = {
					accessToken: userState.credentials.accessToken,
					refreshToken: userState.credentials.refreshToken,
					username: userState.profile.email
				};

				// service: session validity
				return this._proxyService
					.postAPI(AppServices['Auth']['Session_Validity'], { bodyParams: sessionValidityPayload });
			}
		}

		// authentication failed
		return of({ status: 'FAIL' });
	}

	/**
	 * logout user
	 */
	public logoutUser() {
		this.authenticateUser()
			.subscribe(() => {
				if (this.currentUserState) {
					// payload
					const logoutPayload = {
						email: this.currentUserState.profile.email,
						accessToken: this.currentUserState.credentials.accessToken
					};

					// call sign-out service
					this._proxyService
						.postAPI(AppServices['Auth']['Logout'], { bodyParams: logoutPayload })
						.subscribe();
				}

				// clear all sessions
				this._store.dispatch(new SessionActions.SessionCounterExit(SessionsEnum.SESSION_ALL));

				// clear sessions
				this.clearSessions();
			});
	}

	/**
	 * clear sessions
	 */
	public clearSessions() {
		// clear data
		StorageService.clearAllLocalStorageItems();
		StorageService.clearAllSessionStorageItems();

		// navigate to login
		this._router
			.navigate([ROUTING.authorization.login])
			.then(() => this._loadingAnimationService.stopLoadingAnimation());
	}
}
