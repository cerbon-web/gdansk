import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './header.component';
import { LoginComponent } from './login.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TranslateModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend Raw';
  loading = false;
  initialized = false;
  errorMessage: string | null = null;
  private apiMessageSubject = new BehaviorSubject<string | null>(null);
  apiMessage$ = this.apiMessageSubject.asObservable();
  createdAt: string | null = null;
  createdYear: string | null = null;
  showLogin = false;

  ngOnInit(): void {
    this.checkBackendConnectivity();
  }

  constructor(private http: HttpClient, private translate: TranslateService, private titleService: Title) {
    // configure ngx-translate
    translate.addLangs(['en', 'pl', 'tr', 'ru', 'ar']);
    // make Arabic the default language but prefer saved selection in localStorage
    translate.setDefaultLang('ar');
    const saved = (() => { try { return localStorage.getItem('lang'); } catch { return null; } })();
    const startLang = saved && ['en','pl','tr','ru','ar'].includes(saved) ? saved : 'ar';
    translate.use(startLang);
    const isRtl = (startLang === 'ar');
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    if (isRtl) document.documentElement.classList.add('rtl'); else document.documentElement.classList.remove('rtl');
    // set document title from translations and update on language change
    this.setTranslatedTitle();
    this.translate.onLangChange.subscribe(() => this.setTranslatedTitle());
  }

  private setTranslatedTitle(): void {
    this.translate.get('TITLE').subscribe((t: string) => {
      // update Angular Title service (also updates document.title)
      try { this.titleService.setTitle(t); } catch { document.title = t; }
    });
  }

  private formatIsoLocal(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  }

  checkBackendConnectivity(): void {
    console.log('checkBackendConnectivity invoked');
    this.loading = true;
    this.errorMessage = null;
    // clear previous API message so old errors don't remain visible under the loading text
    this.apiMessageSubject.next(null);
    // show loading via template's translate pipe; avoid setting translated text here
    this.http.get('https://api.cerbon.id/gdansk/test', { responseType: 'text' }).subscribe({
      next: (text: string) => {
        console.log('API success', text);
        this.loading = false;
        this.initialized = true;
        this.translate.get('OK', { value: text }).subscribe((t: string) => this.apiMessageSubject.next(t));
        // try to parse backend JSON and extract time/year
        try {
          const obj = JSON.parse(text);
          if (obj && obj.time) {
            const d = new Date(obj.time);
            if (!isNaN(d.getTime())) {
              this.createdYear = String(d.getFullYear());
              this.createdAt = this.formatIsoLocal(d);
            } else {
              this.createdAt = obj.time;
            }
          }
        } catch (e) {
          // not JSON — ignore
        }
      },
      error: (err) => {
        console.error('API call failed', err);
        this.loading = false;
        this.initialized = false;
        this.translate.get('ERROR', { value: err?.message ?? err }).subscribe((t: string) => {
          this.errorMessage = t;
          this.apiMessageSubject.next(t);
        });
      },
      complete: () => {
        console.log('API request completed');
        this.loading = false;
      }
    });
  }

  openLogin(): void {
    this.showLogin = true;
  }

  onLoginClose(): void {
    this.showLogin = false;
  }
}
