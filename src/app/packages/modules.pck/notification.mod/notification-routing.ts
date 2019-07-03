// angular
import { Routes } from '@angular/router';

// app
import { NotificationComponent } from './components/notification.component';

export const NOTIFICATION_ROUTES: Routes = [
	{
		path: '',
		children: [
			{
				path: 'overview',
				component: NotificationComponent,
				data: {
					breadcrumb: {
						en: 'Notifications',
						de: 'Benachrichtigungen'
					}
				}
			}
		]
	}
];
