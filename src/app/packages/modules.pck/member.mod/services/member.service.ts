// angular
import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// store
import { Store } from '@ngrx/store';

// app
import * as ErrorHandlerActions from '../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';
import { ProxyService } from '../../../core.pck/proxy.mod/services/proxy.service';
import { AppServices } from '../../../../../app.config';
import { AuthService } from '../../authorization.mod/services/auth.service';
import { UpdateProfileInterface } from '../interfaces/update-profile.interface';
import { LoadingAnimationService } from '../../../utilities.pck/loading-animation.mod/services/loading-animation.service';
import { DialogTypeEnum } from '../../../utilities.pck/dialog.mod/enums/dialog-type.enum';
import { DialogService } from '../../../utilities.pck/dialog.mod/services/dialog.service';
import { ErrorHandlerPayloadInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler-payload.interface';
import { ErrorHandlerInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';

@Injectable({ providedIn: 'root' })
export class MemberService {
	public userData;

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _proxyService: ProxyService,
		private _authService: AuthService,
		private _i18n: I18n,
		private _dialogService: DialogService,
		private _store: Store<{ ErrorHandler: ErrorHandlerInterface }>

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
	 *
	 * @param formPayload
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

				// payload
				const dialogPayload = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						title: this._i18n({ value: 'Title: Profile Updated', id: 'Member_Profile_Update_Form_Success_Title' }),
						message: this._i18n({
							value: 'Description: Profile Updated',
							id: 'Member_Profile_Update_Form_Success_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
					}
				};

				// dialog service
				this._dialogService.showDialog(dialogPayload).subscribe();
			}, (err: HttpErrorResponse) => {
				if (err.error.detail.code === 'NotAuthorizedException') {
					const errorPayload: ErrorHandlerPayloadInterface = {
						title: this._i18n({
							value: 'Title: Profile Update Error',
							id: 'Error_Member_Update_Profile_NotAuthorizedException_Title'
						}),
						message: this._i18n({
							value: 'Description: Profile Update Error',
							id: 'Error_Member_Update_Profile_NotAuthorizedException_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
					};
					this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(errorPayload));
				}

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
	}
}
