import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-super',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './super.component.html',
  styleUrls: ['./super.component.css']
})
export class SuperComponent {
  @Output() close = new EventEmitter<void>();

  closePanel(): void {
    this.close.emit();
  }
}
