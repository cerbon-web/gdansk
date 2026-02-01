import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

export const canActivateContester: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  try {
    const roles = await firstValueFrom(auth.roles$);
    const ok = Array.isArray(roles) && roles.includes('contester' as any);
    if (ok) return true;
  } catch (_) {
    // ignore and fallthrough to redirect
  }
  try { router.navigate(['/']); } catch { /* noop */ }
  return false;
};
