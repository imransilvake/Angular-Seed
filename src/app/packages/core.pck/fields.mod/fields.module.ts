// angular
import { NgModule } from '@angular/core';

// app
import { SharedModule } from '../../../shared/shared.module';
import { InputComponent } from './components/input/input.component';
import { SelectComponent } from './components/select/select.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		InputComponent,
		SelectComponent,
		AutocompleteComponent
	],
	exports: [
		InputComponent,
		SelectComponent,
		AutocompleteComponent
	]
})

export class FieldsModule {
}
