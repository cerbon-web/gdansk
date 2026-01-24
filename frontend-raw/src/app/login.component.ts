import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();
  messageKey: string | null = null;

  onLogin(): void {
    this.messageKey = 'LOGIN.NOT_IMPLEMENTED';
    // show message briefly then close
    setTimeout(() => this.doClose(), 700);
  }

  onCancel(): void {
    this.doClose();
  }

  private doClose(): void {
    this.close.emit();
  }
}
