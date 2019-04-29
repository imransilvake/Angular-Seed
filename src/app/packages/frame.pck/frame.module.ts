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
import { SidebarService } from './services/sidebar.service';
import { NotificationMenuComponent } from './components/menus/notification/notification-menu.component';
import { AccountMenuComponent } from './components/menus/account/account-menu.component';
import { SecondarySidebarComponent } from './components/sidebar/secondary/secondary-sidebar.component';
import { MaintenanceComponent } from './components/pages/maintenance.component';

@NgModule({
	imports: [
		SharedModule,
		NotificationModule
	],
	declarations: [
		E404Component,
		MaintenanceComponent,
		HeaderComponent,
		FooterComponent,
		ScrollTopComponent,
		PrimarySidebarComponent,
		SecondarySidebarComponent,
		NotificationMenuComponent,
		AccountMenuComponent
	],
	exports: [
		HeaderComponent,
		FooterComponent,
		ScrollTopComponent,
		PrimarySidebarComponent
	],
	providers: [SidebarService]
})

export class FrameModule {
}
