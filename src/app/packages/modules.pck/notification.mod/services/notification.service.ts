// angular
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

// app
import { AppOptions, AppServices } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AppStateEnum } from '../../../frame.pck/enums/app-state.enum';

@Injectable()
export class NotificationService {
	public currentUser;
	public appState;
	public notificationTablesServices;
	public notificationDataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);
	public errorMessage: EventEmitter<string> = new EventEmitter();

	constructor(private _proxyService: ProxyService) {
	}

	/**
	 * fetch notification list
	 */
	public notificationFetchList() {
		// validate app state
		if (this.appState.type === AppStateEnum.HOTEL) {
			const api = AppServices['Notifications']['Notifications_List_Hotel'];
			const queryParamsPayload = {
				offset: 0,
				limit: AppOptions.tablePageSizeLimit,
				user: this.currentUser.profile.email,
				type: 'ALL',
				date: '07/04/2019'
			};

			const payload = {
				pathParams: {
					groupId: this.appState.groupId,
					hotelId: this.appState.hotelId
				},
				queryParams: queryParamsPayload
			};

			// set table resources
			this.notificationTablesServices = {
				api: api,
				payload: payload,
				uniqueID: 'Id'
			};

			// service
			return this._proxyService
				.getAPI(api, payload)
				.pipe(map(res => res));
		} else {
			return of(null);
		}
	}
}
