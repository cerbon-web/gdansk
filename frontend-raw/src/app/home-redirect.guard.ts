import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

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
