// angular
import { NgModule } from '@angular/core';

// app
import { AuthComponent } from './components/auth.component';
import { AuthInfoComponent } from './components/auth-info.component';
import { SharedModule } from '../../../shared/shared.module';
import { RegisterComponent } from './components/register/register.component';
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LockScreenComponent } from './components/lock-screen/lock-screen.component';
import { HotelListService } from './services/hotel-list.service';
import { LanguageListService } from './services/language-list.service';
import { AuthUserStatusGuard } from './guards/auth-user-status.guard';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { SalutationListService } from './services/salutation-list.service';
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
		RegisterComponent,
		LoginComponent,
		ForgotPasswordComponent,
		ResetPasswordComponent,
		LockScreenComponent
	],
	providers: [
		AuthUserStatusGuard,
		HotelListService,
		LanguageListService,
		SalutationListService
	]
})

export class AuthorizationModule {
}
