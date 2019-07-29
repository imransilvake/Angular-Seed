// angular
import { NgModule } from '@angular/core';

// app
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CONTENT_ROUTES } from './content-routing';
import { GuestOffersListComponent } from './components/guest-offers/list/guest-offers-list.component';
import { GuestOffersComponent } from './components/guest-offers/guest-offers.component';
import { FrameModule } from '../../frame.pck/frame.module';
import { GuestPushMessageComponent } from './components/guest-push-message/guest-push-message.component';
import { GuestPushMessageListComponent } from './components/guest-push-message/list/guest-push-message-list.component';
import { PushMessageService } from './services/push-message.service';
import { GuestPushMessageFormComponent } from './components/guest-push-message/form/guest-push-message-form.component';
import { GuestOffersService } from './services/guest-offers.service';
import { GuestOffersFormComponent } from './components/guest-offers/form/guest-offers-form.component';
import { GuestRepairsComponent } from './components/guest-repairs/guest-repairs.component';
import { GuestRepairsService } from './services/guest-repairs.service';
import { GuestRepairsListComponent } from './components/guest-repairs/list/guest-repairs-list.component';

@NgModule({
	imports: [
		RouterModule.forChild(CONTENT_ROUTES),
		SharedModule,
		WidgetsModule,
		FieldsModule,
		FrameModule
	],
	declarations: [
		GuestOffersComponent,
		GuestOffersListComponent,
		GuestPushMessageComponent,
		GuestPushMessageListComponent,
		GuestPushMessageFormComponent,
		GuestOffersFormComponent,
		GuestRepairsComponent,
		GuestRepairsListComponent
	],
	providers: [
		GuestOffersService,
		PushMessageService,
		GuestRepairsService
	]
})

export class ContentModule {
}
