// angular
import { NgModule } from '@angular/core';
import {
	MatAutocompleteModule,
	MatButtonModule, MatButtonToggleModule,
	MatCheckboxModule, MatChipsModule, MatDialogModule, MatFormFieldModule, MatIconModule,
	MatInputModule, MatMenuModule,
	MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSortModule,
	MatTableModule, MatTabsModule, MatTreeModule
} from '@angular/material';

@NgModule({
	imports: [
		MatButtonModule,
		MatCheckboxModule,
		MatPaginatorModule,
		MatInputModule,
		MatTableModule,
		MatSortModule,
		MatDialogModule,
		MatFormFieldModule,
		MatSlideToggleModule,
		MatButtonToggleModule,
		MatMenuModule,
		MatIconModule,
		MatTabsModule,
		MatSidenavModule,
		MatSelectModule,
		MatTreeModule,
		MatProgressBarModule,
		MatAutocompleteModule,
		MatChipsModule
	],
	exports: [
		MatButtonModule,
		MatCheckboxModule,
		MatPaginatorModule,
		MatInputModule,
		MatTableModule,
		MatSortModule,
		MatDialogModule,
		MatFormFieldModule,
		MatSlideToggleModule,
		MatButtonToggleModule,
		MatMenuModule,
		MatIconModule,
		MatTabsModule,
		MatSidenavModule,
		MatSelectModule,
		MatTreeModule,
		MatProgressBarModule,
		MatAutocompleteModule,
		MatChipsModule
	]
})

export class MaterialModule {
}
