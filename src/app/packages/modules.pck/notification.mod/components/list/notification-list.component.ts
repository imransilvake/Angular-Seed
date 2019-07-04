// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { NotificationService } from '../../services/notification.service';
import { AppStateEnum } from '../../../../frame.pck/enums/app-state.enum';

@Component({
	selector: 'app-notification-list',
	templateUrl: './notification-list.component.html',
	styleUrls: ['./notification-list.component.scss']
})

export class NotificationListComponent implements OnInit, OnDestroy {
	public hotelAppState = true;
	public notificationList = [];
	public notificationTable;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _notificationService: NotificationService) {
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
						payload: this._notificationService.notificationTablesServices.payload,
						uniqueID: this._notificationService.notificationTablesServices.uniqueID
					};

					// set tables data
					this.mapUsers(res.notificationList);
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * map notifications list
	 *
	 * @param notificationList
	 */
	public mapUsers(notificationList: any) {
		if (notificationList && notificationList.data.length === 0) {
			this.notificationList = [];
		} else {
			const mappedData = notificationList && notificationList.data.map(notification => {
				return {
					Id: notification.Id,
					Message: notification.Message.Title,
					Received: notification.Received,
					Type: notification.Type
				};
			});

			// update map data
			this.notificationList = { ...notificationList, data: mappedData };
		}
	}

	/**
	 * new / old action
	 *
	 * @param row
	 */
	public onClickRowActionButtons(row: any) {
	}

	/**
	 * recognize notification
	 */
	public onClickRecognize() {
	}

	/**
	 * recognize visit
	 */
	public onClickVisit() {
	}
}
