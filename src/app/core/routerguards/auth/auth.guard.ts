import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateChildFn, Router } from '@angular/router';
import { GuardService } from '../service/guard.service';


export const authGuard: CanActivateChildFn = (childRoute, state) => {

  const guardService = inject(GuardService);
  const router = inject(Router);
  const route = inject(ActivatedRoute);

  const pollId = childRoute.params['id'];

  const token = localStorage.getItem('authToken');

  if (!token) {
    return router.createUrlTree(['/login'], {
      queryParams: { pollId }
    });
  }

  return true;

};
