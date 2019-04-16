// angular
import { NgModule } from '@angular/core';

// app
import { SharedModule } from '../../../shared/shared.module';
import { ErrorHandlerComponent } from './components/error-handler.component';
import { ErrorCommonComponent } from './components/error-types/error-common/error-common.component';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		ErrorHandlerComponent,
		ErrorCommonComponent
	],
	entryComponents: [
		ErrorHandlerComponent
	]
})

export class ErrorHandlerModule {
}
