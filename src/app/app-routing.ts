// angular
import { Routes } from '@angular/router';

// app
import { FRAME_ROUTES } from './packages/frame.pck/frame-routing';
import { AUTHORIZATION_ROUTES } from './packages/modules.pck/authorization.mod/authorization-routing';
import { AppLayoutComponent } from './app-layout.component';
import { AuthOverviewComponent } from './packages/modules.pck/authorization.mod/components/auth-overview/auth-overview.component';
import { ROUTING } from '../environments/environment';
import { E404Component } from './packages/frame.pck/components/errors/e404/e404.component';
import { AuthUserStatusGuard } from './packages/modules.pck/authorization.mod/guards/auth-user-status.guard';

const ROUTES: Routes = [
	{
		path: '',
		redirectTo: ROUTING.authorization.login,
		pathMatch: 'full'
	},
	{
		path: '',
		component: AuthOverviewComponent,
		children: [
			...AUTHORIZATION_ROUTES
		],
		canActivate: [AuthUserStatusGuard]
	},
	{
		path: '',
		component: AppLayoutComponent,
		children: [
			...FRAME_ROUTES
		],
		canActivate: [AuthUserStatusGuard]
	},
	{
		path: '**',
		component: E404Component
	}
];

// routes
export const APP_ROUTES: Routes = ROUTES;
