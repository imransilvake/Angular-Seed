// angular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// app
import { ClientViewInterface } from '../../../../interfaces/client-view.interface';
import { ClientViewTypeEnum } from '../../../../enums/client-view-type.enum';
import { ClientService } from '../../../../services/client.service';

@Component({
	selector: 'app-hotel-guest-app',
	templateUrl: './hotel-guest-app.component.html',
	styleUrls: ['./hotel-guest-app.component.scss']
})

export class HotelGuestAppComponent implements OnInit {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

	public licenseActive = true;
	public modulesList = [];

	constructor(private _clientService: ClientService) {
	}

	ngOnInit() {
		// get HGA modules
		this.modulesList = this._clientService.getHotelGuestAppModules();
	}

	/**
	 * close client form
	 */
	public onClickCloseClientForm() {
		const payload: ClientViewInterface = {
			view: ClientViewTypeEnum.DEFAULT
		};
		this.changeClientView.emit(payload);
	}
}
