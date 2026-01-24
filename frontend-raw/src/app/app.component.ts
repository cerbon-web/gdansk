import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend Raw';
  private apiMessageSubject = new BehaviorSubject<string | null>(null);
  apiMessage$ = this.apiMessageSubject.asObservable();

  constructor(private http: HttpClient, private translate: TranslateService) {
    // configure ngx-translate
    translate.addLangs(['en', 'pl', 'tr', 'ru', 'ar']);
    // make Arabic the default language
    translate.setDefaultLang('ar');
    const browserLang = (navigator.language || 'ar').split('-')[0];
    // prefer browser language when supported, otherwise default to Arabic
    const startLang = ['en','pl','tr','ru','ar'].includes(browserLang) ? browserLang : 'ar';
    translate.use(startLang);
    const isRtl = (startLang === 'ar');
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    if (isRtl) document.documentElement.classList.add('rtl');
  }

  callTest(): void {
    console.log('callTest invoked');
    this.apiMessageSubject.next(this.translate.instant('CALLING'));
    this.http.get('https://api.cerbon.id/gdansk/test', { responseType: 'text' }).subscribe({
      next: (text: string) => {
        console.log('API success', text);
        this.apiMessageSubject.next(this.translate.instant('OK', {0: text}));
      },
      error: (err) => {
        console.error('API call failed', err);
        this.apiMessageSubject.next(this.translate.instant('ERROR', {0: err?.message ?? err}));
      },
      complete: () => console.log('API request completed')
    });
  }
}
