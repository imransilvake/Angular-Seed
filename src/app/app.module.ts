// angular
import { LOCALE_ID, NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// app
import { APP_ROUTES } from './app-routing';
import { HttpInterceptorProviders } from './packages/core.pck/proxy.mod/http-interceptor';
import { AppComponent } from './app.component';
import { FrameModule } from './packages/frame.pck/frame.module';
import { FieldsModule } from './packages/core.pck/fields.mod/fields.module';
import { DialogModule } from './packages/utilities.pck/dialog.mod/dialog.module';

// i18n using polyfills
// provided by webpack
declare const require;

@NgModule({
	imports: [
		// angular
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		RouterModule.forRoot(APP_ROUTES, { onSameUrlNavigation: 'reload' }),

		// utilities
		DialogModule,

		// core
		FieldsModule,
		FrameModule
	],
	declarations: [
		AppComponent
	],
	providers: [
		I18n,
		{
			provide: TRANSLATIONS,
			useFactory: (locale) => {
				locale = locale || 'de';
				return require(`raw-loader!../locale/translation.${ locale }.xlf`);
			},
			deps: [LOCALE_ID]
		},
		{ provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
		HttpInterceptorProviders
	],
	bootstrap: [AppComponent]
})

export class AppModule {
}
