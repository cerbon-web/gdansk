import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

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

  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();

  private readonly STORAGE_KEY = 'auth_session';

  constructor(private http: HttpClient, private translate: TranslateService) {
    // try to restore session from localStorage
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && obj.authenticated) {
          this.authenticatedSubject.next(true);
          this.rolesSubject.next(obj.roles || ['guest']);
          if (obj.token) {
            this._token = String(obj.token);
          }
          if (obj.username) {
            this.usernameSubject.next(String(obj.username));
            this._username = String(obj.username);
          }
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
      // store token if provided
      const token = resp && resp.token ? String(resp.token) : undefined;
      if (token) this._token = token;
      this._persistSession(true, roles as Role[], username, token);
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

  // Register a new user. On success behave like login: persist session and roles if returned.
  async register(username: string, password: string, name?: string, phone?: string): Promise<void> {
    const url = 'https://api.cerbon.id/islam.gdansk/register';
    try {
      const resp: any = await this.http.post(url, { username, password, name, phone }).toPromise();
      const roles: Role[] = Array.isArray(resp.roles) ? resp.roles : (resp.roles ? String(resp.roles).split(',').map((r: string) => r.trim()) : ['contester']);
      this.authenticatedSubject.next(true);
      this.rolesSubject.next(roles as Role[]);
      const token = resp && resp.token ? String(resp.token) : undefined;
      if (token) this._token = token;
      this._persistSession(true, roles as Role[], username, token);
      return;
    } catch (e) {
      try {
        const err: any = e as any;
        const rawMsg = err?.error?.error || err?.message || 'Registration failed';
        const isKey = /^[A-Z0-9_\.]+$/.test(String(rawMsg)) && String(rawMsg).indexOf('.') >= 0;
        if (isKey) {
          // translate the specific server key (e.g. REGISTER.EXISTS)
          const translated = this.translate.instant(String(rawMsg));
          const display = typeof translated === 'string' ? translated : String(rawMsg);
          return Promise.reject(new Error(display));
        }
        // Generic fallback: show a user-friendly registration-failed message
        const fallback = this.translate.instant('REGISTER.FAILED');
        return Promise.reject(new Error(typeof fallback === 'string' ? fallback : 'Registration failed'));
      } catch (_) {
        const fallback = this.translate.instant('REGISTER.FAILED');
        return Promise.reject(new Error(typeof fallback === 'string' ? fallback : 'Registration failed'));
      }
    }
  }

  // Note: dev user localStorage helpers removed; backend is authoritative

  logout(): void {
    this.authenticatedSubject.next(false);
    this.rolesSubject.next(['guest']);
    this._token = undefined;
    this._username = undefined;
    try { this.usernameSubject.next(null); } catch {}
    try { localStorage.removeItem(this.STORAGE_KEY); } catch { }
  }

  // helper for tests / dev: set roles
  _setRoles(roles: Role[]): void {
    this.rolesSubject.next(roles);
    try { this._persistSession(this.authenticatedSubject.value, roles); } catch { }
  }

  private _token?: string;

  private _username?: string;

  getToken(): string | undefined {
    return this._token;
  }

  private _persistSession(authenticated: boolean, roles: Role[], username?: string, token?: string): void {
    try {
      const obj: any = { authenticated, roles };
      if (username) obj.username = username;
      if (token) obj.token = token;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(obj));
      this._username = username;
      try { this.usernameSubject.next(username ? String(username) : null); } catch {}
    } catch (e) { /* ignore */ }
  }
}
