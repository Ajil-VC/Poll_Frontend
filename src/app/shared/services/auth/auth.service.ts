import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthResponse } from '../../../core/types/core.type';
import { User } from '../../../core/types/user.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private http = inject(HttpClient);
  private router = inject(Router);
  private socket = inject(SocketService);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  $currUser = this.currentUserSubject.asObservable();

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  private token = signal<string | null>(localStorage.getItem('authToken'));
  getToken() {
    return this.token();
  }

  setToken(value: string) {
    localStorage.setItem('authToken', value);
    this.token.set(value);
  }

  clearToken() {
    localStorage.removeItem('authToken');
    this.token.set(null);
  }

  signUp(email: string, password: string): Observable<AuthResponse<User>> {
    return this.http.post<AuthResponse<User>>(`${environment.apiURL}signup`, { email, password });
  }

  signIn(email: string, password: string): Observable<AuthResponse<User>> {
    return this.http.post<AuthResponse<User>>(`${environment.apiURL}login`, { email, password }, { withCredentials: true })
      .pipe(
        tap(response => {

          if (!response.token) throw new Error('Token Missing..!');
          this.setCurrentUser(response.data);
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('isAdmin', response.data.isAdmin ? 'admin' : '');
          this.connectToSocket();
        })
      )
  }

  connectToSocket() {
    if (!this.socket.isConnected()) {
      const token = this.getToken();
      if (!token) return;
      this.socket.connect(token);
    }
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

  authenticateUser(): Observable<AuthResponse<User>> {
    return this.http.get<AuthResponse<User>>(`${environment.apiURL}authenticate-user`);
  }


  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');

    this.router.navigate(['/login']);
    this.socket.disconnect();
  }
}
