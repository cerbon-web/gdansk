import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

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

  private usersSubject = new BehaviorSubject<UserItem[]>([]);
  users$ = this.usersSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    const token = this.auth.getToken();
    console.debug('[UsersComponent] token:', token);
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    const url = 'https://api.cerbon.id/islam.gdansk/users';
    this.http.get<UserItem[]>(url, { headers }).subscribe({
      next: (data) => {
        // backend returns { users: [...] }
        if ((data as any) && Array.isArray((data as any).users)) {
          this.usersSubject.next((data as any).users);
        } else {
          this.usersSubject.next(Array.isArray(data) ? data : []);
        }
        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.loadingSubject.next(false);
        console.debug('[UsersComponent] fetch error:', err);
        try { this.errorSubject.next(err?.error?.error || err?.message || 'ERROR.INTERNAL'); } catch { this.errorSubject.next('ERROR.INTERNAL'); }
      }
    });
  }

  closePanel(): void { try { this.router.navigate(['/super']); } catch { /* ignore */ } }
}
