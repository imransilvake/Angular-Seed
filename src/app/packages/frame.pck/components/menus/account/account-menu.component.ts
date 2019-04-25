// angular
import { Component } from '@angular/core';

// app
import { HelperService } from '../../../../utilities.pck/accessories.mod/services/helper.service';
import { faAlignRight, faEnvelope, faPowerOff, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../modules.pck/authorization.mod/services/auth.service';

@Component({
	selector: 'app-menu-account',
	templateUrl: './account-menu.component.html'
})

export class AccountMenuComponent {
	public faIcons = [faEnvelope, faUser, faPowerOff, faAlignRight];

	constructor(private _authService: AuthService) {
	}

	/**
	 * stop propagation
	 * @param event
	 */
	public onClickStopPropagation(event) {
		HelperService.stopPropagation();
	}

	/**
	 * logout user
	 */
	public onClickLogout() {
		this._authService.logoutUser();
	}
}
