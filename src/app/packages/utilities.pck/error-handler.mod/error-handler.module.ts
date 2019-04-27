// angular
import { NgModule } from '@angular/core';

// app
import { SharedModule } from '../../../shared/shared.module';
import { ErrorHandlerComponent } from './components/error-handler.component';
import { ErrorCommonComponent } from './components/error-types/error-common/error-common.component';
import { ErrorSystemComponent } from './components/error-types/error-system/error-system.component';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		ErrorHandlerComponent,
		ErrorCommonComponent,
		ErrorSystemComponent
	],
	entryComponents: [
		ErrorHandlerComponent
	]
})

export class ErrorHandlerModule {
}
