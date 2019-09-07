// angular
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormGroup } from '@angular/forms';

// store
import { Store } from '@ngrx/store';

// amplify
import { Auth } from 'aws-amplify';

// app
import * as moment from 'moment';
import * as SessionActions from '../../../core.pck/session.mod/store/actions/session.actions';
import { LocalStorageItems, SessionStorageItems } from '../../../../../app.config';
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

@Injectable({ providedIn: 'root' })
export class AuthService {
	public authRoutes = [];
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
		this.authRoutes = [
			ROUTING.authorization.routes.login,
			ROUTING.authorization.routes.changePassword
		];
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
		Auth.signIn(formPayload.username, formPayload.password)
			.then(user => {
				// route: change password
				const challenge = user.ChallengeName || user.challengeName;
				if (challenge && challenge === 'NEW_PASSWORD_REQUIRED') {
					const currentUrl = this._router.url.split('?')[0];
					if (currentUrl !== `/${ROUTING.authorization.routes.changePassword}`) {
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
						// update new password
						Auth.completeNewPassword(
							user,
							formPayload.newPassword,
							{
								email: formPayload.username
							}
						).then(() => {
							// payload
							const payload = {
								email: formPayload.username,
								password: formPayload.newPassword,
								rememberMe: false
							};

							// login user
							this.initUserState(user, payload);
						}).catch(err => {
							// log error
							console.error(err);

							// stop loading animation
							this._loadingAnimationService.stopLoadingAnimation();
						});
					}
				} else {
					// payload
					const payload = {
						email: formPayload.username,
						password: formPayload.password,
						rememberMe: !!formFields ? formFields.value.rememberMe : false
					};

					// login user
					this.initUserState(user, payload);
				}
			})
			.catch(err => {
				const error = err && err.message;
				if (error) {
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
	 * authentication validation
	 *
	 * @param state
	 */
	public authValidation(state) {
		const currentPath = state.url.substring(1);
		return Auth.currentSession()
			.then(credentials => {
				// get current user state
				const data = this.currentUserState;

				// set current user state
				if (data.credentials['idToken'].jwtToken !== credentials['idToken'].jwtToken) {
					const userInfo = HelperService.decodeJWTToken(credentials['idToken'].jwtToken);
					this.currentUserState = {
						profile: {
							...userInfo,
							password: data.profile.password,
							language: data.profile.language
						},
						credentials: credentials,
						rememberMe: data.rememberMe,
						timestamp: data.timestamp
					};
				}

				// navigate to dashboard
				if (this.authRoutes.includes(currentPath)) {
					this._router.navigate([ROUTING.pages.dashboard]).then();
				}
				return true;
			})
			.catch(() => {
				if (!this.authRoutes.includes(currentPath)) {
					// logout user
					this.authLogoutUser();
				}
				return true;
			});
	}

	/**
	 * logout user
	 */
	public authLogoutUser() {
		// check user session
		Auth.currentAuthenticatedUser()
			.then(() => {
				if (this.currentUserState) {
					// logout
					Auth.signOut()
						.then(() => this.authClearSessions())
						.catch(err => console.error(err));
				}
			})
			.catch(err => {
				// clear sessions
				this.authClearSessions();

				// log error
				console.error(err);
			});
	}

	/**
	 * clear sessions
	 */
	public authClearSessions() {
		// clear sessions
		this._store.dispatch(new SessionActions.SessionCounterExit(SessionsEnum.SESSION_AUTHENTICATION));

		// clear data
		StorageService.clearAllLocalStorageItems();
		StorageService.clearAllSessionStorageItems();

		// navigate to login
		this._router
			.navigate([ROUTING.authorization.routes.login])
			.then(() => this._loadingAnimationService.stopLoadingAnimation());
	}

	/**
	 * init user state
	 *
	 * @param data
	 * @param formPayload
	 */
	private initUserState(data, formPayload) {
		// decode token
		const userInfo = HelperService.decodeJWTToken(data['signInUserSession'].idToken['jwtToken']);

		// set current user state
		this.currentUserState = {
			profile: {
				...userInfo,
				password: HelperService.hashPassword(formPayload.password),
				language: 'en'
			},
			credentials: data['signInUserSession'],
			rememberMe: formPayload.rememberMe,
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
