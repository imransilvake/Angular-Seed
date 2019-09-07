// angular
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

// app
import { BreadcrumbInterface } from '../interfaces/breadcrumb.interface';
import { AuthService } from '../../../modules.pck/authorization.mod/services/auth.service';
import { AppOptions } from '../../../../../app.config';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
	public routeDataBreadcrumb = 'breadcrumb';
	public firstBreadcrumb: BreadcrumbInterface = { name: 'Home', url: '' };
	public breadcrumbs: BreadcrumbInterface[] = [];

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _authService: AuthService
	) {
		// set on page refresh
		if (this.breadcrumbs.length === 0) {
			this.breadcrumbsList = _route.root;
		}

		// set breadcrumbs
		this._router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(() => this.breadcrumbsList = _route.root);
	}

	/**
	 * get breadcrumbs (public)
	 */
	get breadcrumbsList() {
		return this.breadcrumbs;
	}

	/**
	 * set breadcrumbs
	 */
	set breadcrumbsList(routerRoot: any) {
		this.breadcrumbs = this.getBreadcrumbs(routerRoot);
		this.breadcrumbs = [this.firstBreadcrumb, ...this.breadcrumbs];
	}

	/**
	 * get breadcrumbs
	 *
	 * @param route
	 * @param url
	 * @param breadcrumbs
	 */
	private getBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs: BreadcrumbInterface[] = []): BreadcrumbInterface[] {
		// get the child routes
		const children: ActivatedRoute[] = route.children;

		// return if there are no more children
		if (children.length === 0) {
			return breadcrumbs;
		}

		// iterate over each children
		for (const child of children) {
			// verify primary route
			if (child.outlet !== PRIMARY_OUTLET) {
				continue;
			}

			// verify the custom data property 'breadcrumb' is specified on the route
			if (!child.snapshot.data.hasOwnProperty(this.routeDataBreadcrumb)) {
				return this.getBreadcrumbs(child, url, breadcrumbs);
			}

			// get the route's URL segment
			const routeURL = child.snapshot.url.map(segment => segment.path).join('/');

			// append route URL to URL
			url += `/${routeURL}`;

			// set specific breadcrumb name
			const currentLanguage = 'en';
			const breadcrumbData = child.snapshot.data[this.routeDataBreadcrumb];
			const name = currentLanguage === AppOptions.languages['en'] ? breadcrumbData.en : breadcrumbData.de;

			// add breadcrumb
			const breadcrumb: BreadcrumbInterface = {
				name: name,
				url: url
			};
			breadcrumbs.push(breadcrumb);

			// recursive
			return this.getBreadcrumbs(child, url, breadcrumbs);
		}

		return breadcrumbs;
	}
}
