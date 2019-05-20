// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import * as moment from 'moment';
import { AuthService } from '../../../../authorization.mod/services/auth.service';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';
import { MemberService } from '../../../services/member.service';

@Component({
	selector: 'app-profile-cover',
	templateUrl: './profile-cover.component.html',
	styleUrls: ['./profile-cover.component.scss']
})

export class ProfileCoverComponent implements OnInit, OnDestroy {
	public currentUser;
	public userName;
	public userNameLetters;
	public loginTime;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _authService: AuthService,
		private _memberService: MemberService
	) {
		// get current user state
		this.currentUser = this._authService.currentUserState;

		// get user name
		this.userName = HelperService.capitalizeString(this.currentUser.profile.name);

		// get first letters of name
		this.userNameLetters = HelperService.getFirstLetter(this.userName);
	}

	ngOnInit() {
		this._memberService
			.lastLogin
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				// set login time
				this.loginTime = moment(res).format('DD. MMMM. YYYY');
			});
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}
}
