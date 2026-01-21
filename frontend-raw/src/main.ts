import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
	const baseEl = document.getElementsByTagName('base')[0];
	const baseHref = baseEl ? baseEl.getAttribute('href') || '' : '';
	const prefix = (baseHref || '') + 'assets/i18n/';
	return new TranslateHttpLoader(http, prefix, '.json');
}

bootstrapApplication(AppComponent, {
	providers: [
		provideHttpClient(),
		// provide providers produced by TranslateModule.forRoot for standalone bootstrap
		...TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}).providers ?? []
	]
}).catch(err => console.error(err));
