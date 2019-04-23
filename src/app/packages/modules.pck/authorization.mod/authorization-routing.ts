// angular
import { Routes } from '@angular/router';

// app
import { ROUTING } from '../../../../environments/environment';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LockScreenComponent } from './components/lock-screen/lock-screen.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthResetPasswordGuard } from './guards/auth-reset-password.guard';

// app routes
export const AUTHORIZATION_ROUTES: Routes = [
	{
		path: ROUTING.authorization.register,
		component: RegisterComponent
	},
	{
		path: ROUTING.authorization.login,
		component: LoginComponent
	},
	{
		path: ROUTING.authorization.forgot,
		component: ForgotPasswordComponent
	},
	{
		path: ROUTING.authorization.reset,
		component: ResetPasswordComponent,
		canActivate: [AuthResetPasswordGuard]
	},
	{
		path: ROUTING.authorization.lock,
		component: LockScreenComponent
	}
];
