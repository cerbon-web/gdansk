import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from './auth.service';

interface UserItem {
  username: string;
  roles: string;
  created_at?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  users: UserItem[] = [];
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.error = null;
    const token = this.auth.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    const url = 'https://api.cerbon.id/islam.gdansk/users';
    this.http.get<UserItem[]>(url, { headers }).subscribe({
      next: (data) => {
        this.users = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        try { this.error = err?.error?.error || err?.message || 'ERROR.INTERNAL'; } catch { this.error = 'ERROR.INTERNAL'; }
      }
    });
  }

  closePanel(): void { this.close.emit(); }
}
