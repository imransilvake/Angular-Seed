// angular
import { NgModule } from '@angular/core';

// app
import { NotificationComponent } from './components/notification.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
	imports: [
		SharedModule
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
