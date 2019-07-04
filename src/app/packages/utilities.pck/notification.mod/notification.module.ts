// angular
import { NgModule } from '@angular/core';

// app
import { NotificationComponent } from './components/notification.component';
import { SharedModule } from '../../../shared/shared.module';
import { WidgetsModule } from '../../../shared/widgets/widgets.module';

@NgModule({
	imports: [
		SharedModule,
		WidgetsModule
	],
	declarations: [
		NotificationComponent
	],
	exports: [
		NotificationComponent
	]
})

export class NotificationModule {
}
