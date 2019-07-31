// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { MemberService } from '../../../services/member.service';
import { UtilityService } from '../../../../../utilities.pck/accessories.mod/services/utility.service';

@Component({
	selector: 'app-hotels-list',
	templateUrl: './hotels-list.component.html',
	styleUrls: ['./hotels-list.component.scss']
})

export class HotelsListComponent implements OnInit, OnDestroy {
	public hotelList;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _memberService: MemberService,
		private _utilityService: UtilityService
	) {
	}

	ngOnInit() {
		// listen: profile data event
		this._memberService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && res.memberProfile) {
					// hotel list
					const hotelIds = res.memberProfile.HotelIDs;
					if (hotelIds[0]) {
						// payload
						const payload = {
							pathParams: { groupId: hotelIds[0].split('_')[0] },
							queryParams: { 'HotelIDs[]': hotelIds }
						};

						// fetch assigned hotels
						this._utilityService.getHotelListByGroup(payload)
							.pipe(takeUntil(this._ngUnSubscribe))
							.subscribe(result => this.hotelList = result.items);
					}

				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}
}
