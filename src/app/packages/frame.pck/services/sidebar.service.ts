// angular
import { Injectable } from '@angular/core';

// app
import { SidebarInterface } from '../interfaces/sidebar.interface';
import { faHome, faUser, faUserTag, faBell } from '@fortawesome/free-solid-svg-icons';
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
				url: `/${ROUTING.dashboard}`
			},
			{
				section: 'Management',
				name: 'User',
				icon: faUser,
				url: `/${ROUTING.management.user}`
			},
			{
				name: 'Client',
				icon: faUserTag,
				url: `/${ROUTING.management.client}`
			},
			{
				name: 'Notifications',
				icon: faBell,
				url: `/${ROUTING.management.notification}`
			}
		];

		return sidebarMenuList;
	}
}
