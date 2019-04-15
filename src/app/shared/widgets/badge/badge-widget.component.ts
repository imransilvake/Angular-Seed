// angular
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-widget-badge',
	templateUrl: './badge-widget.component.html',
	styleUrls: ['./badge-widget.component.scss']
})

export class BadgetWidgetComponent {
	@Input() type = 1;
	@Input() count = 0;
}
