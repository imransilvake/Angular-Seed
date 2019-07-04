// angular
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

// app
import { LocalStorageItems, RequestHeaders, SessionStorageItems } from '../../../../../app.config';
import { StorageService } from '../../storage.mod/services/storage.service';
import { StorageTypeEnum } from '../../storage.mod/enums/storage-type.enum';

@Injectable({ providedIn: 'root' })
export class HttpOptionsService {
	constructor(private _storageService: StorageService) {
	}

	/**
	 * returns important headers for the request
	 *
	 * @param {Object} postBodyParams
	 * @returns {HttpHeaders}
	 */
	public getHeaders(postBodyParams?: Object): HttpHeaders {
		const headerValues: { [s: string]: string } = (postBodyParams) ? RequestHeaders.post : RequestHeaders.get;
		let headers = new HttpHeaders();

		// request headers defined in app config file
		if (Object.keys(headerValues).length !== 0) {
			Object.keys(headerValues).forEach((key) => {
				headers = headers.set(key, headerValues[key]);
			});
		}

		// add access token to the headers
		headers = this.addAccessToken(headers);

		return headers;
	}

	/**
	 * adds query parameter to the given url
	 * example: http://www.example.com/example-page?field1=value1&field2=value2&field3=value3
	 *
	 * @param url
	 * @param queryParams
	 */
	public addQueryParamsToUrl(url: string, queryParams: Object) {
		let params = '';
		let firstItem = true;

		if (queryParams !== null && Object.keys(queryParams).length !== 0) {
			for (const key in queryParams) {
				if (queryParams.hasOwnProperty(key)) {
					// set ? at start and & for the rest
					if (firstItem) {
						params = '?';
						firstItem = false;
					} else {
						params = params + '&';
					}

					// logic
					if (queryParams[key] instanceof Array) {
						let nestedFirstItem = false;
						queryParams[key].forEach((value) => {
							if (nestedFirstItem) {
								params = '?';
								nestedFirstItem = false;
							} else {
								params = params + '&';
							}

							params = params.concat(key)
								.concat('=')
								.concat(value);

						});
					} else {
						params = params.concat(key)
							.concat('=')
							.concat(queryParams[key]);
					}

				}
			}
		}

		return url + params;
	}

	/**
	 * adds matrix parameter(s) to the given url
	 * example: http://www.example.com/example-page;field1=value1;field2=value2;field3=value3
	 *
	 * @param {string} url
	 * @param {Object} matrixParams
	 * @returns {string}
	 */
	public addMatrixParamsToUrl(url: string, matrixParams: Object): string {
		if (Object.keys(matrixParams).length !== 0) {
			let params = '';

			// set matrix params to url
			Object.keys(matrixParams).forEach((key) => {
				params = params.concat(';').concat(key).concat('=').concat(matrixParams[key]);
			});

			url = url + params;
		}

		return url;
	}

	/**
	 * adds path params
	 * example: path parameters are part of the endpoint itself and are not optional
	 * example: /customer/profile/reservation/:reservationId
	 * example: {reservationId} is a required path parameter
	 *
	 * @param pathParams
	 * @param url
	 */
	public static addPathParams(url: string, pathParams: Object): string {
		if (pathParams) {
			for (const param in pathParams) {
				if (pathParams.hasOwnProperty(param)) {
					url = url.replace(`:${ param }`, pathParams[param]);
				}
			}
		}

		return url;
	}

	/**
	 * add access token to the headers
	 *
	 * @param headers
	 */
	private addAccessToken(headers: HttpHeaders) {
		// current user
		const userState =
			this._storageService.get(LocalStorageItems.userState, StorageTypeEnum.PERSISTANT) ||
			this._storageService.get(SessionStorageItems.userState, StorageTypeEnum.SESSION);

		// add access token
		if (userState) {
			return headers.set('Authorization', userState.credentials.accessToken.toString());
		}

		return headers;
	}
}
