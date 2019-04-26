// angular
import { Injectable } from '@angular/core';

// app
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AppServices } from '../../../../../app.config';

@Injectable()
export class HotelListService {
	constructor(private _proxyService: ProxyService) {
	}

	/**
	 * set of all hotels
	 */
	public getHotelList() {
		return this._proxyService.getAPI(AppServices['Utilities']['HotelList']);
	}
}
