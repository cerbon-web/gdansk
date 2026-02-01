import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

export const canActivateSuper: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  try {
    const roles = await firstValueFrom(auth.roles$);
    const ok = Array.isArray(roles) && roles.includes('super' as any);
    if (ok) return true;
  } catch (_) {
    // ignore and fallthrough to redirect
  }
  // redirect unauthorized users to home
  try { router.navigate(['/']); } catch { /* noop */ }
  return false;
};
