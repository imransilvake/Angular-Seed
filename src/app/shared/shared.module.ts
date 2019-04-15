// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// app
import { AccessoriesModule } from '../packages/utilities.pck/accessories.mod/accessories.module';
import { MaterialModule } from '../packages/vendors.pck/material.mod/material.module';
import { WidgetsModule } from './widgets/widgets.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		MaterialModule,
		AccessoriesModule,
		WidgetsModule,
		FontAwesomeModule
	]
})

export class SharedModule {
}
