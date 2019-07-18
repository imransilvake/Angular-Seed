// angular
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

// app
import { GuestPushMessageViewInterface } from '../../../interfaces/guest-push-message-view.interface';
import { AppViewTypeEnum } from '../../../../../utilities.pck/accessories.mod/enums/app-view-type.enum';

@Component({
	selector: 'app-offer-list',
	templateUrl: './offer-list.component.html',
	styleUrls: ['./offer-list.component.scss']
})

export class OfferListComponent implements OnInit, OnDestroy {
	@Output() changeOffersView: EventEmitter<any> = new EventEmitter();

	public guestOffersList;
	public guestOffersTable;
	private buttonType;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor() {
	}

	ngOnInit() {
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
	}

	/**
	 * delete guest hotel offer
	 */
	public onClickDeleteGuestHotelOffer() {
	}

	/**
	 * action buttons
	 *
	 * @param row
	 */
	public onClickRowActionButtons(row: any) {

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
