import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { firstValueFrom, map, take } from 'rxjs';
import { AuthService } from './auth.service';


// Separate guard for the legacy 'super' role (highest privilege)
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
  try { router.navigate(['/']); } catch { /* noop */ }
  return false;
};

// Allow only supervisors (used for admin-level routes)
export const canActivateSupervisor: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  try {
    const roles = await firstValueFrom(auth.roles$);
    const ok = Array.isArray(roles) && roles.includes('supervisor' as any);
    if (ok) return true;
  } catch (_) {
    // ignore and fallthrough to redirect
  }
  try { router.navigate(['/']); } catch { /* noop */ }
  return false;
};

// Allow contesters and supervisors (used for daily contest and quran contest pages)
export const canActivateContester: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  try {
    const roles = await firstValueFrom(auth.roles$);
    const ok = Array.isArray(roles) && (roles.includes('contester' as any) || roles.includes('supervisor' as any));
    if (ok) return true;
  } catch (_) {
    // ignore and fallthrough to redirect
  }
  try { router.navigate(['/']); } catch { /* noop */ }
  return false;
};

// Home redirect guard (moved here from home-redirect.guard.ts)
export const canActivateHomeRedirect: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.roles$.pipe(
    take(1),
    map(r => {
      const isSuper = Array.isArray(r) && r.includes('super' as any);
      return isSuper ? router.parseUrl('/super') : true;
    })
  );
};

export default null;
