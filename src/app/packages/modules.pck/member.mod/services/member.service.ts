// angular
import { EventEmitter, Injectable } from '@angular/core';
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
import { ChangePasswordInterface } from '../interfaces/change-password.interface';

@Injectable({ providedIn: 'root' })
export class MemberService {
	public currentUser;
	public lastLogin: EventEmitter<string> = new EventEmitter();

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _proxyService: ProxyService,
		private _authService: AuthService,
		private _i18n: I18n,
		private _dialogService: DialogService,
		private _store: Store<{ ErrorHandler: ErrorHandlerInterface }>
	) {
		// get current user state
		this.currentUser = this._authService.currentUserState;
	}

	/**
	 * get user profile
	 *
	 * @param formFields
	 */
	public memberFetchProfile(formFields: FormGroup) {
		// payload
		const payload = {
			accessToken: this.currentUser.credentials.accessToken,
			userName: this.currentUser.profile.email
		};

		// service
		this._proxyService
			.postAPI(AppServices['Member']['Fetch_Profile'], { bodyParams: payload })
			.subscribe(res => {
				if (res) {
					// set forms fields
					formFields.get('salutation').setValue(res.gender);
					formFields.get('firstName').setValue(res.given_name);
					formFields.get('lastName').setValue(res.family_name);
					formFields.get('email').setValue(res.email);

					// set last login
					this.lastLogin.emit(res.lastLogin);
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
			accessToken: this.currentUser.credentials.accessToken
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
						icon: 'dialog_tick',
						title: this._i18n({ value: 'Title: Profile Updated', id: 'Member_Profile_UpdateProfile_Success_Title' }),
						message: this._i18n({
							value: 'Description: Profile Updated',
							id: 'Member_Profile_UpdateProfile_Success_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
					}
				};

				// dialog service
				this._dialogService.showDialog(dialogPayload).subscribe();
			}, (err: HttpErrorResponse) => {
				if (err.error.detail.code === 'NotAuthorizedException') {
					const errorPayload: ErrorHandlerPayloadInterface = {
						icon: 'error_icon',
						title: this._i18n({
							value: 'Title: Profile Update Error',
							id: 'Member_Profile_UpdateProfile_Error_Title'
						}),
						message: this._i18n({
							value: 'Description: Profile Update Error',
							id: 'Member_Profile_UpdateProfile_Error_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
					};
					this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(errorPayload));
				}

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
	}

	/**
	 * change user password
	 *
	 * @param formPayload
	 */
	public memberChangePassword(formPayload: ChangePasswordInterface) {
		// payload
		const payload = {
			...formPayload,
			accessToken: this.currentUser.credentials.accessToken
		};

		// service
		this._proxyService
			.postAPI(AppServices['Member']['Change_Password'], { bodyParams: payload })
			.subscribe(() => {
				// payload
				const dialogPayload = {
					type: DialogTypeEnum.NOTICE,
					payload: {
						icon: 'dialog_tick',
						title: this._i18n({ value: 'Title: Password Changed', id: 'Member_Profile_ChangePassword_Success_Title' }),
						message: this._i18n({
							value: 'Description: Password Changed',
							id: 'Member_Profile_ChangePassword_Success_Description'
						}),
						buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
					}
				};

				// dialog service
				// logout user
				this._dialogService
					.showDialog(dialogPayload)
					.subscribe(() => {
						// logout user
						this._authService.logoutUser();
					});
			}, (err: HttpErrorResponse) => {
				let errorPayload: ErrorHandlerPayloadInterface;
				switch (err.error.detail.code) {
					case 'NotAuthorizedException':
						errorPayload = {
							icon: 'error_icon',
							title: this._i18n({
								value: 'Title: Password Invalid Exception',
								id: 'Member_Profile_ChangePassword_Error_PasswordInvalid_Title'
							}),
							message: this._i18n({
								value: 'Description: Password Invalid Exception',
								id: 'Member_Profile_ChangePassword_Error_PasswordInvalid_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
						};
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(errorPayload));
						break;
					case 'LimitExceededException':
						errorPayload = {
							icon: 'error_icon',
							title: this._i18n({
								value: 'Title: Limit Exceed Exception',
								id: 'Member_Profile_ChangePassword_Error_LimitExceeded_Title'
							}),
							message: this._i18n({
								value: 'Description: Limit Exceed Exception',
								id: 'Member_Profile_ChangePassword_Error_LimitExceeded_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
						};
						this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(errorPayload));
						break;
				}

				// stop loading animation
				this._loadingAnimationService.stopLoadingAnimation();
			});
	}

	/**
	 * upload image to the database
	 *
	 * @param imageSrc
	 * @param dialog
	 */
	public memberChangeImage(imageSrc: string, dialog: any) {
		// payload
		const payload = {
			user_avatar: imageSrc
		};

		this._proxyService.postAPI(AppServices['Member']['Change_Image'], { bodyParams: payload })
			.subscribe(res => {
				// todo change image on profile and here page.

				// close modal
				dialog.close();
			});
	}
}
