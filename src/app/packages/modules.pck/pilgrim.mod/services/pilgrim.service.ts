// angular
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Injectable()
export class PilgrimService {
	public currentUser;
	public appState;
	public tableServices;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);

	/**
	 * fetch pilgrim data
	 */
	public fetchPilgrimData() {
		return of(null);
	}
}
