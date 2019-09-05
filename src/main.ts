// angular
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// amplify
import Amplify from 'aws-amplify';

// app
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// environment
if (environment.production) {
	enableProdMode();
}

// amplify
Amplify.configure({
	Auth: {
		// REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
		identityPoolId: 'eu-central-1:16551f3d-72da-4362-8f7d-babb99e2ea6f',

		// REQUIRED - Amazon Cognito Region
		region: 'eu-central-1'
	}
});

// bootstrap app
platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.error(err));
