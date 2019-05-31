// angular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// app
import { ClientViewInterface } from '../../../../interfaces/client-view.interface';
import { ClientViewTypeEnum } from '../../../../enums/client-view-type.enum';
import { ClientHgaService } from '../../../../services/client-hga.service';

@Component({
	selector: 'app-hotel-guest-app',
	templateUrl: './hotel-guest-app.component.html',
	styleUrls: ['./hotel-guest-app.component.scss']
})

export class HotelGuestAppComponent implements OnInit {
	@Output() changeClientView: EventEmitter<any> = new EventEmitter();

	public licenseActive = true;
	public modulesList = [];

	constructor(private _clientHGAService: ClientHgaService) {
	}

	ngOnInit() {
		this.modulesList = this._clientHGAService.fetchHGAModules();
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
