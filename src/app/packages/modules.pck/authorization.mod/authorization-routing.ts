// angular
import { Routes } from '@angular/router';

// app
import { ROUTING } from '../../../../environments/environment';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

// routes
export const AUTHORIZATION_ROUTES: Routes = [
	{
		path: ROUTING.authorization.routes.login,
		component: LoginComponent
	},
	{
		path: ROUTING.authorization.routes.forgot,
		component: ForgotPasswordComponent
	},
	{
		path: ROUTING.authorization.routes.reset,
		component: ResetPasswordComponent
	}
];
