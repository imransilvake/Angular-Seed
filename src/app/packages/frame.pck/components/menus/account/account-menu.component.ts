// angular
import { Component } from '@angular/core';

// app
import { HelperService } from '../../../../utilities.pck/accessories.mod/services/helper.service';
import { faAlignRight, faEnvelope, faPowerOff, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-menu-account',
	templateUrl: './account-menu.component.html'
})

export class AccountMenuComponent {
	public faIcons = [faEnvelope, faUser, faPowerOff, faAlignRight];

	constructor(private _helperService: HelperService) {
	}

	/**
	 * stop propagation
	 * @param event
	 */
	public onClickStopPropagation(event) {
		this._helperService.stopPropagation();
	}
}
