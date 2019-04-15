// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry, timeout } from 'rxjs/operators';

// app
import { APP_URL, ENV_REST_SERVICE_URL } from '../../../../../environments/environment';
import { AppServicesInterface } from '../interfaces/app-services.interface';
import { RESTAPIConfig } from '../../../../../app.config';
import { HttpOptionsService } from './http-options.service';

@Injectable()
export class ProxyService {
	constructor(
		private _http: HttpClient,
		private _httpOptionsService: HttpOptionsService
	) {
	}

	/**
	 * api: get
	 *
	 * @param {AppServicesInterface} service
	 * @param {Object} params
	 * @param {string} urlParts
	 * @param {Object} matrixParams
	 * @returns {Observable<any>}
	 */
	public getAPI(service: AppServicesInterface, params?: Object, urlParts?: string, matrixParams?: Object) {
		// set url
		let url = APP_URL + ENV_REST_SERVICE_URL + service.serviceUrl;
		url = (urlParts) ? url + urlParts : url; // attach url part if exists
		url = (matrixParams) ? this._httpOptionsService.addMatrixParamsToUrl(url, matrixParams) : url;

		// get body params
		const bodyParams = (params) ? this._httpOptionsService.getBodyParams(params) : {};

		// options
		const options = {
			headers: this._httpOptionsService.getHeaders(),
			params: bodyParams
		};

		// api: get
		return this._http
			.get<any>(encodeURI(url), options)
			.pipe(
				retry(RESTAPIConfig.get.retry),
				timeout(RESTAPIConfig.get.timeout)
			);
	}

	/**
	 * api: post
	 *
	 * @param {AppServicesInterface} service
	 * @param {Object} params
	 * @returns {Observable<any>}
	 */
	public postAPI(service: AppServicesInterface, params?: Object) {
		// set url
		const url = APP_URL + ENV_REST_SERVICE_URL + service.serviceUrl;

		// get body params
		const bodyParams = this._httpOptionsService.getBodyParams(params);

		// options
		const options = {
			headers: this._httpOptionsService.getHeaders(params)
		};

		// api: post
		return this._http
			.post<any>(encodeURI(url), bodyParams, options)
			.pipe(timeout(RESTAPIConfig.get.timeout));
	}
}
