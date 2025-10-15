import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmergencyService } from '../../core/services/emergency.service';
import { Emergency } from '../../core/models/emergency.model';

@Component({
  selector: 'app-admin-emergency-alerts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-emergency-alerts.component.html',
  styleUrls: ['./admin-emergency-alerts.component.scss']
})
export class AdminEmergencyAlertsComponent implements OnInit {
  emergencyAlerts: Emergency[] = [];
  loading: boolean = false;
  error: string | null = null;
  selectedEmergency: Emergency | null = null;
  mapCenter: { lat: number; lng: number } = { lat: 10.0086, lng: 76.3398 }; // Default to Kerala center
  newlyUpdatedCount: number = 0;

  constructor(private emergencyService: EmergencyService) {}

  ngOnInit() {
    this.loadEmergencyAlerts();
  }

  loadEmergencyAlerts() {
    this.loading = true;
    this.error = null;
    
    this.emergencyService.getEmergencyList().subscribe({
      next: (alerts) => {
        this.emergencyAlerts = alerts;
        this.newlyUpdatedCount = alerts.filter(alert => alert.isNewlyUpdated).length;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load emergency alerts';
        this.loading = false;
        console.error('Error loading emergency alerts:', err);
      }
    });
  }

  selectEmergency(emergency: Emergency) {
    this.selectedEmergency = emergency;
    this.mapCenter = {
      lat: parseFloat(emergency.latitude),
      lng: parseFloat(emergency.longitude)
    };
    
    // Mark this emergency as viewed (isNewlyUpdated = false)
    if (emergency.isNewlyUpdated) {
      emergency.isNewlyUpdated = false;
      this.newlyUpdatedCount = Math.max(0, this.newlyUpdatedCount - 1);
      
      // Save the updated emergency list
      this.emergencyService.saveAllEmergency(this.emergencyAlerts).subscribe({
        next: () => {
          console.log('Emergency marked as viewed');
        },
        error: (err) => {
          console.error('Error saving emergency updates:', err);
          // Revert the change if save failed
          emergency.isNewlyUpdated = true;
          this.newlyUpdatedCount++;
        }
      });
    }
  }

  closeMap() {
    this.selectedEmergency = null;
  }

  refreshAlerts() {
    this.loadEmergencyAlerts();
  }
}
