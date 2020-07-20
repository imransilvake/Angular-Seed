// angular
import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
		<!-- Router Outlet -->
		<router-outlet></router-outlet>
		
		<!-- Scroll Top -->
		<app-scroll-top></app-scroll-top>
	`,
})

export class AppComponent {
}
