// angular
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';

// app
import { AppOptions, AppServices } from '../../../../../app.config';
import { GuestTypeEnum } from '../enums/guest-type.enum';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';

@Injectable()
export class GuestOfferService {
	public currentUser;
	public appState;
	public tableServices;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);

	constructor(
		private _proxyService: ProxyService
	) {
	}

	/**
	 * fetch active hotel offers
	 *
	 * @param id
	 */
	public guestHotelOffersFetch(id: number) {
		if (id) {
			return of(null);
		}

		// api
		const api = AppServices['Guest']['Guest_Offer_And_Notifications_List_Hotel'];

		// payload
		let payload: any = {
			pathParams: {
				groupId: this.appState.groupId,
				hotelId: this.appState.hotelId
			},
			queryParams: {
				offset: 0,
				limit: AppOptions.tablePageSizeWithoutLimit,
				type: GuestTypeEnum.OFFER,
				column: 'CreateDate',
				sort: 'desc'
			}
		};

		// set table resources
		this.tableServices = {
			api: api,
			payload: payload,
			uniqueID: 'ID',
			sortDefaultColumn: 'CreateDate'
		};

		// service
		return this._proxyService.getAPI(api, payload)
			.pipe(map(res => res));
	}
}
