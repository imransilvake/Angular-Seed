// angular
import { Routes } from '@angular/router';

// app
import { PilgrimComponent } from './components/pilgrim.component';

// routes
export const PILGRIM_ROUTES: Routes = [
	{
		path: '',
		children: [
			{
				path: 'overview',
				component: PilgrimComponent,
				data: {
					breadcrumb: {
						en: 'Pilgrims'
					}
				}
			}
		]
	}
];
