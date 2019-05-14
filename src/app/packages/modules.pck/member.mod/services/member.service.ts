// angular
import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormGroup } from '@angular/forms';

// app
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AppServices } from '../../../../../app.config';
import { AuthService } from '../../authorization.mod/services/auth.service';
import { UpdateProfileInterface } from '../interfaces/update-profile.interface';
import { LoadingAnimationService } from '../../../utilities.pck/loading-animation.mod/services/loading-animation.service';

@Injectable({ providedIn: 'root' })
export class MemberService {
	public userData;

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _proxyService: ProxyService,
		private _authService: AuthService,
		private _i18n: I18n
	) {
		// get current user state
		this.userData = this._authService.currentUserState;
	}

	/**
	 * get user profile
	 *
	 * @param formFields
	 */
	public memberFetchProfile(formFields: FormGroup) {
		// payload
		const payload = {
			accessToken: this.userData.credentials.accessToken,
			userName: this.userData.profile.email
		};

		// service
		this._proxyService
			.postAPI(AppServices['Member']['Fetch_Profile'], { bodyParams: payload })
			.subscribe(res => {
				if (res) {
					formFields.get('salutation').setValue(res.gender);
					formFields.get('firstName').setValue(res.given_name);
					formFields.get('lastName').setValue(res.family_name);
					formFields.get('email').setValue(res.email);
				}
			});
	}

	/**
	 * update user profile
	 */
	public memberUpdateProfile(formPayload: UpdateProfileInterface) {
		// payload
		const payload = {
			...formPayload,
			accessToken: this.userData.credentials.accessToken
		};

		// service
		this._proxyService
			.postAPI(AppServices['Member']['Update_Profile'], { bodyParams: payload })
			.subscribe(() => {
				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
	}
}
