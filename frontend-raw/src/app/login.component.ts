import { Component, EventEmitter, Output } from '@angular/core';
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
  messageKey: string | null = null;
  username = '';
  password = '';
  constructor(private auth: AuthService) {}

  onLogin(): void {
    this.messageKey = null;
    this.auth.login(this.username, this.password).then(() => {
      this.doClose();
    }).catch(() => {
      this.messageKey = 'LOGIN.INVALID';
    });
  }

  onCancel(): void {
    this.doClose();
  }

  private doClose(): void {
    this.close.emit();
  }
}
