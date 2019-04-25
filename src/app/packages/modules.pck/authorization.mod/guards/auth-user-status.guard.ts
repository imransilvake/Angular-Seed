// angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

// app
import { ROUTING } from '../../../../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthUserStatusGuard implements CanActivate {
	public currentUserState;

	constructor(
		private _router: Router,
		private _authService: AuthService
	) {
	}

	/**
	 * validate user status
	 *
	 * @param route
	 * @param state
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		this.currentUserState = this._authService.authenticateUser();
		const authRoutes = [
			ROUTING.authorization.login,
			ROUTING.authorization.reset,
			ROUTING.authorization.forgot,
			ROUTING.authorization.reset
		];
		const currentPath = state.url.substring(1);

		// user is authenticated
		if (this.currentUserState) {
			if (authRoutes.includes(currentPath)) {
				// navigate to dashboard
				this._router.navigate([ROUTING.dashboard]).then();
			}

			return true;
		}

		// user is not authenticated
		if (!authRoutes.includes(currentPath)) {
			// navigate to login
			this._router.navigate([ROUTING.authorization.login]).then();
		}

		return true;
	}
}
