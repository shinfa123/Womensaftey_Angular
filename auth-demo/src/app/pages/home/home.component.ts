import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.updateUserInfo();
  }

  updateUserInfo() {
    this.username = this.authService.getLoginUsername();
    this.isAdmin = this.authService.isAdmin();
  }
}
