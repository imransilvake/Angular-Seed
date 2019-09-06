// angular
import { NgModule } from '@angular/core';

// app
import { DividerComponent } from './divider/divider.component';
import { BadgeComponent } from './badge/badge.component';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';
import { SharedModule } from '../shared.module';
import { ReadMoreComponent } from './read-more/read-more.component';
import { TableComponent } from './table/table.component';
import { FieldsModule } from '../../packages/core.pck/fields.mod/fields.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { MapComponent } from './map/map.component';

@NgModule({
	imports: [
		SharedModule,
		FieldsModule,
		DragDropModule
	],
	declarations: [
		DividerComponent,
		BadgeComponent,
		PasswordStrengthComponent,
		ReadMoreComponent,
		TableComponent,
		ImageUploadComponent,
		MapComponent
	],
	exports: [
		DividerComponent,
		BadgeComponent,
		PasswordStrengthComponent,
		ReadMoreComponent,
		TableComponent,
		ImageUploadComponent,
		MapComponent
	]
})

export class WidgetsModule {
}
