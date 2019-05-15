// angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// app
import { ProfileComponent } from './components/profile/profile.component';
import { MEMBER_ROUTES } from './member-routing';
import { FrameModule } from '../../frame.pck/frame.module';
import { UpdateProfileComponent } from './components/profile/update-profile/update-profile.component';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { SharedModule } from '../../../shared/shared.module';
import { MemberService } from './services/member.service';
import { ChangePasswordComponent } from './components/profile/change-password/change-password.component';
import { HotelsListComponent } from './components/profile/hotels-list/hotels-list.component';

@NgModule({
	imports: [
		RouterModule.forChild(MEMBER_ROUTES),
		FrameModule,
		WidgetsModule,
		FieldsModule,
		SharedModule
	],
	declarations: [
		ProfileComponent,
		UpdateProfileComponent,
		ChangePasswordComponent,
		HotelsListComponent
	],
	providers: [
		MemberService
	]
})

export class MemberModule {
}
