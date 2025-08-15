import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { UserManagementService } from '../../core/services/user-management.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  form: FormGroup;
  user: User | null = null;
  isSubmitting = false;
  error = '';
  success = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userManagementService: UserManagementService,
    private router: Router,
    private route: ActivatedRoute
  ) {
         this.form = this.fb.group({
       name: ['', [Validators.required]],
       age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
       place: ['', [Validators.required]],
       department: ['', [Validators.required]],
       phoneno: ['', [Validators.required]],
       email: ['', [Validators.required, Validators.email]],
       userName: ['', [Validators.required]],
       password: ['', [Validators.required, Validators.minLength(6)]],
              semester: ['', [Validators.required]],
        batch: ['', [Validators.required, Validators.min(2000), Validators.max(2030)]],
        isAdmin: [false]
     });
  }

  ngOnInit(): void {
    // Get user data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.user = navigation.extras.state['user'] as User;
      this.populateForm();
    } else {
      // Fallback: get user ID from route params and fetch user data
      const userId = this.route.snapshot.paramMap.get('id');
      if (userId) {
        this.loadUserById(parseInt(userId));
      } else {
        this.error = 'No user data found. Please go back and try again.';
      }
    }
  }

  loadUserById(userId: number): void {
    this.userManagementService.getAdminUserList().subscribe({
      next: (users) => {
        this.user = users.find(user => user.id === userId) || null;
        if (this.user) {
          this.populateForm();
        } else {
          this.error = 'User not found. Please go back and try again.';
        }
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.error = 'Failed to load user data. Please try again.';
      }
    });
  }

  populateForm(): void {
    if (this.user) {
      console.log('Populating form with user data:', this.user);
      
      // Convert semester to string if it's a number
      const semesterValue = this.user.semester?.toString() || '';
      
             this.form.patchValue({
         name: this.user.name,
         age: this.user.age,
         place: this.user.place,
         department: this.user.department?.id?.toString() || '',
         phoneno: this.user.phoneno,
         email: this.user.email,
         userName: this.user.userName,
         password: this.user.password, // Note: This might be hashed
         semester: semesterValue,
         batch: this.user.batch,
         isAdmin: this.user.isAdmin
       });
      
      // Mark all controls as touched to trigger validation
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      
      console.log('Form after population:', this.form.value);
      console.log('Form valid:', this.form.valid);
      console.log('Form invalid:', this.form.invalid);
      
      // Log each control's status
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          console.log(`${key}: valid=${control.valid}, invalid=${control.invalid}, errors=`, control.errors);
        }
      });
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    // Mark all fields as touched to show validation errors
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control) {
        control.markAsTouched();
      }
    });

    if (this.form.valid && this.user) {
      this.isSubmitting = true;
      this.error = '';
      this.success = '';

      const formData = this.form.value;
      
             // Prepare the payload for the signup API with user object
       const payload = {
         id: this.user.id, // Include the user ID for update
         name: formData.name,
         age: formData.age,
         place: formData.place,
         phoneno: formData.phoneno,
         email: formData.email,
         userName: formData.userName,
         password: formData.password,
         semester: formData.semester,
         batch: formData.batch,
         isAdmin: formData.isAdmin,
         department: {
           id: parseInt(formData.department),
           name: this.getDepartmentName(parseInt(formData.department))
         }
       };

      console.log('Updating user with payload:', payload);

      this.authService.signup(payload).subscribe({
        next: (response) => {
          console.log('User updated successfully:', response);
          this.success = 'User updated successfully!';
          this.isSubmitting = false;
          
          // Redirect back to user management after a short delay
          setTimeout(() => {
            this.router.navigate(['/user-management']);
          }, 2000);
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.error = err.message || 'Failed to update user. Please try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      console.log('Form is invalid:', this.form.errors);
      console.log('Form controls:', this.form.controls);
    }
  }

     goBack(): void {
     this.router.navigate(['/user-management']);
   }

   private getDepartmentName(departmentId: number): string {
     const departments = {
       1: 'Computer Science',
       2: 'Electrical Engineering',
       3: 'Mechanical Engineering',
       4: 'Civil Engineering',
       5: 'Information Technology'
     };
     return departments[departmentId as keyof typeof departments] || 'Unknown Department';
   }
}
