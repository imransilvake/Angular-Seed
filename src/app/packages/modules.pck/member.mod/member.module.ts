// angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// app
import { ProfileComponent } from './components/profile/profile.component';
import { MEMBER_ROUTES } from './member-routing';

@NgModule({
	imports: [
		RouterModule.forChild(MEMBER_ROUTES)
	],
	declarations: [ProfileComponent]
})

export class MemberModule {
}
