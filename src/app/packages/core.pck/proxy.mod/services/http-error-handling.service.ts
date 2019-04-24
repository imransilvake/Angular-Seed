// angular
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { I18n } from '@ngx-translate/i18n-polyfill';
// store
import { Store } from '@ngrx/store';
// app
import * as NotificationActions from '../../../utilities.pck/notification.mod/store/actions/notification.actions';
import * as ErrorHandlerActions from '../../../utilities.pck/error-handler.mod/store/actions/error-handler.actions';
import { HttpApiTypeEnum } from '../enums/http-api-type.enum';
import { NotificationPayloadInterface } from '../../../utilities.pck/notification.mod/interfaces/notification-payload.interface';
import { NotificationInterface } from '../../../utilities.pck/notification.mod/interfaces/notification.interface';
import { ErrorHandlerPayloadInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler-payload.interface';

@Injectable({ providedIn: 'root' })
export class HttpErrorHandlingService {
	constructor(
		private _store: Store<NotificationInterface>,
		private _i18n: I18n
	) {
	}

	/**
	 * http error handling
	 *
	 * @param {HttpErrorResponse} error
	 * @param {string} apiType
	 * @returns {}
	 */
	public handleErrors(error: HttpErrorResponse, apiType: string) {
		let returnError: any;

		switch (apiType) {
			case HttpApiTypeEnum.GET:
				returnError = this.handleGetErrors(error);
				break;
			case HttpApiTypeEnum.POST:
				returnError = this.handlePostErrors(error);
				break;
		}

		return returnError;
	}

	/**
	 * handle get api errors
	 *
	 * @param response
	 * @returns {Observable<never>}
	 */
	private handleGetErrors(response) {
		let backendError: string;

		// check error type.
		if (response) {
			if (response.error instanceof ErrorEvent) {
				backendError = `An error occurred, <span>code:</span>${ response.status }, <span>Message:</span> ${ response.statusText }`;
				console.error('An error occurred:', response.message);
			} else {
				backendError = `Backend Error, <span>code:</span> ${ response.status }, <span>Message:</span> ${ response.statusText }`;
				console.error(`Backend returned code ${ response.status }, Message: ${ response.message }`);
			}
		}

		// dispatch action: notification error
		if (backendError) {
			const payload: NotificationPayloadInterface = {
				text: backendError,
				keepAfterNavigationChange: true
			};
			this._store.dispatch(new NotificationActions.NotificationError(payload));
		}

		// return an observable with a user-facing error message.
		return throwError('Something bad happened; please try again later or contact the developer.');
	}

	/**
	 * handle post api errors
	 *
	 * @param response
	 * @returns {Observable<never>}
	 */
	private handlePostErrors(response) {
		let payload: ErrorHandlerPayloadInterface;
		switch (response.error.code) {
			case 'InvalidParameterException':
				payload = {
					title: this._i18n({
						value: 'Title: Invalid Parameter Exception',
						id: 'Error_InvalidParameterException_Title'
					}),
					message: this._i18n({
						value: 'Description: Invalid Parameter Exception',
						id: 'Error_InvalidParameterException_Description'
					}),
					buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
				};

				// error dispatch
				this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
				break;
			case 'UserNotFoundException':
				payload = {
					title: this._i18n({
						value: 'Title: User Not Found Exception',
						id: 'Error_UserNotFoundException_Title'
					}),
					message: this._i18n({
						value: 'Description: User Not Found Exception',
						id: 'Error_UserNotFoundException_Description'
					}),
					buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
				};

				// error dispatch
				this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
				break;
			case 'UsernameExistsException':
				payload = {
					title: this._i18n({
						value: 'Title: User Exists Exception',
						id: 'Error_UsernameExistsException_Title'
					}),
					message: this._i18n({
						value: 'Description: User Exists Exception',
						id: 'Error_UsernameExistsException_Description'
					}),
					buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
				};

				// error dispatch
				this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
				break;
			case 'UserNotConfirmedException':
				payload = {
					title: this._i18n({
						value: 'Title: User Not Confirmed Exception',
						id: 'Error_UserNotConfirmedException_Title'
					}),
					message: this._i18n({
						value: 'Description: User Not Confirmed Exception',
						id: 'Error_UserNotConfirmedException_Description'
					}),
					buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
				};

				// error dispatch
				this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
				break;
			case 'NotAuthorizedException':
				payload = {
					title: this._i18n({
						value: 'Title: User Not Authorized Exception',
						id: 'Error_NotAuthorizedException_Title'
					}),
					message: this._i18n({
						value: 'Description: User Not Authorized Exception',
						id: 'Error_NotAuthorizedException_Description'
					}),
					buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
				};

				// error dispatch
				this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
				break;
			case 'CodeMismatchException':
				payload = {
					title: this._i18n({
						value: 'Title: Verification Code Exception',
						id: 'Error_CodeMismatchException_Title'
					}),
					message: this._i18n({
						value: 'Description: Verification Code Exception',
						id: 'Error_CodeMismatchException_Description'
					}),
					buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
				};

				// error dispatch
				this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
				break;
			default:
				payload = {
					title: this._i18n({
						value: 'Title: Error Generic',
						id: 'Error_Generic_Title'
					}),
					message: this._i18n({
						value: 'Description: Error Generic',
						id: 'Error_Generic_Description'
					}),
					buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
				};

				// error dispatch
				this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
		}

		// return an observable with a user-facing error message.
		return throwError('Something bad happened; please try again later or contact the developer.');
	}
}
