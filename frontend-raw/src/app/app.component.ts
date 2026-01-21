import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend Raw';
  private apiMessageSubject = new BehaviorSubject<string | null>(null);
  apiMessage$ = this.apiMessageSubject.asObservable();

  constructor(private http: HttpClient) {}

  callTest(): void {
    console.log('callTest invoked');
    this.apiMessageSubject.next('Calling...');
    this.http.get('https://api.cerbon.id/gdansk/test', { responseType: 'text' }).subscribe({
      next: (text: string) => {
        console.log('API success', text);
        this.apiMessageSubject.next(`OK: ${text}`);
      },
      error: (err) => {
        console.error('API call failed', err);
        this.apiMessageSubject.next(`Error: ${err?.message ?? err}`);
      },
      complete: () => console.log('API request completed')
    });
  }
}
