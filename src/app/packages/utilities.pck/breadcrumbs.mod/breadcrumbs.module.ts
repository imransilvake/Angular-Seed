// angular
import { NgModule } from '@angular/core';

// app
import { SharedModule } from '../../../shared/shared.module';
import { BreadcrumbComponent } from './components/breadcrumb.component';

@NgModule({
	imports: [SharedModule],
	declarations: [BreadcrumbComponent],
	exports: [BreadcrumbComponent]
})

export class BreadcrumbsModule {
}
