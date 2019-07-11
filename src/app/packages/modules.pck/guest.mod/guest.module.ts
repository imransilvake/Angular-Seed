// angular
import { NgModule } from '@angular/core';

// app
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { GUEST_ROUTES } from './guest-routing';
import { OfferListComponent } from './components/offer/list/offer-list.component';
import { OfferComponent } from './components/offer/offer.component';
import { FrameModule } from '../../frame.pck/frame.module';
import { PushMessageComponent } from './components/push-message/push-message.component';
import { PushMessageListComponent } from './components/push-message/list/push-message-list.component';
import { PushMessageService } from './services/push-message.service';

@NgModule({
	imports: [
		RouterModule.forChild(GUEST_ROUTES),
		SharedModule,
		WidgetsModule,
		FieldsModule,
		FrameModule
	],
	declarations: [
		OfferComponent,
		OfferListComponent,
		PushMessageComponent,
		PushMessageListComponent
	],
	providers: [
		PushMessageService
	]
})

export class GuestModule {
}
