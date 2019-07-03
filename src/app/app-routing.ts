// angular
import { Routes } from '@angular/router';

// app
import { AUTHORIZATION_ROUTES } from './packages/modules.pck/authorization.mod/authorization-routing';
import { AppLayoutComponent } from './app-layout.component';
import { AuthComponent } from './packages/modules.pck/authorization.mod/components/auth.component';
import { ROUTING } from '../environments/environment';
import { E404Component } from './packages/frame.pck/components/pages/e404.component';
import { AuthUserStatusGuard } from './packages/modules.pck/authorization.mod/guards/auth-user-status.guard';
import { DashboardComponent } from './packages/modules.pck/dashboard.component';

const ROUTES: Routes = [
	{
		path: '',
		redirectTo: ROUTING.authorization.routes.login,
		pathMatch: 'full'
	},
	{
		path: '',
		component: AuthComponent,
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
						path: ROUTING.pages.dashboard,
						component: DashboardComponent
					},
					{
						path: ROUTING.member.title,
						loadChildren: () => import('./packages/modules.pck/member.mod/member.module').then(m => m.MemberModule)
					},
					{
						path: ROUTING.management.title,
						loadChildren: () => import('./packages/modules.pck/management.mod/management.module').then(m => m.ManagementModule)
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
