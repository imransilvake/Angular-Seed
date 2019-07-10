// angular
import { Component, OnDestroy } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

// app
import { MemberService } from '../../services/member.service';
import { AuthService } from '../../../authorization.mod/services/auth.service';
import { SidebarService } from '../../../../frame.pck/services/sidebar.service';

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
		private _memberService: MemberService,
		private _sidebarService: SidebarService
	) {
		// listen: router event
		this.router.events
			.pipe(
				takeUntil(this._ngUnSubscribe),
				filter(event => event instanceof NavigationEnd)
			)
			.subscribe(() => this.triggerServices());
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * trigger all components services
	 */
	private triggerServices() {
		// set current user state
		this._memberService.currentUser = this._authService.currentUserState;

		// set app state
		this._memberService.appState = this._sidebarService.appState;

		// refresh services
		forkJoin({
			memberProfile: this._memberService.memberFetchProfile()
		}).pipe(takeUntil(this._ngUnSubscribe)).subscribe(res => {
			const result = {
				memberProfile: res.memberProfile
			};

			// emit result
			this._memberService.dataEmitter.next(result);
		});
	}
}
