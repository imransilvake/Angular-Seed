// angular
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-user-form',
	templateUrl: './user-form.component.html',
	styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent {
	@Output() changeUserView: EventEmitter<any> = new EventEmitter();

	constructor() {
	}
}
