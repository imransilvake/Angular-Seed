// angular
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// app
import { HttpSecureInterceptorService } from './ensure-https.interceptor';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { HttpCachingInterceptor } from './http-caching.interceptor';

// http interceptor providers in outside-in order
export const HttpInterceptorProviders = [
	{ provide: HTTP_INTERCEPTORS, useClass: HttpSecureInterceptorService, multi: true },
	{ provide: HTTP_INTERCEPTORS, useClass: HttpCachingInterceptor, multi: true },
	{ provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
];
