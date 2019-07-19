// angular
import { NgModule } from '@angular/core';

// app
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { GUEST_ROUTES } from './guest-routing';
import { OfferListComponent } from './components/offers/list/offer-list.component';
import { OffersComponent } from './components/offers/offers.component';
import { FrameModule } from '../../frame.pck/frame.module';
import { PushMessageComponent } from './components/push-message/push-message.component';
import { PushMessageListComponent } from './components/push-message/list/push-message-list.component';
import { PushMessageService } from './services/push-message.service';
import { PushMessageFormComponent } from './components/push-message/form/push-message-form.component';
import { GuestOffersService } from './services/guest-offers.service';
import { OffersFormComponent } from './components/offers/form/offers-form.component';
import { GuestService } from './services/guest.service';

@NgModule({
	imports: [
		RouterModule.forChild(GUEST_ROUTES),
		SharedModule,
		WidgetsModule,
		FieldsModule,
		FrameModule
	],
	declarations: [
		OffersComponent,
		OfferListComponent,
		PushMessageComponent,
		PushMessageListComponent,
		PushMessageFormComponent,
		OffersFormComponent
	],
	providers: [
		GuestService,
		GuestOffersService,
		PushMessageService
	]
})

export class GuestModule {
}
