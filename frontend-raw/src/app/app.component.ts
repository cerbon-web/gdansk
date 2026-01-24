import { Component, OnInit } from '@angular/core';
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
  loading = false;
  initialized = false;
  errorMessage: string | null = null;
  private apiMessageSubject = new BehaviorSubject<string | null>(null);
  apiMessage$ = this.apiMessageSubject.asObservable();

  ngOnInit(): void {
    this.checkBackendConnectivity();
  }

  constructor(private http: HttpClient, private translate: TranslateService) {
    // configure ngx-translate
    translate.addLangs(['en', 'pl', 'tr', 'ru', 'ar']);
    // make Arabic the default language and always start in Arabic
    translate.setDefaultLang('ar');
    const startLang = 'ar';
    translate.use(startLang);
    const isRtl = true;
    document.documentElement.dir = 'rtl';
    document.documentElement.classList.add('rtl');
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
}
