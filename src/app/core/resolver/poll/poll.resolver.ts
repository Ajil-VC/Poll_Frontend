import { inject } from '@angular/core';
import { ResolveFn, Router, UrlTree } from '@angular/router';
import { ApiService } from '../../../shared/services/api/api.service';
import { AuthResponse } from '../../types/core.type';
import { Poll } from '../../types/poll.model';
import { of } from 'rxjs';

export const pollResolver: ResolveFn<AuthResponse<Poll> | null> = (route, state) => {

  const api = inject(ApiService);
  const id = route.paramMap.get('id');
  const router = inject(Router);
  if (!id) {
    return of(null);
  }

  return api.fetchPoll(id);
};
