import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmergencyService } from '../../core/services/emergency.service';
import { Emergency } from '../../core/models/emergency.model';

@Component({
  selector: 'app-emergency',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './emergency.component.html',
  styleUrls: ['./emergency.component.scss']
})
export class EmergencyComponent {
  isSending: boolean = false;
  message: string | null = null;

  constructor(private emergencyService: EmergencyService) {}

  trigger() {
    if (this.isSending) return;
    this.isSending = true;
    this.message = null;
    
    this.emergencyService.triggerEmergency().subscribe({
      next: (emergency: Emergency) => {
        this.isSending = false;
        this.message = 'Emergency alert sent successfully! Your location has been shared with the safety team.';
      },
      error: (err) => {
        this.isSending = false;
        this.message = 'Failed to send emergency alert. Please try again.';
        console.error('Emergency alert error:', err);
      }
    });
  }
}


