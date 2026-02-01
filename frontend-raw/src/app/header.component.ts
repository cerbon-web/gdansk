import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() languageChanged = new EventEmitter<string>();
  @Output() superClicked = new EventEmitter<void>();
  isSuper = false;
  private subs: Subscription | null = null;

  constructor(private translate: TranslateService, public auth: AuthService) {
    // subscribe to roles to detect 'super'
    this.subs = this.auth.roles$.subscribe(r => {
      this.isSuper = Array.isArray(r) && r.includes('super' as any);
    });
  }

  logout(): void {
    this.auth.logout();
  }

  switch(lang: string) {
    // persist selection
    try { localStorage.setItem('lang', lang); } catch { /* ignore */ }
    this.translate.use(lang);
    // set dir for Arabic and toggle rtl class for styling
    const isRtl = (lang === 'ar');
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    if (isRtl) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
    this.languageChanged.emit(lang);
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
}
