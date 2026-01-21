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
    // set dir for Arabic
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    this.languageChanged.emit(lang);
  }
}
