// angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { HttpErrorResponse } from '@angular/common/http';

// store
import { Store } from '@ngrx/store';

// app
import * as ErrorHandlerActions from '../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';
import * as SessionActions from '../../../core.pck/session.mod/store/actions/session.actions';
import { AppServices, LocalStorageItems, SessionStorageItems } from '../../../../../app.config';
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

@Injectable()
export class AuthService {
	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _proxyService: ProxyService,
		private _storageService: StorageService,
		private _router: Router,
		private _store: Store<{ SessionInterface: SessionInterface }>,
		private _i18n: I18n
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
	 * @param payload
	 */
	public authRegister(payload: AuthRegisterInterface) {
		return this._proxyService
			.postAPI(AppServices['Auth']['Register'], { bodyParams: payload });
	}

	/**
	 * perform login process
	 *
	 * @param payload
	 * @param rememberMe
	 * @param redirectUrl
	 */
	public authLogin(payload: AuthLoginInterface, rememberMe: boolean, redirectUrl?: string) {
		this._proxyService
			.postAPI(AppServices['Auth']['Login'], { bodyParams: payload })
			.subscribe(res => {
				if (res) {
					// decode token
					const userInfo = HelperService.decodeJWTToken(res.idToken.jwtToken);

					// set current user state
					this.currentUserState = {
						profile: {
							...userInfo,
							password: payload.password
						},
						credentials: {
							accessToken: res.accessToken.jwtToken,
							idToken: res.idToken.jwtToken,
							refreshToken: res.refreshToken.token
						},
						rememberMe: rememberMe
					};

					// navigate to defined url
					this._router
						.navigate([ROUTING.dashboard])
						.then(() => this._loadingAnimationService.stopLoadingAnimation());
				}
			}, (err: HttpErrorResponse) => {
				let payload: ErrorHandlerPayloadInterface;
				switch (err.error.detail.code) {
					case 'UserLambdaValidationException':
						payload = {
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
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
						break;
					case 'NotAuthorizedException':
						payload = {
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
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
						break;
				}

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation()
			});
	}

	/**
	 * perform forgot password process
	 *
	 * @param payload
	 */
	public authForgotPassword(payload: AuthForgotInterface) {
		return this._proxyService
			.postAPI(AppServices['Auth']['Forgot_Password'], { bodyParams: payload });
	}

	/**
	 * perform reset password process
	 *
	 * @param payload
	 */
	public authResetPassword(payload: AuthResetInterface) {
		return this._proxyService
			.postAPI(AppServices['Auth']['Reset_Password'], { bodyParams: payload });
	}

	/**
	 * authenticate logged-in user
	 */
	public authenticateUser() {
		const userState = this.currentUserState;
		if (userState) {
			// payload
			const payloadSessionValidate = {
				accessToken: userState.credentials.accessToken,
				refreshToken: userState.credentials.refreshToken,
				username: userState.profile.email
			};

			// service: session validity
			return this._proxyService
				.postAPI(AppServices['Auth']['Session_Validity'], { bodyParams: payloadSessionValidate });
		}

		// authentication failed
		return of({ status: 'FAIL' });
	}

	/**
	 * logout user
	 */
	public logoutUser() {
		this.authenticateUser()
			.subscribe(res => {
				if (res && res.status === 'OK') {
					// logout payload
					const payloadLogout = {
						email: this.currentUserState.profile.email,
						accessToken: this.currentUserState.credentials.accessToken
					};

					// call sign-out service
					this._proxyService
						.postAPI(AppServices['Auth']['Logout'], { bodyParams: payloadLogout })
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
