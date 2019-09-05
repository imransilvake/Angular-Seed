// angular
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// amplify
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

// app
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// environment
if (environment.production) {
	enableProdMode();
}

// amplify
Amplify.configure(awsconfig);

// bootstrap app
platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.error(err));
