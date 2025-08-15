import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = 'http://localhost:8080'; // Update this with your actual API base URL

  constructor(private http: HttpClient) {}

  getAdminUserList(): Observable<User[]> {
    console.log('Making request to getAdminUserList');
    return this.http.get<User[]>(`${this.apiUrl}/getAdminUserList`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error in getAdminUserList:', error);
        if (error.status === 401 || error.status === 403) {
          console.error('Authentication error - token might be invalid');
        }
        return throwError(() => error);
      })
    );
  }
}
