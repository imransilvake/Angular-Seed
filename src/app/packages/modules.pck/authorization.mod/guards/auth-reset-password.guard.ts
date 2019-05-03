// angular
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

// app
import { ROUTING } from '../../../../../environments/environment';

@Injectable()
export class AuthResetPasswordGuard implements CanActivate {
	constructor(
		private _router: Router,
		private _activatedRouter: ActivatedRoute
	) {
	}

	/**
	 * validate user for visiting reset password page
	 *
	 * @param route
	 * @param state
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		let userAuthenticated: { [p: string]: any };

		// state
		this._activatedRouter.queryParams.subscribe(() => {
			const currentNavigation = this._router.getCurrentNavigation();
			userAuthenticated = currentNavigation && currentNavigation.extras && currentNavigation.extras.state;
		});

		// user is authenticated
		if (userAuthenticated) {
			return true;
		}

		// navigate to login
		this._router.navigate([ROUTING.authorization.login]).then();

		return false;
	}
}
