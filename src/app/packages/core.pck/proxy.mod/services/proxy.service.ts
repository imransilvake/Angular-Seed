// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry, timeout } from 'rxjs/operators';

// app
import { ENV_SERVICE_URL } from '../../../../../environments/environment';
import { AppServicesInterface } from '../interfaces/app-services.interface';
import { RESTAPIConfig } from '../../../../../app.config';
import { HttpOptionsService } from './http-options.service';

@Injectable({ providedIn: 'root' })
export class ProxyService {
	constructor(
		private _http: HttpClient,
		private _httpOptionsService: HttpOptionsService
	) {
	}

	/**
	 * api: get
	 *
	 * @param service
	 * @param params
	 */
	public getAPI(service: AppServicesInterface, params?: any) {
		// set url
		let url = ENV_SERVICE_URL + service.serviceUrl;

		// add query params
		url = (params && params.queryParams) ? this._httpOptionsService.addQueryParamsToUrl(url, params.queryParams) : url;

		// add matrix params
		url = (params && params.matrixParams) ? this._httpOptionsService.addMatrixParamsToUrl(url, params.matrixParams) : url;

		// add path params
		url = (params && params.pathParams) ? this._httpOptionsService.addPathParams(url, params.pathParams) : url;

		// url encode
		url = encodeURI(url);

		// options
		const options = {
			headers: this._httpOptionsService.getHeaders(),
			responseType: (params && params.responseContentType ? params.responseContentType : 'json')
		};

		// api: get
		return this._http
			.get<any>(url, options)
			.pipe(
				retry(RESTAPIConfig.get.retry),
				timeout(RESTAPIConfig.get.timeout)
			);
	}

	/**
	 * api: post
	 *
	 * @param service
	 * @param params
	 */
	public postAPI(service: AppServicesInterface, params?: any) {
		// params
		const bodyParams = (params.singleBodyParam) ? params.singleBodyParam : params.bodyParams;

		// set url
		let url = ENV_SERVICE_URL + service.serviceUrl;

		// add query params
		url = (params.queryParams) ? this._httpOptionsService.addQueryParamsToUrl(url, params.queryParams) : url;

		// add matrix params
		url = (params.matrixParams) ? this._httpOptionsService.addMatrixParamsToUrl(url, params.matrixParams) : url;

		// add path params
		url = (params.pathParams) ? this._httpOptionsService.addPathParams(url, params.pathParams) : url;

		// url encode
		url = encodeURI(url);

		// options
		const options = {
			headers: this._httpOptionsService.getHeaders(params.singleBodyParam),
			responseType: (params.responseContentType ? params.responseContentType : 'json')
		};

		// api: post
		return this._http
			.post<any>(url, bodyParams, options)
			.pipe(timeout(RESTAPIConfig.get.timeout));
	}
}
