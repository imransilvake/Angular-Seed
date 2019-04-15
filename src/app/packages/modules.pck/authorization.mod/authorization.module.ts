// angular
import { NgModule } from '@angular/core';

// app
import { SharedModule } from '../../../shared/shared.module';
import { RegisterComponent } from './components/register/register.component';
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { AuthOverviewComponent } from './components/auth-overview/auth-overview.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LockScreenComponent } from './components/lock-screen/lock-screen.component';
import { HotelListService } from './services/hotel-list.service';
import { LanguageListService } from './services/language-list.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
	imports: [
		SharedModule,
		FieldsModule
	],
	declarations: [
		RegisterComponent,
		AuthOverviewComponent,
		LoginComponent,
		ResetPasswordComponent,
		LockScreenComponent
	],
	providers: [
		HotelListService,
		LanguageListService,
		AuthGuard
	]
})

export class AuthorizationModule {
}
