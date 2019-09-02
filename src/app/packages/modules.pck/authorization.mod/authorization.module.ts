// angular
import { NgModule } from '@angular/core';

// app
import { AuthComponent } from './components/auth.component';
import { AuthInfoComponent } from './components/auth-info.component';
import { SharedModule } from '../../../shared/shared.module';
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AuthUserStatusGuard } from './guards/auth-user-status.guard';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
	imports: [
		SharedModule,
		WidgetsModule,
		FieldsModule
	],
	declarations: [
		AuthComponent,
		AuthInfoComponent,
		LoginComponent,
		ForgotPasswordComponent,
		ResetPasswordComponent
	],
	providers: [
		AuthUserStatusGuard
	]
})

export class AuthorizationModule {
}
