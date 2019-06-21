// angular
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

// app
import { AppServices } from '../../../../../app.config';

@Injectable()
export class UserService {
	public appState;
	public userTablesServices;
	public userDataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);
	public errorMessage: EventEmitter<string> = new EventEmitter();

	constructor() {
	}

	/**
	 * fetch new user registrations
	 */
	public userFetchNewRegistrations() {
		// set table api
		const allApi = AppServices['Management']['Client_Default_List'];
		this.userTablesServices = { ...this.userTablesServices, newUsers: allApi };

		// return data
		return of(
			{
				data: [
					{
						Id: 1,
						Photo: 'assets/svg/logo_powered_by.svg',
						Name: 'Imran Khan',
						Email: 'imransilvake@gmail.com',
						'Reg. Date': '12/12/2018',
						'Role': 'HOTEL MANAGER',
						'Hotels': 'Bonn'
					},
					{
						Id: 2,
						Photo: 'assets/svg/logo_powered_by.svg',
						Name: 'Harry Potter',
						Email: 'harry@gmail.com',
						'Reg. Date': '11/01/2019',
						'Role': 'GROUP MANAGER',
						'Hotels': 'Aachen'
					},
					{
						Id: 3,
						Photo: 'assets/svg/logo_powered_by.svg',
						Name: 'Aylan Case',
						Email: 'case@gmail.com',
						'Reg. Date': '15/03/2019',
						'Role': 'ADMIN',
						'Hotels': 'Düsseldorf'
					}
				]
			}
		);
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
						Photo: 'assets/svg/logo_powered_by.svg',
						Name: 'Imran Khan',
						Email: 'imransilvake@gmail.com',
						'Last Login': '12/12/2018',
						Creator: 'imransilvake',
						'Role': 'HOTEL MANAGER',
						'Hotels': 'Bonn'
					},
					{
						Id: 2,
						Photo: 'assets/svg/logo_powered_by.svg',
						Name: 'Harry Potter',
						Email: 'harry@gmail.com',
						'Last Login': '11/01/2019',
						Creator: 'imransilvake',
						'Role': 'GROUP MANAGER',
						'Hotels': 'Aachen'
					},
					{
						Id: 3,
						Photo: 'assets/svg/logo_powered_by.svg',
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
