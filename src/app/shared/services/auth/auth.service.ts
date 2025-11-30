import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthResponse } from '../../../core/types/core.type';
import { User } from '../../../core/types/user.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private http = inject(HttpClient);
  private router = inject(Router);


  signUp(email: string, password: string): Observable<AuthResponse<User>> {
    return this.http.post<AuthResponse<User>>(`${environment.apiURL}signup`, { email, password });
  }

  signIn(email: string, password: string): Observable<AuthResponse<User>> {
    return this.http.post<AuthResponse<User>>(`${environment.apiURL}login`, { email, password })
      .pipe(
        tap(response => {
          if (!response.token) throw new Error('Token Missing');
          localStorage.setItem('authToken', response.token);
        })
      )
  }


  refreshToken(): Observable<any> {
    return this.http.post(`${environment.apiURL}refresh-token`, null, {
      withCredentials: true
    }).pipe(
      tap((res: any) => {
        localStorage.setItem('authToken', res.token)
      })
    )
  }


  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('forceChangePass');
    localStorage.removeItem('role');
    localStorage.removeItem('projectId');
    this.router.navigate(['/login']);

    // this.currentUser = null;
    // this.logoutSubject.next();
    // this.userSubject.next(null);
  }
}
