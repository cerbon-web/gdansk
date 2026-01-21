import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() languageChanged = new EventEmitter<string>();

  constructor(private translate: TranslateService) {}

  switch(lang: string) {
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
}
