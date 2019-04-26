// angular
import { Routes } from '@angular/router';

// app
import { AUTHORIZATION_ROUTES } from './packages/modules.pck/authorization.mod/authorization-routing';
import { AppLayoutComponent } from './app-layout.component';
import { AuthOverviewComponent } from './packages/modules.pck/authorization.mod/components/auth-overview/auth-overview.component';
import { ROUTING } from '../environments/environment';
import { E404Component } from './packages/frame.pck/components/errors/e404/e404.component';
import { AuthUserStatusGuard } from './packages/modules.pck/authorization.mod/guards/auth-user-status.guard';
import { DashboardComponent } from './packages/modules.pck/dashboard.component';

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
			{
				path: '',
				children: [
					{
						path: ROUTING.dashboard,
						component: DashboardComponent
					}
				],
				canActivateChild: [AuthUserStatusGuard]
			}
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
