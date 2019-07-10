// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';

// app
import { AuthService } from '../../../../authorization.mod/services/auth.service';
import { HelperService } from '../../../../../utilities.pck/accessories.mod/services/helper.service';
import { MemberService } from '../../../services/member.service';
import { ProfileUploadImageComponent } from './profile-upload-image.component';

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
	public userType;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _authService: AuthService,
		private _memberService: MemberService,
		public dialog: MatDialog
	) {
	}

	ngOnInit() {
		this.currentUser = this._memberService.currentUser; // get current user state

		// listen: profile data event
		this._memberService.dataEmitter
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res && res.memberProfile) {
					// set name
					this.userName = HelperService.capitalizeString(res.memberProfile.Name);
					this.userNameLetters = HelperService.getFirstLetter(this.userName); // get first letters of name

					// set last login
					this.loginTime = HelperService.getDateTime(
						this.currentUser.profile.language,
						res.memberProfile.LoginDate,
						'DD. MMMM YYYY'
					);

					// set user type
					this.userType = res.memberProfile.Type;
				}
			});

		// listen: on new image upload
		this._memberService.profileImageUpdate
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(() => this.currentUser = this._authService.currentUserState);
	}

	ngOnDestroy() {
		// remove subscriptions
		this._ngUnSubscribe.next();
		this._ngUnSubscribe.complete();
	}

	/**
	 * open upload image modal
	 */
	public onClickOpenImageModal() {
		this.dialog.open(ProfileUploadImageComponent, {
			width: '500px'
		});
	}
}
