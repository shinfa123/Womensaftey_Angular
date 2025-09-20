import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyUser } from '../../../core/models/complaint.model';

@Component({
  selector: 'app-user-details-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details-popup.component.html',
  styleUrls: ['./user-details-popup.component.scss']
})
export class UserDetailsPopupComponent {
  @Input() user: MyUser | null = null;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onClose();
    }
  }
}

