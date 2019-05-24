// angular
import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { MemberService } from '../../services/member.service';
import { AuthService } from '../../../authorization.mod/services/auth.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnDestroy {
	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private _authService: AuthService,
		private _memberService: MemberService
	) {
		// setup reload logic
		this.setupReload();
	}

	public setupReload() {
		this.router.events
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe((e: any) => {
				if (e instanceof NavigationEnd) {
					// set current user state
					this._memberService.currentUser = this._authService.currentUserState;

					// member profile data
					this._memberService.memberFetchProfile();
				}
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}
}
