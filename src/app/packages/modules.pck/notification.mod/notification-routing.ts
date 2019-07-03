// angular
import { Routes } from '@angular/router';

// app
import { NotificationListComponent } from './components/notification-list.component';

export const NOTIFICATION_ROUTES: Routes = [
	{
		path: '',
		children: [
			{
				path: 'overview',
				component: NotificationListComponent,
				data: {
					breadcrumb: {
						en: 'Notification',
						de: 'Benachrichtigung'
					}
				}
			}
		]
	}
];
