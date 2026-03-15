import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // isLoggedIn$ es un observable, así que devolvemos una función que resuelve el observable
  return authService.isLoggedIn$().pipe(
    map((isLoggedIn: boolean) => isLoggedIn ? true : router.createUrlTree(['/login']))
  );
};