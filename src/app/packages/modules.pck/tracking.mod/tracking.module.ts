// angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// app
import { TACKING_ROUTES } from './tracking-routing';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { SharedModule } from '../../../shared/shared.module';
import { FrameModule } from '../../frame.pck/frame.module';
import { TrackingService } from './services/tracking.service';
import { TrackingComponent } from './components/tracking.component';

@NgModule({
	imports: [
		RouterModule.forChild(TACKING_ROUTES),
		SharedModule,
		WidgetsModule,
		FrameModule
	],
	declarations: [
		TrackingComponent
	],
	providers: [
		TrackingService
	]
})

export class TrackingModule {
}
