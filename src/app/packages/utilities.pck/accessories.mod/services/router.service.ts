// angular
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

// app
import { ROUTING } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RouterService {
	private lastRoute;
	private currentUrl;
	private authRoutes = [
		`/${ ROUTING.authorization.register }`,
		`/${ ROUTING.authorization.login }`,
		`/${ ROUTING.authorization.reset }`,
		`/${ ROUTING.authorization.forgot }`
	];

	constructor(private _router: Router) {
		this.currentUrl = this._router.url;
		this._router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(event => {
				// set previous url
				this.setPreviousUrl(event);
			});
	}

	/**
	 * get previous url
	 */
	get previousUrl() {
		return this.lastRoute;
	}

	/**
	 * set previous url
	 *
	 * @param event
	 */
	private setPreviousUrl(event) {
		this.lastRoute = this.authRoutes.includes(this.currentUrl) || this.currentUrl === '/' ? ROUTING.dashboard : this.currentUrl;
		this.currentUrl = event.url;
	}
}
