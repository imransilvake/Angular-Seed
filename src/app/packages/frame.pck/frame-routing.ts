// angular
import { Routes } from '@angular/router';

// app
import { ROUTING } from '../../../environments/environment';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// frame routes
export const FRAME_ROUTES: Routes = [
	{
		path: ROUTING.dashboard,
		component: DashboardComponent
	}
];
