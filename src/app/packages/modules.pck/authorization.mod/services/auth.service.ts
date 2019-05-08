// angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

// store
import { Store } from '@ngrx/store';

// app
import * as moment from 'moment';
import * as ErrorHandlerActions from '../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';
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
import { ErrorHandlerPayloadInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler-payload.interface';
import { LoadingAnimationService } from '../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { DialogTypeEnum } from '../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';

@Injectable()
export class AuthService {
	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _proxyService: ProxyService,
		private _storageService: StorageService,
		private _router: Router,
		private _store: Store<{ SessionInterface: SessionInterface }>,
		private _i18n: I18n,
		private _dialogService: DialogService,
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
					const errorPayload: ErrorHandlerPayloadInterface = {
						title: this._i18n({
							value: 'Title: User Exists Exception',
							id: 'Error_UsernameExistsException_Title'
						}),
						message: this._i18n({
							value: 'Description: User Exists Exception',
							id: 'Error_UsernameExistsException_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
					};
					this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(errorPayload));
				}

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
	}

	/**
	 * perform login process
	 *
	 * @param formPayload
	 * @param rememberMe
	 * @param redirectUrl
	 */
	public authLogin(formPayload: AuthLoginInterface, rememberMe: boolean, redirectUrl?: string) {
		this._proxyService
			.postAPI(AppServices['Auth']['Login'], { bodyParams: formPayload })
			.subscribe(res => {
				if (res) {
					// decode token
					const userInfo = HelperService.decodeJWTToken(res.idToken.jwtToken);

					// set current user state
					this.currentUserState = {
						profile: {
							...userInfo,
							password: formPayload.password
						},
						credentials: {
							accessToken: res.accessToken.jwtToken,
							idToken: res.idToken.jwtToken,
							refreshToken: res.refreshToken.token
						},
						rememberMe: rememberMe,
						timestamp: moment()
					};

					// navigate to defined url
					this._router
						.navigate([ROUTING.dashboard])
						.then(() => this._loadingAnimationService.stopLoadingAnimation());
				}
			}, (err: HttpErrorResponse) => {
				let errorPayload: ErrorHandlerPayloadInterface;
				switch (err.error.detail.code) {
					case 'UserLambdaValidationException':
						errorPayload = {
							title: this._i18n({
								value: 'Title: Block User Exception',
								id: 'Error_BlockUserException_Title'
							}),
							message: this._i18n({
								value: 'Description: Block User Exception',
								id: 'Error_BlockUserException_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
						};
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(errorPayload));
						break;
					case 'UserNotFoundException':
						errorPayload = {
							title: this._i18n({
								value: 'Title: User Not Found Exception',
								id: 'Error_UserNotFoundException_Title'
							}),
							message: this._i18n({
								value: 'Description: User Not Found Exception',
								id: 'Error_UserNotFoundException_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
						};
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(errorPayload));
						break;
					case 'UserNotConfirmedException':
						errorPayload = {
							title: this._i18n({
								value: 'Title: User Not Confirmed Exception',
								id: 'Error_UserNotConfirmedException_Title'
							}),
							message: this._i18n({
								value: 'Description: User Not Confirmed Exception',
								id: 'Error_UserNotConfirmedException_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
						};
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(errorPayload));
						break;
					case 'NotAuthorizedException':
						errorPayload = {
							title: this._i18n({
								value: 'Title: Password Invalid Exception',
								id: 'Error_PasswordInvalid_Title'
							}),
							message: this._i18n({
								value: 'Description: Password Invalid Exception',
								id: 'Error_PasswordInvalid_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
						};
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(errorPayload));
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
						title: this._i18n({ value: 'Title: Password Reset', id: 'Auth_Forgot_Password_Form_Success_Title' }),
						message: this._i18n({
							value: 'Description: Forgot Password',
							id: 'Auth_Forgot_Password_Form_Success_Description'
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
				let errorPayload: ErrorHandlerPayloadInterface;
				switch (err.error.detail.code) {
					case 'InvalidParameterException':
						errorPayload = {
							title: this._i18n({
								value: 'Title: Invalid Parameter Exception',
								id: 'Error_InvalidParameterException_Title'
							}),
							message: this._i18n({
								value: 'Description: Invalid Parameter Exception',
								id: 'Error_InvalidParameterException_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
						};
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(errorPayload));
						break;
					case 'UserNotFoundException':
						errorPayload = {
							title: this._i18n({
								value: 'Title: User Not Found Exception',
								id: 'Error_UserNotFoundException_Title'
							}),
							message: this._i18n({
								value: 'Description: User Not Found Exception',
								id: 'Error_UserNotFoundException_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
						};
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(errorPayload));
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
						title: this._i18n({ value: 'Title: Reset Password', id: 'Auth_Reset_Password_Form_Success_Title' }),
						message: this._i18n({
							value: 'Description: Reset Password',
							id: 'Auth_Reset_Password_Form_Success_Description'
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
				if (err.error.detail.code === 'CodeMismatchException') {
					const errorPayload: ErrorHandlerPayloadInterface = {
						title: this._i18n({
							value: 'Title: Verification Code Exception',
							id: 'Error_CodeMismatchException_Title'
						}),
						message: this._i18n({
							value: 'Description: Verification Code Exception',
							id: 'Error_CodeMismatchException_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
					};
					this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(errorPayload));
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
		this._router.navigate([ROUTING.authorization.login]).then();
	}
}
