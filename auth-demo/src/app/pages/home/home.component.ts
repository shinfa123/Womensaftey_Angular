import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { EmergencyService } from '../../core/services/emergency.service';
import { NotificationTabComponent } from '../../shared/components/notification-tab/notification-tab.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NotificationTabComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  username: string | null = null;
  isAdmin: boolean = false;
  emergencyNotificationCount: number = 0;

  constructor(
    private authService: AuthService,
    private emergencyService: EmergencyService
  ) {}

  ngOnInit() {
    this.updateUserInfo();
    if (this.isAdmin) {
      this.loadEmergencyNotificationCount();
    }
  }

  updateUserInfo() {
    this.username = this.authService.getLoginUsername();
    this.isAdmin = this.authService.isAdmin();
  }

  loadEmergencyNotificationCount() {
    this.emergencyService.getEmergencyList().subscribe({
      next: (alerts) => {
        this.emergencyNotificationCount = alerts.filter(alert => alert.isNewlyUpdated).length;
      },
      error: (err) => {
        console.error('Error loading emergency notification count:', err);
      }
    });
  }
}
