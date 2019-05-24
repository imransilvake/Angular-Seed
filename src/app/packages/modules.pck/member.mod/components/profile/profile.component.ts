// angular
import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { MemberService } from '../../services/member.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnDestroy {
	public navigationSubscription;
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _memberService: MemberService
	) {
		this.navigationSubscription = this.router.events
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe((e: any) => {
				if (e instanceof NavigationEnd) {
					// member profile data
					this._memberService.memberFetchProfile();
				}
			});
	}

	ngOnDestroy() {
		// avoid memory leaks.
		this.navigationSubscription.unsubscribe();

		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}
}
