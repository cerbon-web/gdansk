import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quran-contest',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './quran-contest.component.html',
  styleUrls: ['./quran-contest.component.css']
})
export class QuranContestComponent {
  constructor(private router: Router) {}

  onBack(): void {
    try { this.router.navigate(['/']); } catch { /* ignore */ }
  }
}
