// angular
import { EventEmitter, Injectable } from '@angular/core';

// app
import TableData from '../../../../../assets/dummy/table-data';
import { AppServices } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';

@Injectable()
export class ClientService {
	public currentUser;
	public clientData: EventEmitter<any> = new EventEmitter();

	constructor(private _proxyService: ProxyService) {
	}

	/**
	 * fetch client hotels
	 */
	public fetchClientHotelsList() {
		// todo: remove setTimeout
		setTimeout(() => {
			this.clientData.emit({ hotelsList: TableData });
		});
	}

	/**
	 * fetch country list
	 */
	public fetchCountryList() {
		const payload = {
			language: this.currentUser.profile.language
		};
		return this._proxyService.getAPI(AppServices['Utilities']['CountryList'], { queryParams: payload });
	}
}
