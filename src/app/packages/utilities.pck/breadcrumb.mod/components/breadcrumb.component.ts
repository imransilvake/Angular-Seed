// angular
import { Component, OnInit } from '@angular/core';

// app
import { BreadcrumbService } from '../services/breadcrumb.service';

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss']
})

export class BreadcrumbComponent implements OnInit {
	public breadcrumbs = [];

	constructor(private _breadcrumbService: BreadcrumbService) {
	}

	ngOnInit() {
		// get breadcrumbs
		this.breadcrumbs = this._breadcrumbService.breadcrumbsList;
	}
}
