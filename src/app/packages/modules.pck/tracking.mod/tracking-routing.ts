// angular
import { Routes } from '@angular/router';

// app
import { RealtimeMapComponent } from './components/realtime-map/realtime-map.component';

// routes
export const TACKING_ROUTES: Routes = [
	{
		path: '',
		children: [
			{
				path: 'map',
				component: RealtimeMapComponent,
				data: {
					breadcrumb: {
						en: 'Realtime Overview'
					}
				}
			}
		]
	}
];
