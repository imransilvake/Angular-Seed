// angular
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-error-handler',
	templateUrl: './error-handler.component.html',
	styleUrls: ['./error-handler.component.scss']
})

export class ErrorHandlerComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
	}
}
