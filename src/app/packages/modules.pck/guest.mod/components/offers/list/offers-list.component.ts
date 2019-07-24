// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { GuestViewInterface } from '../../../interfaces/guest-view.interface';
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { AppOptions } from '../../../../../../../app.config';
import { GuestOffersService } from '../../../services/guest-offers.service';
import { UserRoleEnum } from '../../../../authorization.mod/enums/user-role.enum';

@Component({
	selector: 'app-offer-list',
	templateUrl: './offers-list.component.html',
	styleUrls: ['./offers-list.component.scss']
})

export class OffersListComponent implements OnInit, OnDestroy {
	@Output() changeOffersView: EventEmitter<any> = new EventEmitter();
	@Output() refresh: EventEmitter<any> = new EventEmitter();

	public guestOffersList;
	public guestOffersTable;
	public tablePageSizeWithoutLimit = AppOptions.tablePageSizeWithoutLimit;
	public currentRole;
	public roleHouseKeeping: UserRoleEnum = UserRoleEnum[UserRoleEnum.HOUSEKEEPING];

	private buttonType = -1;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _guestOfferService: GuestOffersService) {
	}

	ngOnInit() {
		// set current role
		this.currentRole = this._guestOfferService.appState.role;

		// listen: fetch periodic & recently sent guest notifications
		this._guestOfferService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && res.activeHotelOffers) {
					// set tables resources
					this.guestOffersTable = {
						api: this._guestOfferService.tableServices.api,
						searchApi: this._guestOfferService.tableServices.api,
						dragApi: this._guestOfferService.tableServices.dragApi,
						payload: this._guestOfferService.tableServices.payload,
						uniqueID: this._guestOfferService.tableServices.uniqueID,
						sortDefaultColumn: this._guestOfferService.tableServices.sortDefaultColumn
					};

					// set tables data
					this.guestOffersList = res.activeHotelOffers;
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * edit guest hotel offer
	 */
	public onClickEditGuestHotelOffer() {
		this.buttonType = 1;
	}

	/**
	 * delete guest hotel offer
	 */
	public onClickDeleteGuestHotelOffer() {
		this.buttonType = 2;
	}

	/**
	 * action buttons
	 *
	 * @param row
	 */
	public onClickRowActionButtons(row: any) {
		// edit hotel guest offer
		if (this.buttonType === 1) {
			this.changePageView(row);
		}

		// delete hotel guest offer
		if (this.buttonType === 2) {
			this._guestOfferService.guestRemoveOffer(row, this.refresh);
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
		this.changeOffersView.emit(payload);
	}
}
