// angular
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';

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
	constructor(private _store: Store<NotificationInterface>) {
	}

	/**
	 * http error handling
	 *
	 * @param {HttpErrorResponse} error
	 * @param {string} apiType
	 * @returns {any}
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
		const errorCode = response && response.status;
		let payload: ErrorHandlerPayloadInterface;

		// if status code exists.
		if (errorCode) {
			// error codes
			switch (errorCode) {
				case 401:
					payload = {
						title: 'bo.forms.agentlogin.login',
						message: response.error && response.error.errors[0] && response.error.errors[0].value,
						buttonTexts: ['bo.forms.agentlogin.close']
					};
					break;
				default:
					if (response.statusText && response.message) {
						payload = {
							title: response.statusText,
							message: response.message,
							buttonTexts: ['bo.forms.agentlogin.close']
						};
					} else {
						console.error(`undefined error case: ${ errorCode }`);
					}
			}

			// dispatch action: error handler common
			if (payload) {
				this._store.dispatch(new ErrorHandlerActions.ErrorHandlerCommon(payload));
			}
		} else {
			console.error('undefined status code!');
		}

		// return an observable with a user-facing error message.
		return throwError('Something bad happened; please try again later or contact the developer.');
	}
}
