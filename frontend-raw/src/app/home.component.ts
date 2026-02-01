import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private auth: AuthService, private router: Router) {}

  openQuran(): void {
    if (this.auth.isAuthenticated()) {
      try { this.router.navigate(['quran']); } catch { /* ignore */ }
    } else {
      try { this.router.navigate(['login']); } catch { /* ignore */ }
    }
  }

  openDaily(): void {
    if (this.auth.isAuthenticated()) {
      try { this.router.navigate(['daily']); } catch { /* ignore */ }
    } else {
      try { this.router.navigate(['login']); } catch { /* ignore */ }
    }
  }
}
