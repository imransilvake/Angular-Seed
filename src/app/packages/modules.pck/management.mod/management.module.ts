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
import { ClientService } from './services/client.service';
import { ClientDefaultComponent } from './components/client/default/client-default.component';
import { ClientFormComponent } from './components/client/form/client-form.component';
import { LicenseComponent } from './components/client/form/license/license.component';
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { ClientLicenseService } from './services/client-license.service';
import { SystemDataComponent } from './components/client/form/system-data/system-data.component';

@NgModule({
	imports: [
		RouterModule.forChild(MANAGEMENT_ROUTES),
		FrameModule,
		SharedModule,
		WidgetsModule,
		FieldsModule
	],
	declarations: [
		ClientComponent,
		ClientDefaultComponent,
		ClientFormComponent,
		SystemNotificationComponent,
		UserComponent,
		LicenseComponent,
		SystemDataComponent
	],
	providers: [
		ClientService,
		ClientLicenseService
	]
})

export class ManagementModule {
}
