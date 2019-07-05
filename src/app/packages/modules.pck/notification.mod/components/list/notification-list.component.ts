// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

// app
import * as moment from 'moment';
import { ROUTING } from '../../../../../../environments/environment';
import { NotificationService } from '../../services/notification.service';
import { AppStateEnum } from '../../../../frame.pck/enums/app-state.enum';
import { SelectTypeEnum } from '../../../../core.pck/fields.mod/enums/select-type.enum';
import { UtilityService } from '../../../../utilities.pck/accessories.mod/services/utility.service';

@Component({
	selector: 'app-notification-list',
	templateUrl: './notification-list.component.html',
	styleUrls: ['./notification-list.component.scss']
})

export class NotificationListComponent implements OnInit, OnDestroy {
	@Output() refresh: EventEmitter<any> = new EventEmitter();

	public selectTypeDefault = SelectTypeEnum.DEFAULT;
	public routing = ROUTING;
	public hotelAppState = true;
	public notificationList = [];
	public notificationTable;
	public buttonType;
	public formFields;
	public notificationFilters;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _router: Router,
		private _notificationService: NotificationService,
		private _utilityService: UtilityService
	) {
		// form group
		this.formFields = new FormGroup({
			date: new FormControl({ value: new Date(), disabled: true }),
			filter: new FormControl('')
		});
	}

	ngOnInit() {
		// get notification filters list
		this.notificationFilters = this._utilityService.getNotificationFilters();

		// pre-select filter: all notifications
		this.filter.setValue(this.notificationFilters[0]);

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

		// listen: date change
		this.date.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// payload use on refresh services
				const payload = {
					date: res,
					filter: this.filter.value.id
				};

				// refresh table
				this.refresh.emit(payload);
			});

		// listen: filter change
		this.filter.valueChanges
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// payload use on refresh services
				const payload = {
					date: this.date.value,
					filter: res.id
				};

				// refresh table
				this.refresh.emit(payload);
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * getters
	 */
	get date() {
		return this.formFields.get('date');
	}

	get filter() {
		return this.formFields.get('filter');
	}

	/**
	 * increment / decrement selected date
	 *
	 * @param day
	 */
	public onClickUpdateDate(day: number) {
		// update date
		const date = moment(this.date.value).add(day, 'd').toDate();
		this.date.setValue(date);

		// payload use on refresh services
		const payload = {
			date: date,
			filter: this.filter.value.id
		};

		// refresh table
		this.refresh.emit(payload);
	}

	public onClickClearAll() {
		// payload use on refresh services
		const payload = {
			date: this.date.value,
			filter: this.filter.value.id
		};

		// service
		this._notificationService.notificationClearAll(this.refresh, payload);
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

			// payload use on refresh services
			const payload = {
				date: this.date.value,
				filter: this.filter.value.id
			};

			// service
			this._notificationService.notificationRecognize(row, this.refresh, payload);
		}
	}
}
