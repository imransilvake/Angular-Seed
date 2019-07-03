// angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// app
import { NOTIFICATION_ROUTES } from './notification-routing';
import { FrameModule } from '../../frame.pck/frame.module';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { SharedModule } from '../../../shared/shared.module';
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { NotificationListComponent } from './components/notification-list.component';

@NgModule({
	imports: [
		RouterModule.forChild(NOTIFICATION_ROUTES),
		FrameModule,
		SharedModule,
		WidgetsModule,
		FieldsModule
	],
	declarations: [
		NotificationListComponent
	],
	providers: [ ]
})

export class NotificationModule {
}
