// angular
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

// store
import { Store } from '@ngrx/store';

// amplify
import { Auth } from 'aws-amplify';

// app
import * as moment from 'moment';
import * as SessionActions from '../../../core.pck/session.mod/store/actions/session.actions';
import { AppOptions, AppServices, LocalStorageItems, SessionStorageItems } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AuthLoginInterface } from '../interfaces/auth-login.interface';
import { StorageTypeEnum } from '../../../core.pck/storage.mod/enums/storage-type.enum';
import { StorageService } from '../../../core.pck/storage.mod/services/storage.service';
import { ROUTING } from '../../../../../environments/environment';
import { SessionInterface } from '../../../core.pck/session.mod/interfaces/session.interface';
import { SessionsEnum } from '../../../core.pck/session.mod/enums/sessions.enum';
import { HelperService } from '../../../utilities.pck/accessories.mod/services/helper.service';
import { LoadingAnimationService } from '../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';
import { AppViewStateInterface } from '../../../frame.pck/interfaces/app-view-state.interfsce';
import { UserRoleEnum } from '../enums/user-role.enum';
import { AuthChangePasswordInterface } from '../interfaces/auth-change-password.interface';

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
		const storageItem = data.rememberMe ? LocalStorageItems.userState : SessionStorageItems.userState;
		const storageType = data.rememberMe ? StorageTypeEnum.PERSISTANT : StorageTypeEnum.SESSION;
		this._storageService.put(storageItem, data, storageType);
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
	 * perform login process
	 *
	 * @param formPayload
	 * @param formFields
	 */
	public authLogin(formPayload: AuthLoginInterface, formFields?: FormGroup) {
		this._proxyService
			.postAPI(AppServices['Auth']['Login'], { bodyParams: formPayload })
			.subscribe(res => {
				if (res) {
					// route: change password
					if (res.ChallengeName && res.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
						// navigate to defined url
						// stop loading animation
						this._router
							.navigate(
								[ROUTING.authorization.routes.changePassword],
								{ queryParams: { email: formPayload.username } }
							)
							.then(() => {
								// stop loading animation
								this._loadingAnimationService.stopLoadingAnimation();
							});
					} else {
						// decode token
						const userInfo = HelperService.decodeJWTToken(res.AuthenticationResult.IdToken);

						// set current user state
						this.currentUserState = {
							profile: {
								...userInfo,
								password: formPayload.password,
								language: 'en'
							},
							credentials: res.AuthenticationResult,
							rememberMe: !!formFields ? formFields.value.rememberMe : false,
							timestamp: moment()
						};

						// navigate to defined url
						// stop loading animation
						this._router
							.navigate([ROUTING.pages.dashboard])
							.then(() => {
								// set initial app state
								const groups = this.currentUserState.profile['cognito:groups'];
								const role = groups && groups[0];

								// init app state
								if (role) {
									this.initAppState({
										role: role.toUpperCase()
									});
								}

								// stop loading animation
								this._loadingAnimationService.stopLoadingAnimation();
							});
					}
				}
			}, (err: HttpErrorResponse) => {
				const error = err && err.error && err.error.errors && err.error.errors.exception;
				if (error && error[0]) {
					const message = this._i18n({
						value: 'Error: {{message}}',
						id: 'Auth_Login_Error_UserOrPasswordException_Description',
					}, {
						message: error
					});

					// message
					this.errorMessage.emit(message);

					// set field to show error message
					if (message.indexOf('attempts') === -1) {
						formFields.get('email').setErrors({ backendError: true, text: message });
						formFields.get('password').setErrors({ backendError: true, text: message });
					}
				}

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
	}

	/**
	 * perform change password process
	 *
	 * @param formPayload
	 * @param formFields
	 */
	public authChangePassword(formPayload: AuthChangePasswordInterface, formFields: FormGroup) {
		Auth.signIn(formPayload.email, formPayload.oldPassword)
			.then(user => {
				if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
					Auth.completeNewPassword(
						user,
						formPayload.newPassword,
						{
							email: formPayload.email
						}
					).then(() => {
						// login user
						this.authLogin({
							username: formPayload.email,
							password: formPayload.newPassword
						});
					}).catch(err => {
						// log error
						console.error(err);

						// stop loading animation
						this._loadingAnimationService.stopLoadingAnimation();
					});
				}
			})
			.catch(err => {
				// log error
				console.error(err);

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
	}

	/**
	 * authenticate logged-in user
	 *
	 * @param payload
	 */
	public authenticateUser(payload?: any) {
		const userState = this.currentUserState;
		if (userState) {
			const storageValidity = moment().diff(userState.timestamp, 'days');
			if (storageValidity <= AppOptions.rememberMeValidityInDays) {
				// payload
				const sessionValidityPayload = {
					accessToken: userState.credentials.AccessToken,
					refreshToken: userState.credentials.RefreshToken,
					username: userState.profile.email,
					...payload
				};

				// TODO
				return of({ status: 'OK' });

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
	public authLogoutUser() {
		this.authenticateUser()
			.subscribe(() => {
				if (this.currentUserState) {
					// payload
					const logoutPayload = {
						email: this.currentUserState.profile.email,
						accessToken: this.currentUserState.credentials.AccessToken
					};

					// call sign-out service
					//this._proxyService
					//	.postAPI(AppServices['Auth']['Logout'], { bodyParams: logoutPayload })
					//	.subscribe();
				}

				// clear sessions
				this._store.dispatch(new SessionActions.SessionCounterExit(SessionsEnum.SESSION_AUTHENTICATION));
				this._store.dispatch(new SessionActions.SessionCounterExit(SessionsEnum.SESSION_NOTIFICATIONS));

				// clear sessions
				this.authClearSessions();
			});
	}

	/**
	 * clear sessions
	 */
	public authClearSessions() {
		// clear data
		StorageService.clearAllLocalStorageItems();
		StorageService.clearAllSessionStorageItems();

		// navigate to login
		this._router
			.navigate([ROUTING.authorization.routes.login])
			.then(() => this._loadingAnimationService.stopLoadingAnimation());
	}

	/**
	 * init app state
	 *
	 * @param payload
	 */
	private initAppState(payload: any) {
		let type;

		// set type
		switch (payload.role) {
			case UserRoleEnum[UserRoleEnum.ADMIN]:
				type = 0;
				break;
			case UserRoleEnum[UserRoleEnum.PARTNER]:
				type = 1;
				break;
			default:
				type = 2;
				break;
		}

		// app state payload
		const appStatePayload: AppViewStateInterface = {
			role: payload.role
		};

		// save to browser storage
		const storageItem = this.currentUserState.rememberMe ? LocalStorageItems.appState : SessionStorageItems.appState;
		const storageType = this.currentUserState.rememberMe ? StorageTypeEnum.PERSISTANT : StorageTypeEnum.SESSION;
		this._storageService.put(storageItem, appStatePayload, storageType);
	}
}
