// angular
import { Component } from '@angular/core';

// app
import { ErrorHandlerService } from './packages/utilities.pck/error-handler.mod/services/error-handler.service';
import { SessionService } from './packages/core.pck/session.mod/services/session.service';
import { RouterService } from './packages/utilities.pck/accessories.mod/services/router.service';
import { UtilityService } from './packages/utilities.pck/accessories.mod/services/utility.service';

@Component({
	selector: 'app-root',
	template: `
		<!-- Loading Animation -->
		<app-loading-animation></app-loading-animation>

		<!-- Router Outlet -->
		<router-outlet></router-outlet>
	`,
})

export class AppComponent {
	constructor(
		private _errorHandlerService: ErrorHandlerService,
		private _sessionService: SessionService,
		private _routerService: RouterService,
		private _utilityService: UtilityService
	) {
	}
}
