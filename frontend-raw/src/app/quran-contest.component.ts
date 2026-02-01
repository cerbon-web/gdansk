import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-quran-contest',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './quran-contest.component.html',
  styleUrls: ['./quran-contest.component.css']
})
export class QuranContestComponent {
  @Output() close = new EventEmitter<void>();

  onBack(): void {
    this.close.emit();
  }
}
