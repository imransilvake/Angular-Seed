// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { GuestViewInterface } from '../../../interfaces/guest-view.interface';
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { AppOptions } from '../../../../../../../app.config';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';
import { GuestRepairsService } from '../../../services/guest-repairs.service';

@Component({
	selector: 'app-guest-repairs-list',
	templateUrl: './guest-repairs-list.component.html',
	styleUrls: ['./guest-repairs-list.component.scss']
})

export class GuestRepairsListComponent implements OnInit, OnDestroy {
	@Output() changeRepairsView: EventEmitter<any> = new EventEmitter();
	@Output() refresh: EventEmitter<any> = new EventEmitter();

	public guestRepairsList;
	public guestRepairsTable;
	public tablePageSizeWithoutLimit = AppOptions.tablePageSizeWithoutLimit;

	public currentRole;
	public permissionLevel1 = false;

	private buttonType = -1;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _guestRepairsService: GuestRepairsService,
		private _helperService: HelperService
	) {
	}

	ngOnInit() {
		// set current role
		this.currentRole = this._guestRepairsService.appState.role;
		if (this.currentRole) {
			this.permissionLevel1 = this._helperService.permissionLevel1(this.currentRole);
		}

		// listen: fetch repair categories
		this._guestRepairsService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && res.repairCategories) {
					// set tables resources
					this.guestRepairsTable = {
						api: this._guestRepairsService.tableServices.api,
						dragApi: this._guestRepairsService.tableServices.dragApi,
						payload: this._guestRepairsService.tableServices.payload,
						uniqueID: this._guestRepairsService.tableServices.uniqueID,
						sortDefaultColumn: this._guestRepairsService.tableServices.sortDefaultColumn
					};

					// set tables data
					this.guestRepairsList = res.repairCategories;
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * edit guest repair category
	 */
	public onClickEditGuestRepairCategory() {
		this.buttonType = 1;
	}

	/**
	 * delete guest repair category
	 */
	public onClickDeleteGuestRepairCategory() {
		this.buttonType = 2;
	}

	/**
	 * action buttons
	 *
	 * @param row
	 */
	public onClickRowActionButtons(row: any) {
		// edit guest repair category
		if (this.buttonType === 1) {
			this.changePageView(row);
		}

		// delete guest repair category
		if (this.buttonType === 2) {
			this._guestRepairsService.guestRemoveRepair(row, this.refresh);
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
		const payload: GuestViewInterface = {
			view: AppViewTypeEnum.FORM,
			id: data ? data.ID : null,
			data: data ? data : null
		};
		this.changeRepairsView.emit(payload);
	}
}
