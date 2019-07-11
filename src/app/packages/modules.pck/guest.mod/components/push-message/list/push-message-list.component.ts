// angular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { PushMessageService } from '../../../services/push-message.service';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';

@Component({
	selector: 'app-push-message-list',
	templateUrl: './push-message-list.component.html',
	styleUrls: ['./push-message-list.component.scss']
})

export class PushMessageListComponent implements OnInit {
	@Output() changePushMessageView: EventEmitter<any> = new EventEmitter();

	public periodicNotificationList;
	public recentNotificationList;
	public periodicNotificationTable;
	public recentNotificationTable;
	public guestPeriodsList;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _pushMessageService: PushMessageService,
		private _utilityService: UtilityService
	) {
	}

	ngOnInit() {
		// get periods list
		this.guestPeriodsList = this._utilityService.getGuestPeriods();

		// listen: fetch periodic & recently sent guest notifications
		this._pushMessageService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// periodic guest notifications
				if (res && res.periodicGuestNotifications) {
					// set tables resources
					this.periodicNotificationTable = {
						api: this._pushMessageService.tableServices.periodic.api,
						searchApi: this._pushMessageService.tableServices.periodic.api,
						payload: this._pushMessageService.tableServices.periodic.payload,
						uniqueID: this._pushMessageService.tableServices.periodic.uniqueID,
						sortDefaultColumn: this._pushMessageService.tableServices.periodic.sortDefaultColumn
					};

					// set tables data
					this.periodicNotificationList = res.periodicGuestNotifications;
				}

				// recently sent guest notifications
				if (res && res.recentGuestNotifications) {
					// set tables resources
					this.recentNotificationTable = {
						api: this._pushMessageService.tableServices.recent.api,
						searchApi: this._pushMessageService.tableServices.recent.api,
						payload: this._pushMessageService.tableServices.recent.payload,
						uniqueID: this._pushMessageService.tableServices.recent.uniqueID,
						sortDefaultColumn: this._pushMessageService.tableServices.recent.sortDefaultColumn
					};

					// set tables data
					this.recentNotificationList = res.recentGuestNotifications;
				}
			});
	}

	/**
	 * recognize / visit action
	 *
	 * @param row
	 */
	public onClickRowActionButtons(row: any) {
		console.log(row);
	}

	/**
	 * change page view
	 *
	 * @param data
	 */
	public changePageView(data?: any) {
		console.log(data);
	}
}
