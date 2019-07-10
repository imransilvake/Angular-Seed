// angular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-push-message-list',
	templateUrl: './push-message-list.component.html',
	styleUrls: ['./push-message-list.component.scss']
})

export class PushMessageListComponent implements OnInit {
	@Output() changePushMessageView: EventEmitter<any> = new EventEmitter();

	constructor() {
	}

	ngOnInit() {
	}
}
