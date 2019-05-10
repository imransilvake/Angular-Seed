// angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// app
import { ProfileComponent } from './components/profile/profile.component';
import { MEMBER_ROUTES } from './member-routing';
import { FrameModule } from '../../frame.pck/frame.module';

@NgModule({
	imports: [
		RouterModule.forChild(MEMBER_ROUTES),
		FrameModule
	],
	declarations: [ProfileComponent]
})

export class MemberModule {
}
