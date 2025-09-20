import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ComplaintsService } from '../../core/services/complaints.service';
import { AuthService } from '../../core/auth/auth.service';
import { Complaint, MyUser } from '../../core/models/complaint.model';

@Component({
  selector: 'app-add-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-complaint.component.html',
  styleUrls: ['./add-complaint.component.scss']
})
export class AddComplaintComponent implements OnInit {
  complaint: Partial<Complaint> = {
    status: 'Submitted',
    location: '',
    complaintType: '',
    comment: ''
  };
  
  loading = false;
  error: string | null = null;
  success = false;
  
  // Complaint type options
  complaintTypes = [
    'Safety Issue',
    'Harassment',
    'Infrastructure Problem',
    'Security Concern',
    'Emergency',
    'Other'
  ];

  constructor(
    private complaintsService: ComplaintsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize with current user data
    const userId = this.authService.getUserId();
    if (!userId) {
      this.error = 'User not authenticated. Please login again.';
      return;
    }
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = false;

    // Get current user data
    const userId = this.authService.getUserId();
    const username = this.authService.getLoginUsername();

    if (!userId || !username) {
      this.error = 'User data not found. Please login again.';
      this.loading = false;
      return;
    }

    // Create complaint object with user ID
    const newComplaint: any = {
      timeStamp: new Date().toISOString(),
      user: {
        id: userId,
        name: username
      },
      status: this.complaint.status || 'Submitted',
      location: this.complaint.location || '',
      complaintType: this.complaint.complaintType || '',
      comment: this.complaint.comment || ''
    };

    // Alternative format - just send userId if backend expects it
    const alternativeComplaint = {
      timeStamp: new Date().toISOString(),
      userId: userId,
      status: this.complaint.status || 'Submitted',
      location: this.complaint.location || '',
      complaintType: this.complaint.complaintType || '',
      comment: this.complaint.comment || ''
    };

    // Try the first format
    this.complaintsService.saveComplaint(newComplaint).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = true;
        
        setTimeout(() => {
          this.router.navigate(['/user-complaints']);
        }, 2000);
      },
      error: (error) => {
        // If first attempt fails with 400 (bad request), try alternative format
        if (error.status === 400) {
          this.complaintsService.saveComplaint(alternativeComplaint).subscribe({
            next: (response) => {
              this.loading = false;
              this.success = true;
              
              setTimeout(() => {
                this.router.navigate(['/user-complaints']);
              }, 2000);
            },
            error: (secondError) => {
              this.loading = false;
              this.handleSubmissionError(secondError);
            }
          });
        } else {
          this.loading = false;
          this.handleSubmissionError(error);
        }
      }
    });
  }

  private validateForm(): boolean {
    if (!this.complaint.location?.trim()) {
      this.error = 'Location is required.';
      return false;
    }
    
    if (!this.complaint.complaintType?.trim()) {
      this.error = 'Complaint type is required.';
      return false;
    }
    
    if (!this.complaint.comment?.trim()) {
      this.error = 'Comment is required.';
      return false;
    }

    return true;
  }

  onCancel(): void {
    this.router.navigate(['/user-complaints']);
  }

  private handleSubmissionError(error: any): void {
    if (error.status === 401 || error.status === 403) {
      this.error = 'Authentication failed. Please login again.';
    } else if (error.status === 400) {
      this.error = 'Invalid data. Please check your input and try again.';
    } else if (error.status === 500) {
      this.error = 'Server error. Please try again later.';
    } else if (error.status === 0) {
      this.error = 'Network error. Please check your connection.';
    } else {
      this.error = `Failed to submit complaint. Error: ${error.status} - ${error.message}`;
    }
  }
}
