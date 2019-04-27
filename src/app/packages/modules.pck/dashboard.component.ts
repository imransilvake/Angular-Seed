// angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html'
})

export class DashboardComponent {
	constructor(private _router: Router) {
	}

	public onClickHome() {
		this._router.navigate(['test']);
	}
}
