// angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

// app
import { ROUTING } from '../../../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { HelperService } from '../../../utilities.pck/accessories.mod/services/helper.service';

@Injectable()
export class AuthUserStatusGuard implements CanActivate, CanActivateChild {
	public currentUserState;
	public authRoutes = [];

	constructor(
		private _router: Router,
		private _authService: AuthService
	) {
		this.authRoutes = [
			ROUTING.authorization.routes.register,
			ROUTING.authorization.routes.login,
			ROUTING.authorization.routes.reset,
			ROUTING.authorization.routes.forgot
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
		return this._authService.authenticateUser()
			.pipe(
				map(res => {
					if (res.status) {
						switch (res.status) {
							case 'OK':
								if (this.authRoutes.includes(currentPath)) {
									// navigate to dashboard
									this._router.navigate([ROUTING.pages.dashboard]).then();
								}
								break;
							case 'FAIL':
								const path = currentPath.split('?');
								if (!this.authRoutes.includes(path[0]) || currentPath === ROUTING.authorization.routes.reset && !path[1]) {
									// logout user
									this._authService.logoutUser();
								}
								break;
						}
					} else {
						// get current user state
						const data = this._authService.currentUserState;
						const userInfo = HelperService.decodeJWTToken(res.idToken);

						// set current user state
						this.setUserState(userInfo, res, data);
					}
					return true;
				}),
				catchError(() => {
					this._authService.clearSessions();
					return of(true);
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
				distinctUntilChanged(),
				map(res => {
					if (res.status) {
						if (res.status === 'FAIL') {
							// logout user
							this._authService.logoutUser();
						}
					} else {
						// get current user state
						const data = this._authService.currentUserState;
						const userInfo = HelperService.decodeJWTToken(res.idToken);

						// set current user state
						this.setUserState(userInfo, res, data);
					}
					return true;
				}),
				catchError(() => {
					this._authService.clearSessions();
					return of(true);
				})
			);
	}

	/**
	 * set current user state
	 *
	 * @param userInfo
	 * @param credentials
	 * @param data
	 */
	private setUserState(userInfo: any, credentials: any, data: any) {
		this._authService.currentUserState = {
			profile: {
				...userInfo,
				password: data.profile.password,
				language: data.profile.language,
				image: data.profile.image
			},
			credentials: credentials,
			rememberMe: data.rememberMe,
			timestamp: data.timestamp
		};
	}
}
