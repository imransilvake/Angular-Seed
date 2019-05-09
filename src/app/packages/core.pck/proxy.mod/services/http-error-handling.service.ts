// angular
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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
import { ErrorHandlerInterface } from '../../../utilities.pck/error-handler.mod/interfaces/error-handler.interface';

@Injectable({ providedIn: 'root' })
export class HttpErrorHandlingService {
	constructor(
		private _store: Store<{ NotificationInterface: NotificationInterface, ErrorHandlerInterface: ErrorHandlerInterface }>,
		private _i18n: I18n
	) {
	}

	/**
	 * http error handling
	 *
	 * @param error
	 * @param apiType
	 */
	public handleErrors(error: HttpErrorResponse, apiType: string) {
		if (this.handleGeneralErrors(error)) {
			switch (apiType) {
				case HttpApiTypeEnum.GET:
					return this.handleGetErrors(error);
				case HttpApiTypeEnum.POST:
					return this.handlePostErrors(error);
			}
		}
	}

	/**
	 * handle general errors
	 *
	 * @param response
	 */
	private handleGeneralErrors(response) {
		let payload: ErrorHandlerPayloadInterface;
		if (!navigator.onLine) {
			// system error
			payload = {
				title: this._i18n({
					value: 'Title: Internet Connection Exception',
					id: 'Error_Internet_Connection_Title'
				}),
				message: this._i18n({
					value: 'Description: Internet Connection Exception',
					id: 'Error_Internet_Connection_Description'
				})
			};
			this._store.dispatch(new ErrorHandlerActions.ErrorHandlerSystem(payload));
			return false;
		}

		return true;
	}

	/**
	 * handle get api errors
	 *
	 * @param response
	 */
	private handleGetErrors(response) {
		let backendError: string;

		// check error type.
		if (response) {
			if (response.error instanceof ErrorEvent) {
				backendError = `An error occurred, <span>code:</span>${ response.status }, <span>Message:</span> ${ response.statusText }`;
			} else {
				backendError = `Backend Error, <span>code:</span> ${ response.status }, <span>Message:</span> ${ response.statusText }`;
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

		// return response
		return response;
	}

	/**
	 * handle post api errors
	 *
	 * @param response
	 */
	private handlePostErrors(response) {
		let payload: ErrorHandlerPayloadInterface;
		switch (response.status) {
			case 0:
				payload = {
					title: this._i18n({
						value: 'Title: Unknown Error Exception',
						id: 'Error_UnknownErrorException_Title'
					}),
					message: this._i18n({
						value: 'Description: Unknown Error Exception',
						id: 'Error_UnknownErrorException_Description'
					}),
					buttonTexts: [this._i18n({ value: 'Button - Close', id: 'Common_Button_Close' })]
				};
				this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
				break;
		}

		// return response
		return response;
	}
}
