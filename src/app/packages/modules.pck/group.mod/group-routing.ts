// angular
import { Routes } from '@angular/router';

// app
import { GroupComponent } from './components/group.component';

// routes
export const GROUP_ROUTES: Routes = [
	{
		path: '',
		children: [
			{
				path: 'overview',
				component: GroupComponent,
				data: {
					breadcrumb: {
						en: 'Groups'
					}
				}
			}
		]
	}
];
