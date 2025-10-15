import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { Emergency } from '../models/emergency.model';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class EmergencyService {
  private readonly apiBase = 'http://localhost:8080';
  private emergencyApiUrl = `${this.apiBase}/saveEmergency`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCurrentPosition(): Observable<GeolocationPosition> {
    if (!('geolocation' in navigator)) {
      return of({} as GeolocationPosition);
    }
    return new Observable<GeolocationPosition>((observer) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          observer.next(pos);
          observer.complete();
        },
        (err) => observer.error(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  triggerEmergency(): Observable<Emergency> {
    return this.getCurrentPosition().pipe(
      switchMap((pos) => {
        const userId = this.authService.getUserId();
        
        if (!userId) {
          throw new Error('User not authenticated');
        }

        if (!pos || !pos.coords) {
          const fallback: Emergency = { 
            user: { id: userId },
            latitude: '0',
            longitude: '0',
            isNewlyUpdated: true
          };
          return this.http.post<Emergency>(this.emergencyApiUrl, fallback);
        }

        const emergency: Emergency = {
          user: { id: userId },
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
          isNewlyUpdated: true
        };
        
        return this.http.post<Emergency>(this.emergencyApiUrl, emergency);
      })
    );
  }

  getEmergencyList(): Observable<Emergency[]> {
    return this.http.get<Emergency[]>(`${this.apiBase}/getEmergencyList`);
  }

  saveAllEmergency(emergencies: Emergency[]): Observable<Emergency[]> {
    return this.http.post<Emergency[]>(`${this.apiBase}/saveAllEmergency`, emergencies);
  }
}



