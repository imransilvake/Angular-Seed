// angular
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

// app
import * as moment from 'moment';
import { HttpErrorHandlingService } from '../services/http-error-handling.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
	constructor(private _httpErrorHandlingService: HttpErrorHandlingService) {
	}

	/**
	 * http error handling interceptor
	 *
	 * @param req
	 * @param next
	 */
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const started = moment().valueOf();
		let status = 'failed';

		return next.handle(req)
			.pipe(
				tap(
					// Succeeds when there is a response; ignore other events
					event => status = event instanceof HttpResponse ? 'succeeded' : 'other events',

					// Operation failed; error is an HttpErrorResponse
					error => this._httpErrorHandlingService.handleErrors(error, req.method)
				),

				// Logging
				finalize(() => {
					const elapsed = moment().subtract(started, 'milliseconds');
					const message = `${ req.method } "${ req.urlWithParams }" ${ status } in ${ elapsed } ms.`;
				})
			);
	}
}
