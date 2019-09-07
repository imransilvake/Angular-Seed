// angular
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, AsyncSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

// app
import { StorageService } from '../../storage.mod/services/storage.service';
import { StorageTypeEnum } from '../../storage.mod/enums/storage-type.enum';

@Injectable({ providedIn: 'root' })
export class HttpCachingInterceptor implements HttpInterceptor {
	constructor(private _storageService: StorageService) {
	}

	/**
	 * http caching interceptor (get requests)
	 *
	 * @param req
	 * @param next
	 */
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// before doing anything, it's important to only cache GET requests.
		// skip this interceptor if the request method isn't GET.
		if (req.method !== 'GET') {
			return next.handle(req);
		}

		// initialize values
		const subject = new AsyncSubject<HttpEvent<any>>();
		const cachedResponse = this._storageService.get(req.urlWithParams, StorageTypeEnum.MEMORY) || null;

		// return cached response if exists
		if (cachedResponse) {
			// send event
			subject.next(cachedResponse);
			subject.complete();
		} else {
			// no cached response exists. Go to the server for the response (data).
			next.handle(req)
				.pipe(
					tap(event => {
						// there may be other events besides the response
						if (event instanceof HttpResponse) {
							// put data in memory
							this._storageService.put(req.urlWithParams, event, StorageTypeEnum.MEMORY);

							// send event
							subject.next(event);
							subject.complete();
						}
					})
				)
				.subscribe();
		}

		return subject;
	}
}
