// angular
import { NgModule } from '@angular/core';

// app
import { SharedModule } from '../../../shared/shared.module';
import { RegisterComponent } from './components/register/register.component';
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { AuthOverviewComponent } from './components/auth-overview/auth-overview.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LockScreenComponent } from './components/lock-screen/lock-screen.component';
import { HotelListService } from './services/hotel-list.service';
import { LanguageListService } from './services/language-list.service';
import { AuthUserStatusGuard } from './guards/auth-user-status.guard';
import { RegisterService } from './services/register.service';
import { ForgotPasswordService } from './services/forgot-password.service';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthResetPasswordGuard } from './guards/auth-reset-password.guard';
import { ResetPasswordService } from './services/reset-password.service';

@NgModule({
	imports: [
		SharedModule,
		FieldsModule
	],
	declarations: [
		RegisterComponent,
		AuthOverviewComponent,
		LoginComponent,
		ForgotPasswordComponent,
		ResetPasswordComponent,
		LockScreenComponent
	],
	providers: [
		AuthUserStatusGuard,
		AuthResetPasswordGuard,
		RegisterService,
		ForgotPasswordService,
		ResetPasswordService,
		HotelListService,
		LanguageListService
	]
})

export class AuthorizationModule {
}
