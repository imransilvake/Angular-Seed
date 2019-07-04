// angular
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

// store
import { Store } from '@ngrx/store';

// app
import * as NotificationActions from '../../utilities.pck/notification.mod/store/actions/notification.actions';
import { NotificationPayloadInterface } from '../../utilities.pck/notification.mod/interfaces/notification-payload.interface';
import { NotificationInterface } from '../../utilities.pck/notification.mod/interfaces/notification.interface';
import { EmergencyInterface } from '../interfaces/emergency.interface';

@Injectable()
export class EmergencyService {
	constructor(private _store: Store<{ NotificationInterface: NotificationInterface }>) {
	}

	/**
	 * get emergency state
	 */
	public getEmergencyState() {
		// close id
		const closeId = 'ham-EME-01';

		// notification
		const notificationPayload: NotificationPayloadInterface = {
			text: 'Emergency Call: Mr Peter Meier (room 202)',
			keepAfterNavigationChange: true,
			hideCloseButton: true,
			closeId: closeId
		};
		// this._store.dispatch(new NotificationActions.NotificationWarning(notificationPayload));

		// payload
		const emergencyPayload: EmergencyInterface = {
			status: false,
			closeId: closeId
		};

		return of(emergencyPayload);
	}

	/**
	 * remove emergency notification
	 *
	 * @param closeId
	 */
	public removeEmergencyNotification(closeId: string) {
		this._store.dispatch(new NotificationActions.NotificationClose({closeId: closeId}));
	}
}
