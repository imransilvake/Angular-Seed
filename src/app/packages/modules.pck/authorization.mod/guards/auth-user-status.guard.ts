// angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

// app
import { ROUTING } from '../../../../../environments/environment';
import { StorageService } from '../../../core.pck/storage.mod/services/storage.service';
import { localStorageItems, sessionStorageItems } from '../../../../../app.config';
import { StorageTypeEnum } from '../../../core.pck/storage.mod/enums/storage-type.enum';

@Injectable()
export class AuthUserStatusGuard implements CanActivate {
	constructor(
		private _router: Router,
		private _storageService: StorageService
	) {
	}

	/**
	 * validate user status
	 *
	 * @param route
	 * @param state
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		const userStatus =
			this._storageService.get(localStorageItems.userState, StorageTypeEnum.PERSISTANT) ||
			this._storageService.get(sessionStorageItems.userState, StorageTypeEnum.SESSION);
		const authRoutes = Object.values(ROUTING.authorization);
		const currentPath = state.url.substring(1);

		// user is authenticated
		if (userStatus) {
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
