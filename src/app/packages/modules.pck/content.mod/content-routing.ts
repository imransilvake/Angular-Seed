// angular
import { Routes } from '@angular/router';

// app
import { GuestOffersComponent } from './components/guest-offers/guest-offers.component';
import { GuestPushMessageComponent } from './components/guest-push-message/guest-push-message.component';
import { GuestRepairsComponent } from './components/guest-repairs/guest-repairs.component';

// routes
export const CONTENT_ROUTES: Routes = [
	{
		path: '',
		children: [
			{
				path: 'guest-offers',
				component: GuestOffersComponent,
				data: {
					breadcrumb: {
						en: 'Guest Offers',
						de: 'Gastangebot'
					}
				}
			},
			{
				path: 'guest-push-message',
				component: GuestPushMessageComponent,
				data: {
					breadcrumb: {
						en: 'Guest Push Message',
						de: 'Gast Push Nachricht'
					}
				},
			},
			{
				path: 'guest-repairs',
				component: GuestRepairsComponent,
				data: {
					breadcrumb: {
						en: 'Guest Repairs',
						de: 'Gastreparaturen'
					}
				},
			}
		]
	}
];
