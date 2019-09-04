// angular
import { Routes } from '@angular/router';

// app
import { ROUTING } from '../../../../environments/environment';
import { LoginComponent } from './components/login/login.component';

// routes
export const AUTHORIZATION_ROUTES: Routes = [
	{
		path: ROUTING.authorization.routes.login,
		component: LoginComponent
	}
];
