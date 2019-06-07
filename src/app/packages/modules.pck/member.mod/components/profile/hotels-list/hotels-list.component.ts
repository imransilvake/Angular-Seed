// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { MemberService } from '../../../services/member.service';

@Component({
	selector: 'app-hotels-list',
	templateUrl: './hotels-list.component.html',
	styleUrls: ['./hotels-list.component.scss']
})

export class HotelsListComponent implements OnInit, OnDestroy {
	public hotelList;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(private _memberService: MemberService) {
	}

	ngOnInit() {
		// listen: profile data event
		this._memberService.memberDataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && res.memberProfile) {
					// group
					const groupId = res.memberProfile.GroupID;

					// hotel list
					const hotelIds = res.memberProfile.HotelIDs;

					// fetch assigned hotels
					this._memberService.memberFetchAssignedHotels(groupId, hotelIds)
						.subscribe(res => this.hotelList = res.items);
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}
}
