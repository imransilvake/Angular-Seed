// angular
import { Routes } from '@angular/router';

// app
import { ClientComponent } from './client/client.component';
import { UserComponent } from './user/user.component';
import { SystemNotificationComponent } from './system-notification/system-notification.component';

export const MANAGEMENT_ROUTES: Routes = [
	{
		path: '',
		children: [
			{
				path: 'user',
				component: UserComponent,
				data: {
					breadcrumb: {
						en: 'User Management',
						de: 'Benutzerverwaltung'
					}
				}
			},
			{
				path: 'client',
				component: ClientComponent,
				data: {
					breadcrumb: {
						en: 'Client Management',
						de: 'Klient-Management'
					}
				},
			},
			{
				path: 'notification',
				component: SystemNotificationComponent,
				data: {
					breadcrumb: {
						en: 'System Notification',
						de: 'Systembenachrichtigung'
					}
				},
			}
		]
	}
];
