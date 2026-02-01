import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule],
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
  private signupLoadingSubject = new BehaviorSubject<boolean>(false);
  signupLoading$ = this.signupLoadingSubject.asObservable();

  private signupErrorSubject = new BehaviorSubject<string | null>(null);
  signupError$ = this.signupErrorSubject.asObservable();

  signupForm!: FormGroup;
  submitted = false;
  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private translate: TranslateService, private fb: FormBuilder) {
    // initialize active tab from query param if present
    try {
      const qp = this.route.snapshot.queryParams || {};
      if (qp.tab === 'signup') this.activeTab = 'signup';
    } catch (e) {
      // ignore
    }
    // build signup form
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      password2: ['', [Validators.required]],
      name: [''],
      phone: ['', [Validators.pattern(/^[+\d][\d\s\-]{3,20}$/)]]
    }, { validators: this.passwordsMatch });
    // clear server error when user edits form
    this.signupForm.valueChanges.subscribe(() => this.signupErrorSubject.next(null));
  }

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
    this.signupErrorSubject.next(null);
    this.submitted = true;
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      // Let per-field messages show — do not set signupErrorSubject (reserved for server errors)
      return;
    }
    this.signupLoadingSubject.next(true);
    const v = this.signupForm.value;
    this.auth.register(v.username.trim(), v.password, v.name, v.phone).then(() => {
      this.signupLoadingSubject.next(false);
      this.signupErrorSubject.next(null);
      this.doClose();
    }).catch((err: any) => {
      this.signupLoadingSubject.next(false);
      // Safely stringify error-like objects (handles circular refs)
      const safeStringify = (v: any) => {
        try {
          const seen = new WeakSet();
          return JSON.stringify(v, function (_k, val) {
            if (val && typeof val === 'object') {
              if (seen.has(val)) return '[Circular]';
              seen.add(val);
            }
            return val;
          });
        } catch {
          try { return String(v); } catch { return '[unknown error]'; }
        }
      };

      // If this is an HTTP error with status, prefer a concise status message
      try {
        if (err && typeof err === 'object' && 'status' in err && typeof err.status === 'number') {
          const status = err.status;
          // network-level errors (server down / CORS / ECONNREFUSED) often surface as status 0
          if (status === 0) {
            this.signupErrorSubject.next('Network error: cannot reach backend (status 0)');
            return;
          }
          const statusText = err.statusText || '';
          // If body is HTML or generic text, avoid showing it raw — show a friendly message
          const body = err.error;
          if (typeof body === 'string' && body.trim().startsWith('<')) {
            const display = `HTTP ${status} ${statusText}`.trim();
            this.signupErrorSubject.next(display);
            return;
          }
          // If body is a string that looks like JSON, try to parse/extract
          if (typeof body === 'string') {
            try {
              const parsed = JSON.parse(body);
              if (parsed) err = { ...err, error: parsed };
            } catch {
              // keep body as-is
            }
          }
          // fallthrough to extract message from structured error
        }
      } catch {
        // ignore
      }

      // Extract candidate message from common shapes
      let candidate: any = err;
      if (err && typeof err === 'object') {
        candidate = err.error ?? err;
        if (candidate && typeof candidate === 'object') {
          if (typeof candidate.error === 'string') candidate = candidate.error;
          else if (typeof candidate.message === 'string') candidate = candidate.message;
        }
      }

      let rawMsg: string = typeof candidate === 'string' ? candidate : safeStringify(candidate);
      // Try to parse JSON string bodies and pick readable fields
      try {
        if (rawMsg && rawMsg.startsWith('{')) {
          const parsed = JSON.parse(rawMsg);
          if (parsed && typeof parsed === 'object') {
            if (typeof parsed.error === 'string') rawMsg = parsed.error;
            else if (typeof parsed.message === 'string') rawMsg = parsed.message;
            else {
              const entries = Object.entries(parsed).map(([k, v]) => `${k}: ${String(v)}`);
              if (entries.length) rawMsg = entries.join('; ');
            }
          }
        }
      } catch {
        // keep rawMsg as-is
      }

      // If backend returned a translation key like REGISTER.EXISTS, translate it; otherwise show raw message
      const isKey = /^[A-Z0-9_\.]+$/.test(String(rawMsg || '')) && String(rawMsg || '').indexOf('.') >= 0;
      const display = isKey ? String(this.translate.instant(String(rawMsg))) : String(rawMsg || `HTTP error`);
      this.signupErrorSubject.next(display);
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
  // passwords match validator for the group
  private passwordsMatch(c: AbstractControl): ValidationErrors | null {
    const p = c.get('password')?.value;
    const p2 = c.get('password2')?.value;
    return p === p2 ? null : { passwordsMismatch: true };
  }

  // extract first readable validation error
  getFirstSignupError(): string | null {
    const u = this.signupForm.get('username');
    if (u && u.touched && u.errors) {
      if (u.errors['required']) return 'Username is required';
      if (u.errors['minlength']) return 'Username must be at least 3 characters';
    }
    const pw = this.signupForm.get('password');
    if (pw && pw.touched && pw.errors) {
      if (pw.errors['required']) return 'Password is required';
      if (pw.errors['minlength'] || pw.errors['maxlength']) return 'Password must be between 3 and 15 characters';
    }
    const p2 = this.signupForm.get('password2');
    if (p2 && p2.touched && p2.errors) {
      if (p2.errors['required']) return 'Please confirm your password';
    }
    if (this.signupForm.errors && this.signupForm.errors['passwordsMismatch']) return 'Passwords do not match';
    const ph = this.signupForm.get('phone');
    if (ph && ph.touched && ph.errors) {
      if (ph.errors['pattern']) return 'Phone number is invalid';
    }
    return null;
  }
}
