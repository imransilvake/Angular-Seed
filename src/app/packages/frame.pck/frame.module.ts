// angular
import { NgModule } from '@angular/core';

// app
import { SharedModule } from '../../shared/shared.module';
import { E404Component } from './components/pages/e404.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationModule } from '../utilities.pck/notification.mod/notification.module';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';
import { PrimarySidebarComponent } from './components/sidebar/primary/primary-sidebar.component';
import { AccountMenuComponent } from './components/menus/account/account-menu.component';
import { WidgetsModule } from '../../shared/widgets/widgets.module';
import { HeadComponent } from './components/content/head/head.component';
import { BreadcrumbModule } from '../utilities.pck/breadcrumb.mod/breadcrumb.module';
import { FieldsModule } from '../core.pck/fields.mod/fields.module';
import { PageHintService } from './services/page-hint.service';

@NgModule({
	imports: [
		SharedModule,
		WidgetsModule,
		NotificationModule,
		BreadcrumbModule,
		FieldsModule
	],
	declarations: [
		E404Component,
		HeaderComponent,
		FooterComponent,
		ScrollTopComponent,
		PrimarySidebarComponent,
		AccountMenuComponent,
		HeadComponent
	],
	exports: [
		HeaderComponent,
		FooterComponent,
		ScrollTopComponent,
		PrimarySidebarComponent,
		HeadComponent
	],
	providers: [PageHintService]
})

export class FrameModule {
}
