// angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// app
import { WidgetsModule } from '../../../shared/widgets/widgets.module';
import { SharedModule } from '../../../shared/shared.module';
import { FrameModule } from '../../frame.pck/frame.module';
import { GroupComponent } from './components/group.component';
import { GROUP_ROUTES } from './group-routing';
import { GroupService } from './services/group.service';

@NgModule({
	imports: [
		RouterModule.forChild(GROUP_ROUTES),
		SharedModule,
		WidgetsModule,
		FrameModule
	],
	declarations: [
		GroupComponent
	],
	providers: [
		GroupService
	]
})

export class GroupModule {
}
