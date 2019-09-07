// angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// app
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { RealtimeMapComponent } from './components/realtime-map/realtime-map.component';
import { SharedModule } from '../../../shared/shared.module';
import { TACKING_ROUTES } from './tracking-routing';
import { FrameModule } from '../../frame.pck/frame.module';

@NgModule({
	imports: [
		RouterModule.forChild(TACKING_ROUTES),
		SharedModule,
		WidgetsModule,
		FrameModule
	],
	declarations: [
		RealtimeMapComponent
	]
})

export class TrackingModule {
}
