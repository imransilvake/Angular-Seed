// angular
import { NgModule } from '@angular/core';

// app
import { DividerWidgetComponent } from './divider/divider-widget.component';
import { BadgetWidgetComponent } from './badge/badge-widget.component';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';
import { SharedModule } from '../shared.module';

@NgModule({
	imports: [SharedModule],
	declarations: [
		DividerWidgetComponent,
		BadgetWidgetComponent,
		PasswordStrengthComponent
	],
	exports: [
		DividerWidgetComponent,
		BadgetWidgetComponent,
		PasswordStrengthComponent
	]
})

export class WidgetsModule {
}
