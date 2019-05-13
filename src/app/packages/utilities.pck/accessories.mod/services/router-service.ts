// angular
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

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
	private breadcrumbs = [];

	constructor(private _router: Router) {
		this.currentUrl = this._router.url;
		this._router.events
			.subscribe(event => {
				// set previous url
				this.setPreviousUrl(event);

				// set breadcrumbs
				this.setBreadcrumbsList();
			});
	}

	/**
	 * getters
	 */
	get previousUrl() {
		return this.lastRoute;
	}

	get breadcrumbsList() {
		return this.breadcrumbs;
	}

	/**
	 * set previous url
	 *
	 * @param event
	 */
	private setPreviousUrl(event) {
		if (event instanceof NavigationEnd) {
			this.lastRoute = this.authRoutes.includes(this.currentUrl) || this.currentUrl === '/' ? ROUTING.dashboard : this.currentUrl;
			this.currentUrl = event.url;
		}
	}

	/**
	 * set breadcrumbs
	 */
	private setBreadcrumbsList() {
		this.breadcrumbs = [];
		const currentUrl = location.pathname;
		let breadcrumbs = currentUrl && currentUrl.split('/');

		// validate breadcrumbs
		if (breadcrumbs && breadcrumbs.length > 0) {
			breadcrumbs = breadcrumbs.slice(1, breadcrumbs.length);
			for (let i = 0; i < breadcrumbs.length; i++) {
				if (i >= 1) {
					// payload
					const payload = {
						name: breadcrumbs[i],
						url: `/${breadcrumbs[i - 1]}/${breadcrumbs[i]}`
					};
					this.breadcrumbs.push(payload);
				}
			}
		}
	}
}
