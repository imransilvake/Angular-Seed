// angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// app
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { SharedModule } from '../../../shared/shared.module';
import { FrameModule } from '../../frame.pck/frame.module';
import { PILGRIM_ROUTES } from './pilgrim-routing';
import { PilgrimService } from './services/pilgrim.service';
import { PilgrimComponent } from './components/pilgrim.component';

@NgModule({
	imports: [
		RouterModule.forChild(PILGRIM_ROUTES),
		SharedModule,
		WidgetsModule,
		FrameModule
	],
	declarations: [
		PilgrimComponent
	],
	providers: [
		PilgrimService
	]
})

export class PilgrimModule {
}
