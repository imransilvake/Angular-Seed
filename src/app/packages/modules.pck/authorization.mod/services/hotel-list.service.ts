// angular
import { Injectable } from '@angular/core';

// app
import { SelectDefaultInterface } from '../../../core.pck/fields.mod/interfaces/select-default-interface';

@Injectable()
export class HotelListService {
	/**
	 * fetch hotel list
	 */
	public getHotelList() {
		const hotelList: SelectDefaultInterface[] = [
			{ value: `aachen`, viewValue: 'Hotel - Aachen' },
			{ value: `bonn`, viewValue: 'Hotel - Bonn' },
			{ value: `cologne`, viewValue: 'Hotel - Cologne' },
			{ value: `düsseldorf`, viewValue: 'Hotel - Düsseldorf' }
		];

		return hotelList;
	}
}
