// angular
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Injectable()
export class GuestOfferService {
	public currentUser;
	public appState;
	public tableServices;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);

	constructor() {
	}

	/**
	 * fetch active hotel offers
	 *
	 * @param id
	 */
	public guestHotelOffersFetch(id: number) {
		return of(null);
	}
}
