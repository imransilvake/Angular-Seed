// angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

// app
import { ROUTING } from '../../../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { LocalStorageItems, SessionStorageItems } from '../../../../../app.config';
import { StorageTypeEnum } from '../../../core.pck/storage.mod/enums/storage-type.enum';
import { StorageService } from '../../../core.pck/storage.mod/services/storage.service';

@Injectable()
export class AuthUserStatusGuard implements CanActivate, CanActivateChild {
	public currentUserState;
	public authRoutes = [];

	constructor(
		private _router: Router,
		private _authService: AuthService,
		private _storageService: StorageService
	) {
	}

	/**
	 * authenticate public/secure routes on interchange
	 *
	 * @param route
	 * @param state
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		this.currentUserState = this._authService.currentUserState;
		const currentPath = state.url.substring(1);
		this.authRoutes = [
			ROUTING.authorization.register,
			ROUTING.authorization.login,
			ROUTING.authorization.reset,
			ROUTING.authorization.forgot
		];

		// user is authenticated
		if (this.currentUserState) {
			if (this.authRoutes.includes(currentPath)) {
				// navigate to dashboard
				this._router.navigate([ROUTING.dashboard]).then();
			}

			return true;
		}

		// user is not logged-in
		if (!this.authRoutes.includes(currentPath)) {
			// navigate to login
			this._router.navigate([ROUTING.authorization.login]).then();
		}

		return true;
	}

	/**
	 * authenticate all secure routes
	 *
	 * @param route
	 * @param state
	 */
	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		this.currentUserState = this._authService.currentUserState;
		if (this.currentUserState) {
			this._authService.authenticateUser()
				.subscribe((res) => {
					if (res && res.status && res.status !== 'OK') {
						const userPayload = {
							info: this.currentUserState.info,
							details: res,
							rememberMe: this.currentUserState.rememberMe
						};

						if (this.currentUserState.rememberMe) {
							this._storageService.put(LocalStorageItems.userState, userPayload, StorageTypeEnum.PERSISTANT);
						} else {
							this._storageService.put(SessionStorageItems.userState, userPayload, StorageTypeEnum.SESSION);
						}
					}
				});
		} else {
			// navigate to login
			this._router.navigate([ROUTING.authorization.login]).then();
		}

		return true;
	}
}
