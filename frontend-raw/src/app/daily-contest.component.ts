import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily-contest',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './daily-contest.component.html',
  styleUrls: ['./daily-contest.component.css']
})
export class DailyContestComponent {
  constructor(private router: Router) {}

  onBack(): void {
    try { this.router.navigate(['/']); } catch { /* ignore */ }
  }
}
