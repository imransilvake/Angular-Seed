// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// app
import { GuestPushMessageViewInterface } from '../../../interfaces/guest-push-message-view.interface';
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';
import { AppOptions } from '../../../../../../../app.config';
import { GuestOfferService } from '../../../services/guest-offer.service';

@Component({
	selector: 'app-offer-list',
	templateUrl: './offer-list.component.html',
	styleUrls: ['./offer-list.component.scss']
})

export class OfferListComponent implements OnInit, OnDestroy {
	@Output() changeOffersView: EventEmitter<any> = new EventEmitter();

	public guestOffersList;
	public guestOffersTable;
	public tablePageSizeWithoutLimit = AppOptions.tablePageSizeWithoutLimit;
	private buttonType;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _guestOfferService: GuestOfferService) {
	}

	ngOnInit() {
		// listen: fetch periodic & recently sent guest notifications
		this._guestOfferService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && res.activeHotelOffers) {
					// set tables resources
					this.guestOffersTable = {
						api: this._guestOfferService.tableServices.api,
						searchApi: this._guestOfferService.tableServices.api,
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
			id: data ? data.ID : null,
			data: data ? data : null
		};
		this.changeOffersView.emit(payload);
	}
}
