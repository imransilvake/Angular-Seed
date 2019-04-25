// angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
	 * perform registration process
	 *
	 * @param payload
	 */
	public authRegister(payload: AuthRegisterInterface) {
		return this._proxyService
			.postAPI(AppServices['authRegister'], { bodyParams: payload });
	}

	/**
	 * perform login process
	 *
	 * @param payload
	 */
	public authLogin(payload: AuthLoginInterface) {
		return this._proxyService
			.postAPI(AppServices['authLogin'], { bodyParams: payload });
	}

	/**
	 * perform forgot password process
	 *
	 * @param payload
	 */
	public authForgotPassword(payload: AuthForgotInterface) {
		return this._proxyService
			.postAPI(AppServices['authForgotPassword'], { bodyParams: payload });
	}

	/**
	 * perform reset password process
	 *
	 * @param payload
	 */
	public authResetPassword(payload: AuthResetInterface) {
		return this._proxyService
			.postAPI(AppServices['authResetPassword'], { bodyParams: payload });
	}

	/**
	 * authenticate logged-in user
	 */
	public authenticateUser() {
		return this._storageService.get(LocalStorageItems.userState, StorageTypeEnum.PERSISTANT) ||
			this._storageService.get(SessionStorageItems.userState, StorageTypeEnum.SESSION);
	}

	/**
	 * logout user
	 */
	public logoutUser() {
		const userState = this.authenticateUser();
		if (userState) {
			// payload
			const payload = { accessToken: userState.accessToken.jwtToken };

			// call sign-out service
			this._proxyService
				.postAPI(AppServices['authLogout'], { bodyParams: payload })
				.subscribe();

			// clear data
			StorageService.clearAllLocalStorageItems();
			StorageService.clearAllSessionStorageItems();

			// navigate to login
			this._router.navigate([ROUTING.authorization.login]).then();
		}
	}
}
