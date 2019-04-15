// angular
import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	template: `
		<!-- Loading Animation -->
		<app-loading-animation (changedAnimationStatus)="isShowLoadingAnimation = $event"></app-loading-animation>

		<!-- Router Outlet -->
		<div [class.cd-hide]="isShowLoadingAnimation">
			<router-outlet></router-outlet>
		</div>
	`,
})

export class AppComponent {
	public isShowLoadingAnimation = false;
}
