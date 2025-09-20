import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComplaintsService } from '../../core/services/complaints.service';
import { AuthService } from '../../core/auth/auth.service';
import { Complaint } from '../../core/models/complaint.model';

@Component({
  selector: 'app-user-complaints',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-complaints.component.html',
  styleUrls: ['./user-complaints.component.scss']
})
export class UserComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private complaintsService: ComplaintsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.loading = true;
    this.error = null;
    
    const userId = this.authService.getUserId();
    
    if (!userId) {
      this.error = 'User ID not found. Please login again.';
      this.loading = false;
      return;
    }
    
    this.complaintsService.getComplaintsListByUser(userId).subscribe({
      next: (data) => {
        this.complaints = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load complaints. Please try again.';
        this.loading = false;
      }
    });
  }

  formatTimestamp(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return timestamp; // Return original string if parsing fails
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'in-progress':
        return 'status-in-progress';
      case 'resolved':
        return 'status-resolved';
      case 'closed':
        return 'status-closed';
      default:
        return 'status-default';
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
