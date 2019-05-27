// angular
import { Injectable } from '@angular/core';

// app
import { SidebarInterface } from '../interfaces/sidebar.interface';
import { faHome, faDatabase, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { ROUTING } from '../../../../environments/environment';

@Injectable()
export class SidebarService {
	/**
	 * fetch sidebar menu list
	 */
	public getSidebarMenuList() {
		const sidebarMenuList: SidebarInterface[] = [
			{
				name: 'Dashboard',
				icon: faHome,
				children: [
					{
						name: 'Home',
						url: `/${ROUTING.dashboard}`,
					}
				]
			},
			{
				name: 'Management',
				icon: faDatabase,
				children: [
					{
						name: 'User',
						url: `/${ROUTING.management.routes.user}`,
						externalIcon: faExternalLinkAlt
					},
					{
						name: 'Client',
						url: `/${ROUTING.management.routes.client}`,
						externalIcon: faExternalLinkAlt
					},
					{
						name: 'Notifications',
						url: `/${ROUTING.management.routes.notification}`,
						externalIcon: faExternalLinkAlt
					}
				]
			}
		];

		return sidebarMenuList;
	}
}
