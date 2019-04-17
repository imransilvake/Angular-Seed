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
import { AuthGuard } from './guards/auth.guard';
import { RegisterService } from './services/register.service';

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
		LockScreenComponent
	],
	providers: [
		AuthGuard,
		RegisterService,
		HotelListService,
		LanguageListService
	]
})

export class AuthorizationModule {
}
