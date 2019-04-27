// angular
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-error-system',
	templateUrl: './error-system.component.html',
	styleUrls: ['./error-system.component.scss']
})

export class ErrorSystemComponent {
	@Input() data: any;

	constructor() {
	}
}
