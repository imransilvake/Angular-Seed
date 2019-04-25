// angular
import { NgModule } from '@angular/core';

// app
import { SessionService } from './services/session.service';

@NgModule({
	providers: [
		SessionService
	]
})

export class SessionModule { }
