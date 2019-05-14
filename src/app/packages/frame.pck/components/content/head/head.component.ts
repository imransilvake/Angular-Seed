// angular
import { Component, Input, OnInit } from '@angular/core';

// app
import { ROUTING } from '../../../../../../environments/environment';
import { RouterService } from '../../../../utilities.pck/accessories.mod/services/router-service';

@Component({
	selector: 'app-head',
	templateUrl: './head.component.html',
	styleUrls: ['./head.component.scss']
})

export class HeadComponent implements OnInit {
	public routing = ROUTING;
	public breadcrumbList = [];

	@Input() pageTitle;
	@Input() notification;

	constructor(private _routerService: RouterService) {
	}

	ngOnInit() {
		// get breadcrumbs
		this.breadcrumbList = this._routerService.breadcrumbsList;
	}
}
