// angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// app
import { ROUTING } from '../../../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../../../core.pck/storage.mod/services/storage.service';
import { LocalStorageItems } from '../../../../../app.config';
import { StorageTypeEnum } from '../../../core.pck/storage.mod/enums/storage-type.enum';

@Injectable()
export class AuthUserStatusGuard implements CanActivate, CanActivateChild {
	public currentUserState;
	public authRoutes = [];

	constructor(
		private _router: Router,
		private _authService: AuthService,
		private _storageService: StorageService
	) {
		this.authRoutes = [
			ROUTING.authorization.register,
			ROUTING.authorization.login,
			ROUTING.authorization.reset,
			ROUTING.authorization.forgot
		];
	}

	/**
	 * authenticate public/secure routes on interchange
	 *
	 * @param route
	 * @param state
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		const currentPath = state.url.substring(1);

		// validate lock screen
		if (this._storageService.get(LocalStorageItems.lockState, StorageTypeEnum.PERSISTANT)) {
			if (currentPath !== ROUTING.authorization.lock) {
				// navigate to lock
				this._router.navigate([ROUTING.authorization.lock]).then();
			}
		}

		return this._authService.authenticateUser()
			.pipe(
				map(res => {
					if (res.status) {
						switch (res.status) {
							case 'OK':
								if (this.authRoutes.includes(currentPath)) {
									// navigate to dashboard
									this._router.navigate([ROUTING.dashboard]).then();
								}
								break;
							case 'FAIL':
								if (!this.authRoutes.includes(currentPath)) {
									// navigate to login
									this._router.navigate([ROUTING.authorization.login]).then();
								}
								break;
						}
					} else {
						// set current user state
						const data = this._authService.currentUserState;
						this._authService.currentUserState = {
							profile: data.profile,
							credentials: res,
							rememberMe: data.rememberMe
						};
					}

					return true;
				})
			);
	}

	/**
	 * authenticate all secure routes
	 *
	 * @param route
	 * @param state
	 */
	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this._authService.authenticateUser()
			.pipe(
				map(res => {
					if (res.status) {
						if (res.status === 'FAIL') {
							// navigate to login
							this._router.navigate([ROUTING.authorization.login]).then();
						}
					} else {
						// set current user state
						const data = this._authService.currentUserState;
						this._authService.currentUserState = {
							profile: data.profile,
							credentials: res,
							rememberMe: data.rememberMe
						};
					}

					return true;
				})
			);
	}
}
