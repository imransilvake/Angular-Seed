// angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// app
import { ROUTING } from '../../../../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthUserStatusGuard implements CanActivate, CanActivateChild {
	public currentUserState;
	public authRoutes = [];

	constructor(
		private _router: Router,
		private _authService: AuthService
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
		return this._authService.authenticateUser()
			.pipe(
				map(res => {
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
		const currentPath = state.url.substring(1);
		return this._authService.authenticateUser()
			.pipe(
				map(res => {
					switch (res.status) {
						case 'FAIL':
							if (!this.authRoutes.includes(currentPath)) {
								// navigate to login
								this._router.navigate([ROUTING.authorization.login]).then();
							}
							break;
						case !'OK':
							// set current user state
							this._authService.currentUserState = {
								profile: this.currentUserState.profile,
								credentials: res,
								rememberMe: this.currentUserState.rememberMe
							};
							break;
					}

					return true;
				})
			);
	}
}
