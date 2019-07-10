// angular
import { Routes } from '@angular/router';

// app
import { OfferComponent } from './components/offer/offer.component';
import { PushMessageComponent } from './components/push-message/push-message.component';

// routes
export const GUEST_ROUTES: Routes = [
	{
		path: '',
		children: [
			{
				path: 'offer',
				component: OfferComponent,
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
