// angular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { PushMessageService } from '../../../services/push-message.service';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { GuestPushMessageViewInterface } from '../../../interfaces/guest-push-message-view.interface';

@Component({
	selector: 'app-push-message-list',
	templateUrl: './push-message-list.component.html',
	styleUrls: ['./push-message-list.component.scss']
})

export class PushMessageListComponent implements OnInit {
	@Output() changePushMessageView: EventEmitter<any> = new EventEmitter();
	@Output() refresh: EventEmitter<any> = new EventEmitter();

	public periodicNotificationList;
	public recentNotificationList;
	public periodicNotificationTable;
	public recentNotificationTable;
	public guestPeriodsList;
	private buttonType;

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
	 * delete periodic notification
	 */
	public onClickDeletePeriodicNotification() {
		this.buttonType = 1;
	}

	/**
	 * edit periodic notification
	 */
	public onClickEditNotification() {
		this.buttonType = 2;
	}

	/**
	 * action buttons
	 *
	 * @param row
	 */
	public onClickRowActionButtons(row: any) {
		// delete notification
		if (this.buttonType === 1) {
			this._pushMessageService.deletePeriodicNotification(row, this.refresh);
		}

		// edit / copy notification
		if (this.buttonType === 2) {
			this.changePageView(row);
		}

		// reset
		this.buttonType = -1;
	}

	/**
	 * change page view
	 *
	 * @param data
	 */
	public changePageView(data?: any) {
		// payload
		const payload: GuestPushMessageViewInterface = {
			view: AppViewTypeEnum.FORM,
			data: data ? data : null
		};
		this.changePushMessageView.emit(payload);
	}
}
