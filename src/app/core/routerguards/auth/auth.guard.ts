import { inject } from '@angular/core';
import {  CanActivateChildFn, Router } from '@angular/router';

export const authGuard: CanActivateChildFn = (childRoute, state) => {

  const router = inject(Router);

  const pollId = childRoute.params['id'];

  const token = localStorage.getItem('authToken');

  if (!token) {
    return router.createUrlTree(['/login'], {
      queryParams: { pollId }
    });
  }

  return true;

};
