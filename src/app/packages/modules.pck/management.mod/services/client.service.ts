// angular
import { EventEmitter, Injectable } from '@angular/core';

// app
import TableData from '../../../../../assets/dummy/table-data';

@Injectable()
export class ClientService {
	public clientData: EventEmitter<any> = new EventEmitter();
	public data = TableData;

	/**
	 * fetch client hotels
	 */
	public fetchClientHotelsList() {
		// todo: remove setTimeout
		setTimeout(() => {
			this.clientData.emit({ hotelsList: this.data });
		});
	}
}
