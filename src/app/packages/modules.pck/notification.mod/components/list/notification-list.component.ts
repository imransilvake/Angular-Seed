// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

// app
import { NotificationService } from '../../services/notification.service';
import { AppStateEnum } from '../../../../frame.pck/enums/app-state.enum';
import { ROUTING } from '../../../../../../environments/environment';

@Component({
	selector: 'app-notification-list',
	templateUrl: './notification-list.component.html',
	styleUrls: ['./notification-list.component.scss']
})

export class NotificationListComponent implements OnInit, OnDestroy {
	@Output() rowClear: EventEmitter<boolean> = new EventEmitter(false);

	public routing = ROUTING;
	public hotelAppState = true;
	public notificationList = [];
	public notificationTable;
	public buttonType;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _router: Router,
		private _notificationService: NotificationService
	) {
	}

	ngOnInit() {
		// listen: fetch notifications list
		this._notificationService.notificationDataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res) {
					// validate hotel selection
					this.hotelAppState = this._notificationService.appState.type === AppStateEnum.HOTEL;

					// set tables resources
					this.notificationTable = {
						api: this._notificationService.notificationTablesServices.api,
						clearApi: this._notificationService.notificationTablesServices.clearApi,
						payload: this._notificationService.notificationTablesServices.payload,
						uniqueID: this._notificationService.notificationTablesServices.uniqueID
					};

					// set tables data
					this.notificationList = res.notificationList;
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * recognize notification
	 */
	public onClickRecognize() {
		this.buttonType = 1;
	}

	/**
	 * recognize / visit action
	 *
	 * @param row
	 */
	public onClickRowActionButtons(row: any) {
		// recognize row
		if (this.buttonType === 1) {
			// reset button type
			this.buttonType = 0;

			// service
			this._notificationService.recognizeNotification(row, this.rowClear);
		}
	}
}
