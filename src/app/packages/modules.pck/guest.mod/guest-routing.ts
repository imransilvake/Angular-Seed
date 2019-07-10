// angular
import { Routes } from '@angular/router';

// app
import { OfferListComponent } from './components/offer/list/offer-list.component';

// routes
export const GUEST_ROUTES: Routes = [
	{
		path: '',
		children: [
			{
				path: 'offer',
				component: OfferListComponent,
				data: {
					breadcrumb: {
						en: 'Guest Offer',
						de: 'Gastangebot'
					}
				}
			},
			{
				path: 'push-message',
				component: null,
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
