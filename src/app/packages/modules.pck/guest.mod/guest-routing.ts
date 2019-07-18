// angular
import { Routes } from '@angular/router';

// app
import { OffersComponent } from './components/offers/offers.component';
import { PushMessageComponent } from './components/push-message/push-message.component';

// routes
export const GUEST_ROUTES: Routes = [
	{
		path: '',
		children: [
			{
				path: 'offers',
				component: OffersComponent,
				data: {
					breadcrumb: {
						en: 'Guest Offer',
						de: 'Gastangebot'
					}
				}
			},
			{
				path: 'push-message',
				component: PushMessageComponent,
				data: {
					breadcrumb: {
						en: 'Guest Push Message',
						de: 'Gast Push Nachricht'
					}
				},
			}
		]
	}
];
