import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintsService } from '../../../core/services/complaints.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Complaint } from '../../../core/models/complaint.model';

@Component({
  selector: 'app-notification-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-tab.component.html',
  styleUrls: ['./notification-tab.component.scss']
})
export class NotificationTabComponent implements OnInit {
  notifications: Complaint[] = [];
  loading = false;
  error: string | null = null;
  showNotifications = false;

  constructor(
    private complaintsService: ComplaintsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.error = 'User ID not found';
      return;
    }

    this.loading = true;
    this.error = null;

    this.complaintsService.getNewlyEditedComplaintsList(userId).subscribe({
      next: (complaints) => {
        this.notifications = complaints;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.error = 'Failed to load notifications';
        this.loading = false;
      }
    });
  }

  toggleNotifications() {
    const wasOpen = this.showNotifications;
    this.showNotifications = !this.showNotifications;
    
    if (this.showNotifications && this.notifications.length === 0) {
      // Opening notifications - load them
      this.loadNotifications();
    } else if (wasOpen && !this.showNotifications) {
      // Closing notifications - call update API for all users
      this.handleNotificationClose();
    }
  }

  private handleNotificationClose() {
    const userId = this.authService.getUserId();
    const isAdmin = this.authService.isAdmin();
    
    // Call API for all users (both admin and non-admin)
    if (userId) {
      console.log(`Calling updateNotifications API for ${isAdmin ? 'admin' : 'non-admin'} user:`, userId);
      this.complaintsService.updateNotifications(userId).subscribe({
        next: (response) => {
          console.log('Notifications updated successfully:', response);
          // Refresh notifications after successful update
          this.loadNotifications();
        },
        error: (error) => {
          console.error('Error updating notifications:', error);
          // Don't show error to user as this is a background operation
        }
      });
    } else {
      console.log('No user ID found - skipping updateNotifications API call');
    }
  }

  getNotificationCount(): number {
    return this.notifications.length;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'in progress':
        return 'status-progress';
      case 'resolved':
        return 'status-resolved';
      case 'closed':
        return 'status-closed';
      default:
        return 'status-default';
    }
  }
}
