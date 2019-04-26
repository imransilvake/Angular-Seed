// angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

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
		this.currentUserState = this._authService.authenticateUser();
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
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		const currentPath = state.url.substring(1);

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


		console.log('aa');


		return true;
	}
}
