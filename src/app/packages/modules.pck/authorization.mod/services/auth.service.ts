// angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

// app
import { AppServices, LocalStorageItems, SessionStorageItems } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AuthForgotInterface } from '../interfaces/auth-forgot.interface';
import { AuthRegisterInterface } from '../interfaces/auth-register.interface';
import { AuthLoginInterface } from '../interfaces/auth-login.interface';
import { AuthResetInterface } from '../interfaces/auth-reset.interface';
import { StorageTypeEnum } from '../../../core.pck/storage.mod/enums/storage-type.enum';
import { StorageService } from '../../../core.pck/storage.mod/services/storage.service';
import { ROUTING } from '../../../../../environments/environment';

@Injectable()
export class AuthService {
	constructor(
		private _proxyService: ProxyService,
		private _storageService: StorageService,
		private _router: Router
	) {
	}

	/**
	 * set current user state
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
	 */
	public authLogin(payload: AuthLoginInterface) {
		return this._proxyService
			.postAPI(AppServices['Auth']['Login'], { bodyParams: payload });
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
				accessToken: userState.credentials.accessToken.jwtToken,
				refreshToken: userState.credentials.refreshToken.token,
				username: userState.profile.username
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
					const payloadLogout = { accessToken: this.currentUserState.credentials.accessToken.jwtToken };

					// call sign-out service
					this._proxyService
						.postAPI(AppServices['Auth']['Logout'], { bodyParams: payloadLogout })
						.subscribe();
				}

				// clear data
				StorageService.clearAllLocalStorageItems();
				StorageService.clearAllSessionStorageItems();

				// navigate to login
				this._router.navigate([ROUTING.authorization.login]).then();
			});
	}
}
