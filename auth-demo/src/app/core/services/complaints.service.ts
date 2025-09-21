import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Complaint } from '../models/complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getComplaintsList(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/getComplaintsList`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getComplaintsListByUser(userId: number): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/getComplaintsListByUser/${userId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  saveAllComplaints(complaints: Complaint[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/saveAllComplaints`, complaints).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  saveComplaint(complaint: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/saveComplaints`, complaint).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getNewlyEditedComplaintsList(userId: number): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/getNewlyEditedComplaintsList/${userId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  updateNotifications(userId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateNotifications/${userId}`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
