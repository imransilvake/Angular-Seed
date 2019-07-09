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
import { NotificationMenuComponent } from './components/menus/notification/notification-menu.component';
import { AccountMenuComponent } from './components/menus/account/account-menu.component';
import { SecondarySidebarComponent } from './components/sidebar/secondary/secondary-sidebar.component';
import { WidgetsModule } from '../../shared/widgets/widgets.module';
import { HeadComponent } from './components/content/head/head.component';
import { BreadcrumbModule } from '../utilities.pck/breadcrumb.mod/breadcrumb.module';
import { EmergencyService } from './services/emergency.service';
import { FieldsModule } from '../core.pck/fields.mod/fields.module';
import { SidebarService } from './services/sidebar.service';
import { MenuService } from './services/menu.service';
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
		SecondarySidebarComponent,
		NotificationMenuComponent,
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
	providers: [
		EmergencyService,
		SidebarService,
		MenuService,
		PageHintService
	]
})

export class FrameModule {
}
