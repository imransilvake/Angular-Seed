// angular
import { NgModule } from '@angular/core';

// app
import { AuthComponent } from './components/auth.component';
import { AuthInfoComponent } from './components/auth-info.component';
import { SharedModule } from '../../../shared/shared.module';
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { LoginComponent } from './components/login/login.component';
import { AuthUserStatusGuard } from './guards/auth-user-status.guard';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

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
		ChangePasswordComponent
	],
	providers: [
		AuthUserStatusGuard
	]
})

export class AuthorizationModule {
}
