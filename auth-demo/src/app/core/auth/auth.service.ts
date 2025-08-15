import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly usernameKey = 'login_username';
  private readonly apiBase = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    console.log('Making login request to:', `${this.apiBase}/authenticate`);
    console.log('Login payload:', { username, password });
    this.setLoginUsername(username);
    return this.http
      .post<any>(`${this.apiBase}/authenticate`, { username, password })
      .pipe(tap((res) => {
        console.log('Login response:', res);
        const token = (res && (res.token || res.jwt || res.jwtToken || res.accessToken)) as string | undefined;
        if (token) this.setToken(token);
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
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
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
}


