// angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// app
import { ProfileComponent } from './components/profile/profile.component';
import { MEMBER_ROUTES } from './member-routing';
import { FrameModule } from '../../frame.pck/frame.module';
import { ProfileUpdateComponent } from './components/profile/profile-update/profile-update.component';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { SharedModule } from '../../../shared/shared.module';
import { ChangePasswordComponent } from './components/profile/change-password/change-password.component';
import { HotelsListComponent } from './components/profile/hotels-list/hotels-list.component';
import { ProfileCoverComponent } from './components/profile/profile-cover/profile-cover.component';
import { ProfileUploadImageComponent } from './components/profile/profile-cover/profile-upload-image.component';

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
		ProfileUpdateComponent,
		ChangePasswordComponent,
		HotelsListComponent,
		ProfileCoverComponent,
		ProfileUploadImageComponent
	],
	entryComponents: [
		ProfileUploadImageComponent
	]
})

export class MemberModule {
}
