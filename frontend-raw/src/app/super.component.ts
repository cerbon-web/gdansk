import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-super',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './super.component.html',
  styleUrls: ['./super.component.css']
})
export class SuperComponent {
  constructor(private router: Router) {}

  closePanel(): void {
    // navigate back to home
    try { this.router.navigate(['/']); } catch { /* no-op */ }
  }

  open(name: string): void {
    // navigate to routed targets
    try {
      if (name === 'users') {
        this.router.navigate(['/users']);
        return;
      }
      // fallback: go home
      this.router.navigate(['/']);
    } catch { /* no-op */ }
  }
}
