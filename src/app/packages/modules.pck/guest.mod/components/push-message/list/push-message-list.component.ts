// angular
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { PushMessageService } from '../../../services/push-message.service';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';

@Component({
	selector: 'app-push-message-list',
	templateUrl: './push-message-list.component.html',
	styleUrls: ['./push-message-list.component.scss']
})

export class PushMessageListComponent implements OnInit {
	@Output() changePushMessageView: EventEmitter<any> = new EventEmitter();

	public pushNotificationList;
	public pushNotificationTable;
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
					this.pushNotificationTable = {
						api: this._pushMessageService.tableServices.api,
						searchApi: this._pushMessageService.tableServices.api,
						payload: this._pushMessageService.tableServices.payload,
						uniqueID: this._pushMessageService.tableServices.uniqueID,
						sortDefaultColumn: this._pushMessageService.tableServices.sortDefaultColumn
					};

					// set tables data
					this.pushNotificationList = {
						...res.periodicGuestNotifications,
						data: this.mapPeriodicGuestNotifications(res.periodicGuestNotifications)
					};
				}

				// recently sent guest notifications
				if (res && res.recentGuestNotifications) {
				}
			});
	}

	/**
	 * map periodic guest notifications data
	 *
	 * @param response
	 */
	public mapPeriodicGuestNotifications(response: any) {
		const language = this._pushMessageService.currentUser.profile.language;
		return response && response.data.map(item => {
			let newItem = item;

			// Title
			if (item.hasOwnProperty('Title')) {
				newItem = {
					...newItem,
					Title: item.Title[language]
				}
			}

			// Validity
			if (item.hasOwnProperty('ExpDate')) {
				const date = item.ExpDate ? HelperService.getDateTime(language, item.ExpDate) : '-';
				newItem = {
					...newItem,
					Validity: date
				}
			}

			// Target Group
			if (item.hasOwnProperty('Targets')) {
				const targets = item.Targets ? item.Targets.join(', ') : '-';
				newItem = {
					...newItem,
					'Target Group': targets
				};
			}

			// Period
			if (item.hasOwnProperty('Trigger')) {
				const period = item.Trigger ? this.guestPeriodsList.filter(period => period.id === item.Trigger)[0].text : '-';
				newItem = {
					...newItem,
					Period: period
				};
			}

			return newItem;
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
