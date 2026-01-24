import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Role = 'user' | 'admin' | 'guest';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.authenticatedSubject.asObservable();

  private rolesSubject = new BehaviorSubject<Role[]>(['guest']);
  roles$ = this.rolesSubject.asObservable();

  // scaffold: real implementation would call backend and set JWT etc.
  login(username: string, password: string): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }

  logout(): void {
    this.authenticatedSubject.next(false);
    this.rolesSubject.next(['guest']);
  }

  // helper for tests / dev: set roles
  _setRoles(roles: Role[]): void {
    this.rolesSubject.next(roles);
  }
}
