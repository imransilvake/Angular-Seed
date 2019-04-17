// angular
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpSecureInterceptorService implements HttpInterceptor {
	/**
	 * ensure https interceptor
	 *
	 * @param {HttpRequest<any>} req
	 * @param {HttpHandler} next
	 * @returns {Observable<HttpEvent<any>>}
	 */
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// clone request and replace 'http://' with 'https://' at the same time.
		const secureReq = req.clone({
			url: req.url.replace('http://', 'https://')
		});

		// send the cloned, "secure" request to the next handler.
		return next.handle(secureReq);
	}
}
