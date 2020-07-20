// angular
import { NgModule } from '@angular/core';

// app
import { SharedModule } from '../../../shared.module';
import { InputComponent } from './components/input/input.component';
import { SelectComponent } from './components/select/select.component';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		InputComponent,
		SelectComponent
	],
	exports: [
		InputComponent,
		SelectComponent
	]
})

export class FieldsModule {
}
