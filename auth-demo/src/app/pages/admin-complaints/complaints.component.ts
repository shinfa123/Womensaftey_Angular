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
  
  // Track original complaint data to detect changes
  private originalComplaints: Map<number, Complaint> = new Map();
  
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
        // Store original data for change tracking
        this.storeOriginalComplaints();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load complaints. Please try again.';
        this.loading = false;
      }
    });
  }

  private storeOriginalComplaints(): void {
    this.originalComplaints.clear();
    console.log('Storing original complaints data...');
    this.complaints.forEach((complaint, index) => {
      // Create a deep copy of the original complaint, preserving isNewlyUpdated/newlyUpdated values
      const originalComplaint = {
        ...complaint,
        user: { ...complaint.user }
        // Keep the original isNewlyUpdated and newlyUpdated values from API response
      };
      this.originalComplaints.set(index, originalComplaint);
      console.log(`Stored original complaint ${index}:`, {
        status: originalComplaint.status,
        comment: originalComplaint.comment,
        isNewlyUpdated: originalComplaint.isNewlyUpdated,
        newlyUpdated: originalComplaint.newlyUpdated
      });
    });
    console.log('Total original complaints stored:', this.originalComplaints.size);
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
    const index = this.complaints.indexOf(complaint);
    this.markAsEdited(complaint, index);
  }

  onCommentChange(complaint: Complaint, newComment: string): void {
    complaint.comment = newComment;
    const index = this.complaints.indexOf(complaint);
    this.markAsEdited(complaint, index);
  }

  private markAsEdited(complaint: Complaint, index: number): void {
    if (index !== -1) {
      // Check if the complaint has actually changed from its original state
      const originalComplaint = this.originalComplaints.get(index);
      if (originalComplaint) {
        const hasStatusChanged = originalComplaint.status !== complaint.status;
        const hasCommentChanged = originalComplaint.comment !== complaint.comment;
        
        console.log('Checking changes for complaint at index:', index);
        console.log('Original status:', originalComplaint.status, 'Current status:', complaint.status);
        console.log('Original comment:', originalComplaint.comment, 'Current comment:', complaint.comment);
        console.log('Status changed:', hasStatusChanged, 'Comment changed:', hasCommentChanged);
        
        if (hasStatusChanged || hasCommentChanged) {
          complaint.isNewlyUpdated = true;
          complaint.newlyUpdated = true;
          console.log('Marked complaint as newly updated');
        } else {
          complaint.isNewlyUpdated = false;
          complaint.newlyUpdated = false;
          console.log('No changes detected');
        }
      } else {
        console.log('No original complaint found for index:', index);
      }
    } else {
      console.log('Complaint index not found');
    }
  }

  saveAllComplaints(): void {
    this.saving = true;
    this.error = null;
    this.saveSuccess = false;
    
    // Prepare complaints for saving - only set isNewlyUpdated=true for edited complaints, retain original values for others
    const complaintsToSave = this.complaints.map((complaint, index) => {
      const originalComplaint = this.originalComplaints.get(index);
      if (originalComplaint) {
        const hasStatusChanged = originalComplaint.status !== complaint.status;
        const hasCommentChanged = originalComplaint.comment !== complaint.comment;
        
        console.log(`Saving complaint ${index}:`, {
          originalStatus: originalComplaint.status,
          currentStatus: complaint.status,
          originalComment: originalComplaint.comment,
          currentComment: complaint.comment,
          statusChanged: hasStatusChanged,
          commentChanged: hasCommentChanged,
          originalIsNewlyUpdated: originalComplaint.isNewlyUpdated,
          originalNewlyUpdated: originalComplaint.newlyUpdated
        });
        
        if (hasStatusChanged || hasCommentChanged) {
          // Only set to true if complaint was actually edited
          return {
            ...complaint,
            isNewlyUpdated: true,
            newlyUpdated: true
          };
        } else {
          // Retain original values from API response
          return {
            ...complaint,
            isNewlyUpdated: originalComplaint.isNewlyUpdated,
            newlyUpdated: originalComplaint.newlyUpdated
          };
        }
      }
      
      console.log(`No original complaint found for index ${index}, retaining current values`);
      return {
        ...complaint
        // Don't modify isNewlyUpdated/newlyUpdated - keep whatever values are already there
      };
    });
    
    console.log('Final complaints to save:', complaintsToSave);
    console.log('Complaint 0 details:', complaintsToSave[0]);
    
    this.complaintsService.saveAllComplaints(complaintsToSave).subscribe({
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
        
        // Update original complaints data after successful save
        this.storeOriginalComplaints();
        
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
    if (this.complaints.length === 0) {
      return false;
    }
    
    // Check if any complaint has been modified
    return this.complaints.some((complaint, index) => {
      const originalComplaint = this.originalComplaints.get(index);
      if (originalComplaint) {
        const hasStatusChanged = originalComplaint.status !== complaint.status;
        const hasCommentChanged = originalComplaint.comment !== complaint.comment;
        return hasStatusChanged || hasCommentChanged;
      }
      return false;
    });
  }
}
