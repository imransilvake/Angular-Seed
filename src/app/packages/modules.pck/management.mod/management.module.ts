// angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// app
import { MANAGEMENT_ROUTES } from './management-routing';
import { ClientComponent } from './components/client/client.component';
import { FrameModule } from '../../frame.pck/frame.module';
import { SystemNotificationComponent } from './components/system-notification/system-notification.component';
import { UserComponent } from './components/user/user.component';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
	imports: [
		RouterModule.forChild(MANAGEMENT_ROUTES),
		FrameModule,
		SharedModule,
		WidgetsModule
	],
	declarations: [
		ClientComponent,
		SystemNotificationComponent,
		UserComponent
	]
})

export class ManagementModule {
}
