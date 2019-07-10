// angular
import { NgModule } from '@angular/core';

// app
import { FieldsModule } from '../../core.pck/fields.mod/fields.module';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { GUEST_ROUTES } from './guest-routing';
import { OfferListComponent } from './components/offer/list/offer-list.component';

@NgModule({
	imports: [
		RouterModule.forChild(GUEST_ROUTES),
		SharedModule,
		WidgetsModule,
		FieldsModule
	],
	declarations: [
		OfferListComponent
	],
	providers: [
	]
})

export class GuestModule {
}
