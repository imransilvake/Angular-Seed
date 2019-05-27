// angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// app
import { MANAGEMENT_ROUTES } from './management-routing';
import { ClientComponent } from './client/client.component';
import { FrameModule } from '../../frame.pck/frame.module';
import { SystemNotificationComponent } from './system-notification/system-notification.component';
import { UserComponent } from './user/user.component';

@NgModule({
	imports: [
		RouterModule.forChild(MANAGEMENT_ROUTES),
		FrameModule
	],
	declarations: [ClientComponent, SystemNotificationComponent, UserComponent]
})

export class ManagementModule {
}
