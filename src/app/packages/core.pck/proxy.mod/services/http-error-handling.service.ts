// angular
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// app
import { HttpApiTypeEnum } from '../enums/http-api-type.enum';

@Injectable({ providedIn: 'root' })
export class HttpErrorHandlingService {
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
		if (!navigator.onLine) {
			// system error
			console.log('network error')
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
				backendError = `An error occurred: <b>code:</b>${ response.status }, <b>Message:</b> ${ response.statusText }`;
			} else {
				backendError = `Get Method Error: <b>code:</b> ${ response.status }, <b>Message:</b> ${ response.statusText }`;
			}
		}

		// notification error
		if (backendError) {
			console.error('Get error');
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
		switch (response.status) {
			case 0:
			case 403:
				break;
		}

		// return response
		return response;
	}
}
