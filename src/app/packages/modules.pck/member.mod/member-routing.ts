// angular
import { Routes } from '@angular/router';

// app
import { ProfileComponent } from './components/profile/profile.component';

export const MEMBER_ROUTES: Routes = [
	{
		path: '',
		children: [
			{
				path: 'profile',
				component: ProfileComponent,
				data: {
					breadcrumb: {
						en: 'Profile',
						de: 'Profil'
					}
				}
			}
		]
	}
];
