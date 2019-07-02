// angular
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

// app
import { AppOptions, AppServices } from '../../../../../app.config';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';

@Injectable()
export class BroadcastService {
	public currentUser;
	public appState;
	public broadcastTablesServices;
	public broadcastDataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);

	constructor(private _proxyService: ProxyService) {
	}

	/**
	 * fetch broadcast list
	 */
	public broadcastFetchList(id: string) {
		const api = AppServices['Management']['Broadcast_Default_List_All'];
		const queryParamsPayload = {
			offset: 0,
			limit: AppOptions.tablePageSizeLimit,
			column: 'SendDate',
			sort: 'desc'
		};

		// validate app state
		if (!id) {
			const payload = {
				queryParams: queryParamsPayload
			};

			// set table resources
			this.broadcastTablesServices = {
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
