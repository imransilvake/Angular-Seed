// angular
import { NgModule } from '@angular/core';

// app
import { SharedModule } from '../../../shared/shared.module';
import { ErrorHandlerComponent } from './components/error-handler.component';
import { ErrorHandlerService } from './services/error-handler.service';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		ErrorHandlerComponent
	],
	providers: [
		ErrorHandlerService
	],
	entryComponents: [
		ErrorHandlerComponent
	]
})

export class ErrorHandlerModule {
}
