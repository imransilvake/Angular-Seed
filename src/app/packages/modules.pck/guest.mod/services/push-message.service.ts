// angular
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
// app
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AppOptions, AppServices } from '../../../../../app.config';
import { GuestTypeEnum } from '../enums/guest-type.enum';
import { GuestNotificationTypeEnum } from '../enums/guest-notification-type.enum';

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
	 * fetch periodic / recently sent guest notifications
	 *
	 * @param id
	 * @param type
	 */
	public guestNotificationsFetch(id: number, type: GuestNotificationTypeEnum) {
		if (id) {
			return of(null);
		}

		// api
		const api = AppServices['Guest']['Guest_Notifications_Hotel'];

		// payload
		let payload: any = {
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

		switch (type) {
			case GuestNotificationTypeEnum.PERIODIC:
				// set table resources
				this.tableServices = {
					...this.tableServices,
					periodic : {
						api: api,
						payload: payload,
						uniqueID: 'ID',
						sortDefaultColumn: 'CreateDate'
					}
				};
				break;
			case GuestNotificationTypeEnum.RECENT:
				payload = {
					...payload,
					queryParams: {
						...payload.queryParams,
						trigger: 'ADHOC'
					}
				};

				// set table resources
				this.tableServices = {
					...this.tableServices,
					recent : {
						api: api,
						payload: payload,
						uniqueID: 'ID',
						sortDefaultColumn: 'SendDate'
					}
				};
				break;
		}

		// service
		return this._proxyService.getAPI(api, payload)
			.pipe(map(res => res));
	}
}
