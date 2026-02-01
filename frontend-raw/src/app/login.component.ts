import { Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private messageKeySubject = new BehaviorSubject<string | null>(null);
  messageKey$ = this.messageKeySubject.asObservable();

  private serverErrorSubject = new BehaviorSubject<string | null>(null);
  serverError$ = this.serverErrorSubject.asObservable();
  username = '';
  password = '';
  loading = false;
  // signup fields
  activeTab: 'login' | 'signup' = 'login';
  signupUsername = '';
  signupPassword = '';
  signupPassword2 = '';
  signupName = '';
  signupPhone = '';
  signupLoading = false;
  signupError: string | null = null;
  constructor(private auth: AuthService, private router: Router) {}

  onLogin(): void {
    this.messageKeySubject.next(null);
    this.serverErrorSubject.next(null);
    this.loading = true;
    this.auth.login(this.username, this.password).then(() => {
      this.loading = false;
      this.doClose();
    }).catch((err: any) => {
      this.loading = false;
      const m = err && err.message ? String(err.message) : null;
      if (!m) {
        this.serverErrorSubject.next('Unknown error');
        return;
      }
      // treat backend-returned dotted/uppercase codes as translation keys (e.g. LOGIN.INVALID)
      const isKey = /^[A-Z0-9_\.]+$/.test(m) && m.indexOf('.') >= 0;
      if (isKey) {
        this.messageKeySubject.next(m);
      } else {
        this.serverErrorSubject.next(m);
      }
    });
  }

  onCancel(): void {
    if (this.loading) return;
    this.doClose();
  }

  submitSignup(): void {
    this.signupError = null;
    if (!this.signupUsername || !this.signupPassword || !this.signupPassword2) {
      this.signupError = 'Please fill required fields';
      return;
    }
    if (this.signupPassword !== this.signupPassword2) {
      this.signupError = 'Passwords do not match';
      return;
    }
    this.signupLoading = true;
    this.auth.register(this.signupUsername, this.signupPassword, this.signupName, this.signupPhone).then(() => {
      this.signupLoading = false;
      this.doClose();
    }).catch((err: any) => {
      this.signupLoading = false;
      const m = err && err.message ? String(err.message) : 'Registration failed';
      this.signupError = m;
    });
  }

  private doClose(): void {
    // If opened via router (URL contains '/login') navigate home; otherwise emit close for modal usage
    try {
      const isRouted = !!(this.router && typeof this.router.url === 'string' && this.router.url.indexOf('/login') >= 0);
      if (isRouted) {
        this.router.navigate(['/']);
        return;
      }
    } catch {
      // fallback to emitting
    }
  }
}
