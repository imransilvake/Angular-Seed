// angular
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

@Injectable()
export class GroupService {
	public currentUser;
	public appState;
	public tableServices;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);

	/**
	 * fetch group data
	 */
	public fetchGroupData() {
		return of(null);
	}
}
