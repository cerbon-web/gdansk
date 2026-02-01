import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type Role = 'contester' | 'supervisor' | 'guest' | 'super';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.authenticatedSubject.asObservable();

  // synchronous accessor for current auth state
  isAuthenticated(): boolean {
    return this.authenticatedSubject.value;
  }

  private rolesSubject = new BehaviorSubject<Role[]>(['guest']);
  roles$ = this.rolesSubject.asObservable();

  private readonly STORAGE_KEY = 'auth_session';

  constructor(private http: HttpClient) {
    // try to restore session from localStorage
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && obj.authenticated) {
          this.authenticatedSubject.next(true);
          this.rolesSubject.next(obj.roles || ['guest']);
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // Call backend login endpoint; persist session on success
  async login(username: string, password: string): Promise<void> {
    const url = 'https://api.cerbon.id/islam.gdansk/login';
    try {
      const resp: any = await this.http.post(url, { username, password }).toPromise();
      const roles: Role[] = Array.isArray(resp.roles) ? resp.roles : (resp.roles ? String(resp.roles).split(',').map((r: string) => r.trim()) : ['contester']);
      this.authenticatedSubject.next(true);
      this.rolesSubject.next(roles as Role[]);
      this._persistSession(true, roles as Role[], username);
      return;
    } catch (e) {
      // try to extract server-provided error message
      try {
        const err: any = e as any;
        const msg = err?.error?.error || err?.message || 'Invalid username or password';
        return Promise.reject(new Error(String(msg)));
      } catch (_) {
        return Promise.reject(new Error('Invalid username or password'));
      }
    }
  }

  // Note: dev user localStorage helpers removed; backend is authoritative

  logout(): void {
    this.authenticatedSubject.next(false);
    this.rolesSubject.next(['guest']);
    try { localStorage.removeItem(this.STORAGE_KEY); } catch { }
  }

  // helper for tests / dev: set roles
  _setRoles(roles: Role[]): void {
    this.rolesSubject.next(roles);
    try { this._persistSession(this.authenticatedSubject.value, roles); } catch { }
  }

  private _persistSession(authenticated: boolean, roles: Role[], username?: string): void {
    try {
      const obj: any = { authenticated, roles };
      if (username) obj.username = username;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(obj));
    } catch (e) { /* ignore */ }
  }
}
