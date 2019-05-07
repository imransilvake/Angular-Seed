// angular
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

// app
import { ROUTING } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RouterService {
	private previousUrl;
	private currentUrl;
	private authRoutes = [
		`/${ ROUTING.authorization.register }`,
		`/${ ROUTING.authorization.login }`,
		`/${ ROUTING.authorization.reset }`,
		`/${ ROUTING.authorization.forgot }`
	];

	constructor(private _router: Router) {
		this.currentUrl = this._router.url;
		_router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.previousUrl = this.authRoutes.includes(this.currentUrl) || this.currentUrl === '/' ? ROUTING.dashboard : this.currentUrl;
				this.currentUrl = event.url;
			}
		});
	}

	/**
	 * previous route
	 */
	public getPreviousUrl() {
		return this.previousUrl;
	}
}
