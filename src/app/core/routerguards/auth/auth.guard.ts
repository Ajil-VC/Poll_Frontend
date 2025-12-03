import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { GuardService } from '../service/guard.service';


export const authGuard: CanActivateChildFn = (childRoute, state) => {

  const guardService = inject(GuardService);
  const router = inject(Router);

  const token = localStorage.getItem('authToken');

  if (!token) {
    return router.parseUrl('/login');
  }

  return true;

};
