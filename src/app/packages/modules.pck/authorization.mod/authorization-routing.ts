// angular
import { Routes } from '@angular/router';

// app
import { ROUTING } from '../../../../environments/environment';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LockScreenComponent } from './components/lock-screen/lock-screen.component';
import { ConfirmPasswordComponent } from './components/confirm-password/confirm-password.component';
import { AuthConfirmPasswordGuard } from './guards/auth-confirm-password.guard';

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
		path: ROUTING.authorization.confirm,
		component: ConfirmPasswordComponent,
		canActivate: [AuthConfirmPasswordGuard]
	},
	{
		path: ROUTING.authorization.lock,
		component: LockScreenComponent
	}
];
