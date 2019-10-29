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
		identityPoolId: 'eu-central-1:52519fab-2477-47aa-8112-1b2406b552d7',
		region: 'eu-central-1',
		userPoolId: 'eu-central-1_okViFvvPn',
		userPoolWebClientId: '1gp9m9i1475urd1kt0v6tubobf'
	},
	Storage: {
		AWSS3: {
			bucket: 'rabt-partner-portal',
			region: 'eu-central-1'
		}
	}
});

// bootstrap app
platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.error(err));
