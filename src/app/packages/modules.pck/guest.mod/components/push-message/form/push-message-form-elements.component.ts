// app
import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-push-message-form-elements',
	templateUrl: './push-message-form-elements.component.html',
	styleUrls: ['./push-message-form-elements.component.scss']
})

export class PushMessageFormElementsComponent implements OnInit {
	@Input() tab = null;
	@Input() formArray;
	@Input() minDate;
	@Input() staticColors;

	constructor() {
	}

	ngOnInit() {
	}
}
