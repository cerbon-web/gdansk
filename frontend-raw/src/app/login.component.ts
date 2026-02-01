import { Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();
  private messageKeySubject = new BehaviorSubject<string | null>(null);
  messageKey$ = this.messageKeySubject.asObservable();

  private serverErrorSubject = new BehaviorSubject<string | null>(null);
  serverError$ = this.serverErrorSubject.asObservable();
  username = '';
  password = '';
  constructor(private auth: AuthService) {}

  onLogin(): void {
    this.messageKeySubject.next(null);
    this.serverErrorSubject.next(null);
    this.auth.login(this.username, this.password).then(() => {
      this.doClose();
    }).catch((err: any) => {
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
    this.doClose();
  }

  private doClose(): void {
    this.close.emit();
  }
}
