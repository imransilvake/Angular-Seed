// angular
import { Routes } from '@angular/router';

// app
import { ROUTING } from '../environments/environment';
import { E404Component } from './packages/frame.pck/components/e404/e404.component';

const ROUTES: Routes = [
	{
		path: ROUTING.HOME,
		loadChildren: () => import('./packages/modules.pck/home.module').then(m => m.HomeModule)
	},
	{
		path: '**',
		component: E404Component
	}
];

// routes
export const APP_ROUTES: Routes = ROUTES;
