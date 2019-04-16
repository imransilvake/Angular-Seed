// angular
import { Component } from '@angular/core';

// app
import { ErrorHandlerService } from './packages/utilities.pck/error-handler.mod/services/error-handler.service';

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

	constructor(private _errorHandlerService: ErrorHandlerService) {
	}
}
