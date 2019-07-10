// angular
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

// app
import { AppViewTypeEnum } from '../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';

@Component({
	selector: 'app-push-message',
	templateUrl: './push-message.component.html'
})

export class PushMessageComponent implements OnInit {
	public pageView: AppViewTypeEnum = AppViewTypeEnum.DEFAULT;
	public id;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor() {
	}

	ngOnInit() {
	}
}
