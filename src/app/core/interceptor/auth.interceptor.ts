import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');
  const toast = inject(ToastrService);

  let cloneReq = req;
  if (token) {
    cloneReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  const authService = inject(AuthService);
  // const loader = inject(LoaderService);

  return next(cloneReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let userFriendlyMessage = 'An unexpected error occurred. Please try again later.';

      if (error.status === 0) {
        // No response from server
        userFriendlyMessage = 'Unable to connect to the server. Please check your internet connection.';
        toast.error(userFriendlyMessage);

      } else if (error.status === 401 && !req.url.includes('/refresh-token')) {
        // Try refreshing the token

        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry original request with new access token\

            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
              }
            });
            return next(newReq);
          }),
          catchError(() => {
            // Refresh token is also invalid => logout and clear everything
            authService.logout();
            return throwError(() => new Error('Session expired. Please log in again.'));
          })
        );
      } else if (error.status === 403) {

        if (error.error['issue']) {

          toast.info(error.error['message']);
          return throwError(() => error);
        } else {

          // loader.hide();
          toast.error(error.error['message']);
          return throwError(() => error);
          // return of();
        }

      } else if (error.status === 404 || error.status === 400) {
        userFriendlyMessage = error.error?.message || 'Something went wrong. Please try again.';
        toast.error(userFriendlyMessage);
      } else if (error.status === 409) {

        return throwError(() => error);
      } else if (error.status >= 500) {
        toast.error(error.error.message);
      }

      return throwError(() => new Error(userFriendlyMessage));
    })
  );
};
