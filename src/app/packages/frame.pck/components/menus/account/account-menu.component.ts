// angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// app
import { HelperService } from '../../../../utilities.pck/accessories.mod/services/helper.service';
import { faEnvelope, faPowerOff, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../modules.pck/authorization.mod/services/auth.service';
import { ROUTING } from '../../../../../../environments/environment';
import { DialogTypeEnum } from '../../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../../utilities.pck/dialog.mod/services/dialog.service';
import { LoadingAnimationService } from '../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { MemberService } from '../../../../modules.pck/member.mod/services/member.service';

@Component({
	selector: 'app-menu-account',
	templateUrl: './account-menu.component.html',
	styleUrls: ['./account-menu.component.scss']
})

export class AccountMenuComponent implements OnInit, OnDestroy {
	public routing = ROUTING;
	public faIcons = [faEnvelope, faUser, faPowerOff];
	public currentUser;
	public userName;
	public userNameLetters;

	private _ngUnSubscribe: Subject<void> = new Subject<void>();

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _authService: AuthService,
		private _memberService: MemberService,
		private _router: Router,
		private _dialogService: DialogService,
		private _i18n: I18n
	) {
	}

	ngOnInit() {
		this.currentUser = this._authService.currentUserState; // get current user state
		this.userName = HelperService.capitalizeString(this.currentUser.profile.name); // get user name
		this.userNameLetters = HelperService.getFirstLetter(this.userName); // get first letters of name

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
	 * stop propagation from active element
	 *
	 * @param event
	 */
	public onClickStopPropagationFromActiveElement(event) {
		HelperService.stopPropagationFromActiveElement(event);
	}

	/**
	 * stop propagation
	 *
	 * @param event
	 */
	public onClickStopPropagation(event) {
		HelperService.stopPropagation(event);
	}

	/**
	 * logout user
	 */
	public onClickLogout() {
		// dialog payload
		const data = {
			type: DialogTypeEnum.CONFIRMATION,
			payload: {
				icon: 'dialog_confirmation',
				title: this._i18n({ value: 'Title: Logout Confirmation', id: 'Logout_Confirmation_Title' }),
				message: this._i18n({ value: 'Description: Logout Confirmation', id: 'Logout_Confirmation_Description' }),
				buttonTexts: [
					this._i18n({
						value: 'Button - OK',
						id: 'Common_Button_OK'
					}),
					this._i18n({
						value: 'Button - Cancel',
						id: 'Common_Button_Cancel'
					}),
				]
			}
		};

		// listen: dialog service
		this._dialogService
			.showDialog(data)
			.pipe(takeUntil(this._ngUnSubscribe))
			.subscribe(res => {
				if (res) {
					// logout
					this._authService.logoutUser();
				}
			});
	}
}
