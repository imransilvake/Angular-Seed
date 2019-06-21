// angular
import { Component, OnDestroy } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

// app
import { MemberService } from '../../services/member.service';
import { AuthService } from '../../../authorization.mod/services/auth.service';
import { StorageTypeEnum } from '../../../../core.pck/storage.mod/enums/storage-type.enum';
import { StorageService } from '../../../../core.pck/storage.mod/services/storage.service';

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
		private _storageService: StorageService
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

		// clear memory storage to get fresh data on refresh
		this._storageService.remove(null, StorageTypeEnum.MEMORY);

		// refresh member services
		forkJoin({
			memberProfile: this._memberService.memberFetchProfile()
		}).pipe(takeUntil(this._ngUnSubscribe)).subscribe(res => {
			const result = {
				memberProfile: res.memberProfile
			};

			// emit result
			this._memberService.memberDataEmitter.next(result);
		});
	}
}
