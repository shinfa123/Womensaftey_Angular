import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ComplaintsService } from '../../core/services/complaints.service';
import { Complaint, MyUser } from '../../core/models/complaint.model';
import { UserDetailsPopupComponent } from '../../shared/components/user-details-popup/user-details-popup.component';

@Component({
  selector: 'app-admin-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, UserDetailsPopupComponent],
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class AdminComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  loading = false;
  error: string | null = null;
  selectedUser: MyUser | null = null;
  showUserPopup = false;
  saving = false;
  saveSuccess = false;
  
  // Status options for dropdown
  statusOptions = [
    'Submitted',
    'Under Review',
    'Pending',
    'In Progress',
    'Rejected',
    'Handed Over to Police',
    'Closed'
  ];

  constructor(
    private complaintsService: ComplaintsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.loading = true;
    this.error = null;
    
    this.complaintsService.getComplaintsList().subscribe({
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

  onUserClick(user: MyUser): void {
    this.selectedUser = user;
    this.showUserPopup = true;
  }

  onCloseUserPopup(): void {
    this.showUserPopup = false;
    this.selectedUser = null;
  }

  onStatusChange(complaint: Complaint, newStatus: string): void {
    complaint.status = newStatus;
  }

  onCommentChange(complaint: Complaint, newComment: string): void {
    complaint.comment = newComment;
  }

  saveAllComplaints(): void {
    this.saving = true;
    this.error = null;
    this.saveSuccess = false;
    
    this.complaintsService.saveAllComplaints(this.complaints).subscribe({
      next: (response) => {
        this.saving = false;
        this.saveSuccess = true;
        
        // Update complaints with the response data if available
        if (response && Array.isArray(response)) {
          this.complaints = [...response];
        } else if (response && response.complaints && Array.isArray(response.complaints)) {
          this.complaints = [...response.complaints];
        } else if (response && response.data && Array.isArray(response.data)) {
          this.complaints = [...response.data];
        } else if (response && response.result && Array.isArray(response.result)) {
          this.complaints = [...response.result];
        } else if (response && response.body && Array.isArray(response.body)) {
          this.complaints = [...response.body];
        }
        
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.saveSuccess = false;
        }, 3000);
      },
      error: (error) => {
        this.saving = false;
        this.error = 'Failed to save complaints. Please try again.';
      }
    });
  }

  hasUnsavedChanges(): boolean {
    return this.complaints.length > 0;
  }
}
