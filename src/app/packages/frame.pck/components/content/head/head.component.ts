// angular
import { Component, Input } from '@angular/core';

// app
import { ROUTING } from '../../../../../../environments/environment';

@Component({
	selector: 'app-head',
	templateUrl: './head.component.html',
	styleUrls: ['./head.component.scss']
})

export class HeadComponent {
	public routing = ROUTING;

	@Input() pageTitle;
	@Input() notification;
}
