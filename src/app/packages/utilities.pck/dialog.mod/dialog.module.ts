// angular
import { NgModule } from '@angular/core';

// app
import { SharedModule } from '../../../shared.module';
import { DialogComponent } from './components/dialog.component';
import { DialogConfirmationComponent } from './components/dialog-types/dialog-confirmation/dialog-confirmation.component';
import { DialogNoticeComponent } from './components/dialog-types/dialog-notice/dialog-notice.component';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		DialogComponent,
		DialogConfirmationComponent,
		DialogNoticeComponent
	],
	entryComponents: [
		DialogComponent
	]
})

export class DialogModule {
}
