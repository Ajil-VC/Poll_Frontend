import { inject } from '@angular/core';
import { ResolveFn, Router, UrlTree } from '@angular/router';
import { ApiService } from '../../../shared/services/api/api.service';
import { AuthResponse } from '../../types/core.type';
import { Poll } from '../../types/poll.model';

export const pollResolver: ResolveFn<AuthResponse<Poll> | UrlTree> = (route, state) => {

  const api = inject(ApiService);
  const id = route.paramMap.get('id');
  const router = inject(Router);
  if (!id) {
    return router.parseUrl('/login')
  }
  
  return api.fetchPoll(id);
};
