// angular
import { Component } from '@angular/core';

// app
import { HelperService } from '../../../../utilities.pck/accessories.mod/services/helper.service';

@Component({
	selector: 'app-menu-notification',
	templateUrl: './notification-menu.component.html',
	styleUrls: ['./notification-menu.component.scss']
})

export class NotificationMenuComponent {
	constructor() {
	}

	/**
	 * stop propagation
	 * @param event
	 */
	public onClickStopPropagation(event) {
		HelperService.stopPropagation();
	}
}
