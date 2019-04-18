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
import { ConfirmPasswordComponent } from './components/confirm-password/confirm-password.component';
import { AuthConfirmPasswordGuard } from './guards/auth-confirm-password.guard';

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
		ConfirmPasswordComponent,
		LockScreenComponent
	],
	providers: [
		AuthUserStatusGuard,
		AuthConfirmPasswordGuard,
		RegisterService,
		ForgotPasswordService,
		HotelListService,
		LanguageListService
	]
})

export class AuthorizationModule {
}
