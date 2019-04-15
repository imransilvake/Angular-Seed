// angular
import { NgModule } from '@angular/core';

// app
import { DialogService } from './services/dialog.service';
import { SharedModule } from '../../../shared/shared.module';
import { DialogComponent } from './components/dialog.component';
import { DialogConfirmationComponent } from './components/dialog-types/dialog-confirmation/dialog-confirmation.component';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		DialogComponent,
		DialogConfirmationComponent
	],
	providers: [
		DialogService
	],
	entryComponents: [
		DialogComponent
	]
})

export class DialogModule {
}
