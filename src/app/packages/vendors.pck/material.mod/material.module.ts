// angular
import { NgModule } from '@angular/core';
import {
	MatButtonModule, MatButtonToggleModule,
	MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatIconModule,
	MatInputModule, MatMenuModule,
	MatPaginatorModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSortModule,
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
		MatTreeModule
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
		MatTreeModule
	]
})

export class MaterialModule {
}
