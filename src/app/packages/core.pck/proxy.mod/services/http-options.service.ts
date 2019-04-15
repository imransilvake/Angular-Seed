// angular
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

// app
import { RequestHeaders } from '../../../../../app.config';

@Injectable()
export class HttpOptionsService {
	/**
	 * returns important headers for the request
	 *
	 * @param {Object} postBodyParams
	 * @returns {HttpHeaders}
	 */
	public getHeaders(postBodyParams?: Object): HttpHeaders {
		const headerValues: { [s: string]: string } = (postBodyParams) ? RequestHeaders.post : RequestHeaders.get;
		let headers = new HttpHeaders();

		if (Object.keys(headerValues).length !== 0) {
			Object.keys(headerValues).forEach((key) => {
				headers = headers.set(key, headerValues[key]);
			});
		}

		return headers;
	}

	/**
	 * set HttpClient params
	 *
	 * @param {Object} bodyParams
	 * @returns {HttpParams}
	 */
	public getBodyParams(bodyParams: Object): HttpParams {
		let httpParams = new HttpParams();

		if (Object.keys(bodyParams).length !== 0) {
			// set params
			Object.keys(bodyParams).forEach((key) => {
				httpParams = httpParams.set(key, bodyParams[key]);
			});
		}

		return httpParams;
	}

	/**
	 * adds matrix parameter(s) to the given url
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
}
