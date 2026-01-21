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
    translate.setDefaultLang('en');
    const browserLang = (navigator.language || 'en').split('-')[0];
    const startLang = ['en','pl','tr','ru','ar'].includes(browserLang) ? browserLang : 'en';
    translate.use(startLang);
    document.documentElement.dir = (startLang === 'ar') ? 'rtl' : 'ltr';
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
