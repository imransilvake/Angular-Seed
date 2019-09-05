// angular
import { Routes } from '@angular/router';

// app
import { ROUTING } from '../../../../environments/environment';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

// routes
export const AUTHORIZATION_ROUTES: Routes = [
	{
		path: ROUTING.authorization.routes.login,
		component: LoginComponent
	},
	{
		path: ROUTING.authorization.routes.changePassword,
		component: ChangePasswordComponent
	}
];
