// angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';

// app
import { HelperService } from '../../../../utilities.pck/accessories.mod/services/helper.service';
import { faEnvelope, faPowerOff, faUser, faUserLock } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../modules.pck/authorization.mod/services/auth.service';
import { ROUTING } from '../../../../../../environments/environment';
import { DialogTypeEnum } from '../../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../../utilities.pck/dialog.mod/services/dialog.service';
import { LoadingAnimationService } from '../../../../utilities.pck/loading-animation.mod/services/loading-animation.service';

@Component({
	selector: 'app-menu-account',
	templateUrl: './account-menu.component.html'
})

export class AccountMenuComponent {
	public routing = ROUTING;
	public faIcons = [faEnvelope, faUser, faUserLock, faPowerOff];
	public currentUser;

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _authService: AuthService,
		private _router: Router,
		private _dialogService: DialogService,
		private _i18n: I18n
	) {
		// get current user info
		this.currentUser = _authService.currentUserState;
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
		HelperService.stopPropagation();
	}

	/**
	 * navigate: lock screen
	 */
	public onClickLockScreen() {
		// navigate to lock
		this._router.navigate([ROUTING.authorization.lock]).then();
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

		// dialog service
		this._dialogService
			.showDialog(data)
			.subscribe(res => {
				if (res) {
					// logout
					this._authService.logoutUser();
				}
			});
	}
}
