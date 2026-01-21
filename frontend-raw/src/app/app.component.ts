import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend Raw';
  apiMessage: string | null = null;

  callTest(): void {
    this.apiMessage = 'Calling...';
    fetch('http://api.cerbon.id/gdansk/test')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        this.apiMessage = `OK: ${text}`;
      })
      .catch((err) => {
        console.error('API call failed', err);
        this.apiMessage = `Error: ${err?.message ?? err}`;
      });
  }
}
