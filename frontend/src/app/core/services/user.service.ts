import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'MANAGER' | 'VIEWER';
  isActive: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = '/api/v1/users';
  
  users = signal<User[]>([]);
  isLoading = signal(false);

  constructor(private http: HttpClient) {}

  loadUsers(): void {
    this.isLoading.set(true);
    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.users.update(users => users.filter(u => u.id !== id));
      })
    );
  }

  createUser(user: any): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      tap((newUser) => {
        this.users.update(users => [...users, newUser]);
      })
    );
  }
}
