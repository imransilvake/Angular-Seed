// angular
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

// app
import { AppOptions, AppServices } from '../../../../../app.config';
import { AppStateEnum } from '../../../frame.pck/enums/app-state.enum';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';

@Injectable()
export class UserService {
	public currentUser;
	public appState;
	public userTablesServices;
	public userDataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);
	public errorMessage: EventEmitter<string> = new EventEmitter();

	constructor(
		private _proxyService: ProxyService
	) {
	}

	/**
	 * fetch new/existing users
	 *
	 * @param id
	 * @param userListType
	 */
	public userFetchList(id: string, userListType: string) {
		const allApi = AppServices['Management']['User_Default_List'];
		const hotelGroupApi = AppServices['Management']['User_Default_List_Hotel_Group'];
		const hotelApi = AppServices['Management']['User_Default_List_Hotel'];
		const queryParamsPayload = {
			offset: 0,
			limit: AppOptions.tablePageSizeLimit,
			state: userListType
		};

		// validate app state
		if (this.appState || !id) {
			let payload = {};
			let api;
			switch (this.appState.type) {
				case AppStateEnum.ALL:
					// set table api
					this.userTablesServices = { ...this.userTablesServices, newUsers: allApi };

					// set api
					api = allApi;

					// set payload
					payload = {
						queryParams: queryParamsPayload
					};
					break;
				case AppStateEnum.GROUP:
					// set table api
					this.userTablesServices = { ...this.userTablesServices, newUsers: hotelGroupApi };

					// set api
					api = hotelGroupApi;

					// set payload
					payload = {
						pathParams: {
							groupId: this.appState && this.appState.groupId
						},
						queryParams: queryParamsPayload
					};
					break;
				case AppStateEnum.HOTEL:
					// set table api
					this.userTablesServices = { ...this.userTablesServices, newUsers: hotelApi };

					// set api
					api = hotelApi;

					// set payload
					payload = {
						pathParams: {
							groupId: this.appState && this.appState.groupId,
							hotelId: this.appState && this.appState.hotelId
						},
						queryParams: queryParamsPayload
					};
					break;
			}

			// service
			return this._proxyService
				.getAPI(api, payload)
				.pipe(map(res => res));
		} else {
			return of(null);
		}
	}
}
