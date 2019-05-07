// angular
import { NgModule } from '@angular/core';

// app
import { AuthOverviewComponent } from './components/auth-overview.component';
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
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthService } from './services/auth.service';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { SalutationListService } from './services/salutation-list.service';

@NgModule({
	imports: [
		SharedModule,
		WidgetsModule,
		FieldsModule
	],
	declarations: [
		AuthOverviewComponent,
		AuthInfoComponent,
		RegisterComponent,
		LoginComponent,
		ForgotPasswordComponent,
		ResetPasswordComponent,
		LockScreenComponent
	],
	providers: [
		AuthUserStatusGuard,
		AuthService,
		HotelListService,
		LanguageListService,
		SalutationListService
	]
})

export class AuthorizationModule {
}
