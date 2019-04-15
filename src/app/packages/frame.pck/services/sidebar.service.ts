// angular
import { Injectable } from '@angular/core';

// app
import { SidebarInterface } from '../interfaces/sidebar.interface';
import { faAirFreshener, faHome, faSadCry } from '@fortawesome/free-solid-svg-icons';
import { ROUTING } from '../../../../environments/environment';

@Injectable()
export class SidebarService {
	/**
	 * fetch sidebar menu list
	 */
	public getSidebarMenuList() {
		const sidebarMenuList: SidebarInterface[] = [
			{
				section: 'Dashboard',
				name: 'Home',
				icon: faHome,
				url: ROUTING.dashboard
			},
			{
				section: 'Modules',
				name: 'Fruit 1',
				icon: faSadCry,
				children: [
					{ name: 'Apple', url: '/dummy1' },
					{ name: 'Banana', url: '/dummy2' },
					{ name: 'Fruit loops', url: '/dummy3' }
				]
			},
			{
				name: 'Fruit 2',
				icon: faAirFreshener,
				children: [
					{ name: 'Apple', url: '/dummy4' },
					{
						name: 'Banana',
						icon: faAirFreshener,
						children: [
							{ name: 'Apple', url: '/dummy5' },
							{
								name: 'Banana',

								icon: faAirFreshener,
								children: [
									{ name: 'Apple', url: '/dummy6' },
									{ name: 'Banana', url: '/dummy7' },
									{ name: 'Fruit loops', url: '/dummy8' }
								],

								url: '/dummy2'
							},
							{ name: 'Fruit loops', url: '/dummy9' }
						],
						url: '/dummy2'
					},
					{ name: 'Fruit loops', url: '/dummy10' }
				]
			},
			{
				name: 'Fruit 3',
				icon: faSadCry,
				children: [
					{ name: 'Apple', url: '/dummy11' },
					{ name: 'Banana', url: '/dummy12' },
					{ name: 'Fruit loops', url: '/dummy13' }
				]
			}
		];

		return sidebarMenuList;
	}
}
