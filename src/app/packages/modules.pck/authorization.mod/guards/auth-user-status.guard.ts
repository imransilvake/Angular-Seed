// angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

// app
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthUserStatusGuard implements CanActivate, CanActivateChild {
	constructor(private _authService: AuthService) {
	}

	/**
	 * authenticate public/secure routes on interchange
	 *
	 * @param route
	 * @param state
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		console.log(this._authService.authValidation(state));
		return this._authService.authValidation(state);
	}

	/**
	 * authenticate all secure routes
	 *
	 * @param route
	 * @param state
	 */
	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return this._authService.authValidation(state);
	}
}
