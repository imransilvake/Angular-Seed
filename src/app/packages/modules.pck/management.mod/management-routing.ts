// angular
import { Routes } from '@angular/router';

// app
import { ClientComponent } from './components/client/client.component';
import { UserComponent } from './components/user/user.component';
import { NotificationComponent } from './components/notification/notification.component';

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
				component: NotificationComponent,
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
