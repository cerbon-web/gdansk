import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideRouter } from '@angular/router';
import { canActivateSuper } from './app/super.guard';
import { canActivateContester } from './app/quran.guard';

export function HttpLoaderFactory(http: HttpClient) {
	const baseEl = document.getElementsByTagName('base')[0];
	const baseHref = baseEl ? baseEl.getAttribute('href') || '' : '';
	const prefix = (baseHref || '') + 'assets/i18n/';
	return new TranslateHttpLoader(http, prefix, '.json');
}

bootstrapApplication(AppComponent, {
	providers: [
		provideHttpClient(),
		// provide router for standalone bootstrap
		provideRouter([
			{ path: 'quran', loadComponent: () => import('./app/quran-contest.component').then(m => m.QuranContestComponent), canActivate: [canActivateContester] },
			{ path: 'daily', loadComponent: () => import('./app/daily-contest.component').then(m => m.DailyContestComponent), canActivate: [canActivateContester] },
			{ path: 'super', loadComponent: () => import('./app/super.component').then(m => m.SuperComponent), canActivate: [canActivateSuper] }
		]),
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
