// angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// app
import { MANAGEMENT_ROUTES } from './management-routing';
import { ClientComponent } from './components/client/client.component';
import { FrameModule } from '../../frame.pck/frame.module';
import { BroadcastComponent } from './components/broadcast/broadcast.component';
import { UserComponent } from './components/user/user.component';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { SharedModule } from '../../../shared/shared.module';
import { ClientService } from './services/client.service';
import { ClientListComponent } from './components/client/list/client-list.component';
import { ClientFormComponent } from './components/client/form/client-form.component';
import { LicenseComponent } from './components/client/form/license/license.component';
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { SystemDataComponent } from './components/client/form/system-data/system-data.component';
import { HotelGuestAppComponent } from './components/client/form/hotel-guest-app/hotel-guest-app.component';
import { HotelStaffAppComponent } from './components/client/form/hotel-staff-app/hotel-staff-app.component';
import { HotelManagerAppComponent } from './components/client/form/hotel-manager-app/hotel-manager-app.component';
import { UserService } from './services/user.service';
import { UserListComponent } from './components/user/list/user-list.component';
import { UserFormComponent } from './components/user/form/user-form.component';
import { BroadcastListComponent } from './components/broadcast/list/broadcast-list.component';
import { BroadcastService } from './services/broadcast.service';
import { BroadcastFormComponent } from './components/broadcast/form/broadcast-form.component';
import { VersionComponent } from './components/version/version.component';
import { VersionService } from './services/version.service';
import { VersionListComponent } from './components/version/list/version-list.component';

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
		ClientListComponent,
		ClientFormComponent,
		BroadcastComponent,
		UserComponent,
		LicenseComponent,
		SystemDataComponent,
		HotelGuestAppComponent,
		HotelStaffAppComponent,
		HotelManagerAppComponent,
		UserListComponent,
		UserFormComponent,
		BroadcastListComponent,
		BroadcastFormComponent,
		VersionComponent,
		VersionListComponent
	],
	providers: [
		UserService,
		ClientService,
		BroadcastService,
		VersionService
	],
	entryComponents: [
		UserFormComponent,
		BroadcastFormComponent
	]
})

export class ManagementModule {
}
