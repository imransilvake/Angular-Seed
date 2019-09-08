// angular
import { Routes } from '@angular/router';

// app
import { TrackingComponent } from './components/tracking.component';

// routes
export const TACKING_ROUTES: Routes = [
	{
		path: '',
		children: [
			{
				path: 'map',
				component: TrackingComponent,
				data: {
					breadcrumb: {
						en: 'Realtime Overview'
					}
				}
			}
		]
	}
];
