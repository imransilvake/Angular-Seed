// angular
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

// app
import { BreadcrumbInterface } from '../interfaces/breadcrumb.interface';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
	public breadcrumb: BreadcrumbInterface = { name: 'Dashboard', url: '' };
	public breadcrumbs: BreadcrumbInterface[];

	constructor(
		private _router: Router,
		private _route: ActivatedRoute
	) {
		// set breadcrumbs
		this._router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(() => {
				const root: ActivatedRoute = this._route.root;
				this.breadcrumbs = this.getBreadcrumbs(root);
				this.breadcrumbs = [this.breadcrumb, ...this.breadcrumbs];
				this.breadcrumbs = this.breadcrumbs.length < 2 ? [] : this.breadcrumbs;
			});
	}

	/**
	 * get breadcrumbs (public)
	 */
	get breadcrumbsList() {
		return this.breadcrumbs;
	}

	/**
	 * get breadcrumbs
	 *
	 * @param route
	 * @param url
	 * @param breadcrumbs
	 */
	private getBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs: BreadcrumbInterface[] = []): BreadcrumbInterface[] {
		const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

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
			if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
				return this.getBreadcrumbs(child, url, breadcrumbs);
			}

			// get the route's URL segment
			const routeURL = child.snapshot.url.map(segment => segment.path).join('/');

			// append route URL to URL
			url += `/${routeURL}`;

			// add breadcrumb
			const breadcrumb: BreadcrumbInterface = {
				name: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
				url: url
			};
			breadcrumbs.push(breadcrumb);

			// recursive
			return this.getBreadcrumbs(child, url, breadcrumbs);
		}

		return breadcrumbs;
	}
}
