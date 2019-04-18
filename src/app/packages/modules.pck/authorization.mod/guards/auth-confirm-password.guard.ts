// angular
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

// app
import { ROUTING } from '../../../../../environments/environment';

@Injectable()
export class AuthConfirmPasswordGuard implements CanActivate {
	constructor(
		private _router: Router,
		private _activatedRouter: ActivatedRoute
	) {
	}

	/**
	 * validate user for visiting confirmation page
	 *
	 * @param route
	 * @param state
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		let userStatus: { [p: string]: any };

		// state
		this._activatedRouter.queryParams.subscribe(() => {
			const currentNavigation = this._router.getCurrentNavigation();
			userStatus = currentNavigation && currentNavigation.extras && currentNavigation.extras.state;
		});

		// user is authenticated
		if (userStatus) {
			return true;
		}

		// navigate to login
		this._router.navigate([ROUTING.authorization.login]).then();

		return false;
	}
}
