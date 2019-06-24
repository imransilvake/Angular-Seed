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
	public appState;
	public userTablesServices;
	public userDataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);
	public errorMessage: EventEmitter<string> = new EventEmitter();

	constructor(
		private _proxyService: ProxyService
	) {
	}

	/**
	 * fetch new user registrations
	 *
	 * @param id
	 */
	public userFetchNewRegistrations(id: string) {
		const allApi = AppServices['Management']['User_Default_List'];
		const hotelGroupApi = AppServices['Management']['User_Default_List_Hotel_Group'];
		const hotelApi = AppServices['Management']['User_Default_List_Hotel'];
		const payload = {
			offset: 0,
			limit: AppOptions.tablePageSizeLimit,
			state: 'APPLIED'
		};

		// validate app state
		if (this.appState || !id) {
			let api;
			switch (this.appState.type) {
				case AppStateEnum.ALL:
					// set table api
					this.userTablesServices = { ...this.userTablesServices, newUsers: allApi };

					// set api
					api = allApi;
					break;
				case AppStateEnum.GROUP:
					// set table api
					this.userTablesServices = { ...this.userTablesServices, newUsers: hotelGroupApi };

					// set api
					api = hotelGroupApi;
					break;
				case AppStateEnum.HOTEL:
					// set table api
					this.userTablesServices = { ...this.userTablesServices, newUsers: hotelApi };

					// set api
					api = hotelApi;
					break;
			}

			// service
			return this._proxyService
				.getAPI(api, { queryParams: payload })
				.pipe(map(res => res));
		} else {
			return of(null);
		}
	}

	/**
	 * fetch existing user accounts
	 */
	public userFetchExistingAccounts() {
		// set table api
		const allApi = AppServices['Management']['Client_Default_List'];
		this.userTablesServices = { ...this.userTablesServices, existingUsers: allApi };

		// return data
		return of(
			{
				data: [
					{
						Id: 1,
						Image: 'assets/svg/logo_powered_by.svg',
						Name: 'Imran Khan',
						Email: 'imransilvake@gmail.com',
						'Last Login': '12/12/2018',
						Creator: 'imransilvake',
						'Role': 'HOTEL MANAGER',
						'Hotels': 'Bonn'
					},
					{
						Id: 2,
						Image: 'assets/svg/logo_powered_by.svg',
						Name: 'Harry Potter',
						Email: 'harry@gmail.com',
						'Last Login': '11/01/2019',
						Creator: 'imransilvake',
						'Role': 'GROUP MANAGER',
						'Hotels': 'Aachen'
					},
					{
						Id: 3,
						Image: 'assets/svg/logo_powered_by.svg',
						Name: 'Aylan Case',
						Email: 'case@gmail.com',
						'Last Login': '15/03/2019',
						Creator: 'imransilvake',
						'Role': 'ADMIN',
						'Hotels': 'Düsseldorf'
					}
				]
			}
		);
	}
}
