import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly usernameKey = 'login_username';
  private readonly userRoleKey = 'user_role';
  private readonly userIdKey = 'user_id';
  private readonly apiBase = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    this.setLoginUsername(username);
    return this.http
      .post<any>(`${this.apiBase}/authenticate`, { username, password })
      .pipe(tap((res) => {
        const token = (res && (res.token || res.jwt || res.jwtToken || res.accessToken)) as string | undefined;
        if (token) this.setToken(token);
        
        // Store user ID if available in response
        if (res && res.userId !== undefined && res.userId !== null) {
          this.setUserId(res.userId);
        } else if (res && res.id !== undefined && res.id !== null) {
          this.setUserId(res.id);
        } else if (res && res.user_id !== undefined && res.user_id !== null) {
          this.setUserId(res.user_id);
        }
        
        // Store user role if available in response
        if (res && res.admin !== undefined && res.admin !== null) {
          this.setUserRole(Boolean(res.admin));
        } else if (res && res.isAdmin !== undefined && res.isAdmin !== null) {
          this.setUserRole(Boolean(res.isAdmin));
        } else {
          this.setUserRole(false);
        }
      }));
  }

  signup(payload: {
    name: string;
    age: number | string;
    place: string;
    phoneno: string;
    email: string;
    userName: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post<any>(`${this.apiBase}/signup`, payload)
      .pipe(
        tap((res) => {
          const token = (res && (res.token || res.jwt || res.jwtToken || res.accessToken)) as string | undefined;
          if (token) this.setToken(token);
          
          // Store user ID if available in response
          if (res && res.userId !== undefined && res.userId !== null) {
            this.setUserId(res.userId);
          } else if (res && res.id !== undefined && res.id !== null) {
            this.setUserId(res.id);
          } else if (res && res.user_id !== undefined && res.user_id !== null) {
            this.setUserId(res.user_id);
          }
          
          // Store user role if available in response
          if (res && res.admin !== undefined && res.admin !== null) {
            this.setUserRole(Boolean(res.admin));
          } else if (res && res.isAdmin !== undefined && res.isAdmin !== null) {
            this.setUserRole(Boolean(res.isAdmin));
          } else {
            this.setUserRole(false);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.userRoleKey);
    localStorage.removeItem(this.userIdKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  setLoginUsername(username: string): void {
    localStorage.setItem(this.usernameKey, username);
  }

  getLoginUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  setUserRole(isAdmin: boolean): void {
    localStorage.setItem(this.userRoleKey, isAdmin.toString());
  }

  getUserRole(): boolean {
    const role = localStorage.getItem(this.userRoleKey);
    return role === 'true';
  }

  isAdmin(): boolean {
    return this.getUserRole();
  }

  setUserId(userId: number): void {
    localStorage.setItem(this.userIdKey, userId.toString());
  }

  getUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? parseInt(userId, 10) : null;
  }
}


