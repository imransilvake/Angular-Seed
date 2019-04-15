// angular
import { NgModule } from '@angular/core';

// app
import { ProxyService } from './services/proxy.service';
import { HttpOptionsService } from './services/http-options.service';
import { HttpErrorHandlingService } from './services/http-error-handling.service';

@NgModule({
	providers: [
		ProxyService,
		HttpOptionsService,
		HttpErrorHandlingService
	]
})

export class ProxyModule {
}
