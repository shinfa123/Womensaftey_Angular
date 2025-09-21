import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { UserManagementService } from '../../core/services/user-management.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';

  constructor(
    private userManagementService: UserManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('UserManagementComponent initialized');
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('Loading users...');
    this.loading = true;
    this.error = '';
    
    this.userManagementService.getAdminUserList().subscribe({
      next: (data) => {
        console.log('Users loaded successfully:', data);
        // Log any users with null departments for debugging
        data.forEach((user, index) => {
          if (!user.department) {
            console.log(`User at index ${index} has null department:`, user);
          } else {
            console.log(`User at index ${index} department:`, user.department);
          }
        });
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
             }
     });
   }

     editUser(user: User): void {
    console.log('Editing user:', user);
    // Navigate to edit user page with user ID as parameter
    this.router.navigate(['/edit-user', user.id], { 
      state: { user: user } 
    });
  }
 }
