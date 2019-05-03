// angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// app
import { HelperService } from '../../../../utilities.pck/accessories.mod/services/helper.service';
import { faEnvelope, faPowerOff, faUser, faUserLock } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../modules.pck/authorization.mod/services/auth.service';
import { ROUTING } from '../../../../../../environments/environment';

@Component({
	selector: 'app-menu-account',
	templateUrl: './account-menu.component.html'
})

export class AccountMenuComponent {
	public faIcons = [faEnvelope, faUser, faUserLock, faPowerOff];
	public currentUser;

	constructor(
		private _authService: AuthService,
		private _router: Router
	) {
		// get current user info
		this.currentUser = _authService.currentUserState;
	}

	/**
	 * stop propagation
	 * @param event
	 */
	public onClickStopPropagation(event) {
		HelperService.stopPropagation();
	}

	/**
	 * lock user screen
	 */
	public onClickLockScreen() {
		// navigate to lock
		this._router.navigate([ROUTING.authorization.lock]).then();
	}

	/**
	 * logout user
	 */
	public onClickLogout() {
		this._authService.logoutUser();
	}
}
