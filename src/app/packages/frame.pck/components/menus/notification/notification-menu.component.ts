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
