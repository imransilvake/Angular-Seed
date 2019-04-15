// angular
import { NgModule } from '@angular/core';

// app
import { DividerWidgetComponent } from './divider/divider-widget.component';
import { BadgetWidgetComponent } from './badge/badge-widget.component';

@NgModule({
	declarations: [
		DividerWidgetComponent,
		BadgetWidgetComponent
	],
	exports: [
		DividerWidgetComponent,
		BadgetWidgetComponent
	]
})

export class WidgetsModule {
}
