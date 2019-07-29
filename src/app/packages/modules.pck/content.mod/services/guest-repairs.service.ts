// angular
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Injectable()
export class GuestRepairsService {
	public currentUser;
	public appState;
	public tableServices;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);

	/**
	 * fetch guest repair categories
	 *
	 * @param id
	 */
	public guestRepairsFetch(id: number) {
		if (id) {
			return of(null);
		}

		return of(null);
	}
}
