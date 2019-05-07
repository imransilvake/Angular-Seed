// angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// app
import { ROUTING } from '../../../environments/environment';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html'
})

export class DashboardComponent {
	constructor(private _router: Router) {
	}

	/**
	 * on click go to dashboard
	 */
	public onClickHome() {
		this._router.navigate([ROUTING.pages.maintenance]);
	}
}
