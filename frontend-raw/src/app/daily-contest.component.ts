import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-daily-contest',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './daily-contest.component.html',
  styleUrls: ['./daily-contest.component.css']
})
export class DailyContestComponent {
  @Output() close = new EventEmitter<void>();

  onBack(): void {
    this.close.emit();
  }
}
