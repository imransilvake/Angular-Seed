// angular
import { EventEmitter, Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { HttpErrorResponse } from '@angular/common/http';
import { delay, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

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
	public appState;
	public dataEmitter: BehaviorSubject<any> = new BehaviorSubject(0);
	public profileImageUpdate: EventEmitter<boolean> = new EventEmitter();

	constructor(
		private _loadingAnimationService: LoadingAnimationService,
		private _proxyService: ProxyService,
		private _authService: AuthService,
		private _i18n: I18n,
		private _dialogService: DialogService,
		private _store: Store<{ ErrorHandler: ErrorHandlerInterface }>
	) {
	}

	/**
	 * refresh user profile
	 */
	public memberFetchProfile() {
		// payload
		const payload = {
			ID: this.currentUser.profile.sub
		};

		// service
		return this._proxyService
			.getAPI(AppServices['Member']['Profile_List'], { queryParams: payload })
			.pipe(map(res => res));
	}

	/**
	 * update user profile
	 *
	 * @param formPayload
	 * @param refreshEmitter
	 */
	public memberUpdateProfile(formPayload: UpdateProfileInterface, refreshEmitter: any) {
		// payload
		const payload = {
			...formPayload,
			accessToken: this.currentUser.credentials.accessToken
		};

		// service
		this._proxyService
			.postAPI(AppServices['Member']['Profile_Update'], { bodyParams: payload })
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
				this._dialogService
					.showDialog(dialogPayload)
					.pipe(delay(200))
					.subscribe(() => refreshEmitter.emit());
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
			.postAPI(AppServices['Member']['Profile_Change_Password'], { bodyParams: payload })
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
						this._authService.authLogoutUser();
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
			accessToken: this.currentUser.credentials.accessToken,
			image: imageSrc
		};

		// service
		this._proxyService.postAPI(AppServices['Utilities']['Profile_Image_Change'], { bodyParams: payload })
			.subscribe(res => {
				if (res) {
					// payload
					const dialogPayload = {
						type: DialogTypeEnum.NOTICE,
						payload: {
							icon: 'dialog_tick',
							message: this._i18n({
								value: 'Description: Profile Image Updated',
								id: 'Member_Profile_UpdateProfileImage_Success_Description'
							}),
							buttonTexts: [this._i18n({ value: 'Button - OK', id: 'Common_Button_OK' })]
						}
					};

					// dialog service
					this._dialogService.showDialog(dialogPayload)
						.subscribe(() => {
							// get current user state
							// set image to current user state
							const data = this.currentUser;
							this._authService.currentUserState = {
								profile: {
									...data.profile,
									image: res.image
								},
								credentials: data.credentials,
								rememberMe: data.rememberMe,
								timestamp: data.timestamp
							};

							// send success status
							this.profileImageUpdate.emit(true);

							// close modal
							dialog.close();
						});
				}
			}, () => {
				// send error status
				this.profileImageUpdate.emit(false);
			});
	}
}
