import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, of, map } from 'rxjs';

export interface User {
  id: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api/v1/auth';
  
  // State using signals
  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());
  
  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => this.handleAuthResponse(response))
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return throwError(() => new Error('No refresh token'));

    return this.http.post(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((response: any) => this.handleAuthResponse(response)),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  private handleAuthResponse(response: any): void {
    this.currentUser.set(response.user);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe();
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private clearSession(): void {
    this.currentUser.set(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.currentUser.set(JSON.parse(userStr));
      } catch (e) {
        this.clearSession();
      }
    }
  }
}
