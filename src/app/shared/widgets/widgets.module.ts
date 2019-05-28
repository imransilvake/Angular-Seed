// angular
import { NgModule } from '@angular/core';

// app
import { DividerWidgetComponent } from './divider/divider-widget.component';
import { BadgetWidgetComponent } from './badge/badge-widget.component';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';
import { SharedModule } from '../shared.module';
import { ReadMoreComponent } from './read-more/read-more.component';
import { TableComponent } from './table/table.component';
import { FieldsModule } from '../../packages/core.pck/fields.mod/fields.module';

@NgModule({
	imports: [
		SharedModule,
		FieldsModule
	],
	declarations: [
		DividerWidgetComponent,
		BadgetWidgetComponent,
		PasswordStrengthComponent,
		ReadMoreComponent,
		TableComponent
	],
	exports: [
		DividerWidgetComponent,
		BadgetWidgetComponent,
		PasswordStrengthComponent,
		ReadMoreComponent,
		TableComponent
	]
})

export class WidgetsModule {
}
