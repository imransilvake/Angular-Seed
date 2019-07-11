// angular
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

// app
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AppOptions, AppServices } from '../../../../../app.config';
import { GuestTypeEnum } from '../enums/guest-type.enum';

@Injectable()
export class PushMessageService {
	public currentUser;
	public appState;
	public tableServices;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);
	public errorMessage: EventEmitter<string> = new EventEmitter();

	constructor(private _proxyService: ProxyService) {
	}

	/**
	 * fetch periodic guest notifications
	 *
	 * @param id
	 */
	public guestPeriodicNotificationsFetch(id: number) {
		if (id) {
			return of(null);
		}

		// api
		const api = AppServices['Guest']['Guest_Notifications_Hotel'];

		// payload
		const payload = {
			pathParams: {
				groupId: this.appState.groupId,
				hotelId: this.appState.hotelId
			},
			queryParams: {
				offset: 0,
				limit: AppOptions.tablePageSizeLimit,
				type: GuestTypeEnum.NOTIFICATION,
				column: 'CreateDate',
				sort: 'desc'
			}
		};

		// set table resources
		this.tableServices = {
			api: api,
			payload: payload,
			uniqueID: 'ID',
			sortDefaultColumn: 'CreateDate'
		};

		// service
		return this._proxyService.getAPI(api, payload)
			.pipe(map(res => res));
	}

	/**
	 * fetch recently sent guest notifications
	 *
	 * @param id
	 */
	public guestRecentNotificationsFetch(id: number) {
		if (id) {
			return of(null);
		}

		return of(null);
	}
}
