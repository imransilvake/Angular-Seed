// angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// app
import { NOTIFICATION_ROUTES } from './notification-routing';
import { FrameModule } from '../../frame.pck/frame.module';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { SharedModule } from '../../../shared/shared.module';
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { NotificationComponent } from './components/notification.component';
import { NotificationListComponent } from './components/list/notification-list.component';
import { NotificationService } from './services/notification.service';

@NgModule({
	imports: [
		RouterModule.forChild(NOTIFICATION_ROUTES),
		FrameModule,
		SharedModule,
		WidgetsModule,
		FieldsModule
	],
	declarations: [
		NotificationComponent,
		NotificationListComponent
	],
	providers: [
		NotificationService
	]
})

export class NotificationModule {
}
