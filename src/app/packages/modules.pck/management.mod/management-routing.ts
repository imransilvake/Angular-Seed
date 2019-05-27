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
						en: 'Client',
						de: 'Klient'
					}
				}
			},
			{
				path: 'client',
				component: ClientComponent,
				data: {
					breadcrumb: {
						en: 'Client',
						de: 'Klient'
					}
				},
			},
			{
				path: 'notification',
				component: SystemNotificationComponent,
				data: {
					breadcrumb: {
						en: 'Client',
						de: 'Klient'
					}
				},
			}
		]
	}
];
