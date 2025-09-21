import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  submit() {
    if (this.form.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const { username, password } = this.form.value;
      
      this.authService.login(username, password).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = this.getErrorMessage(error);
        }
      });
    }
  }

  private getErrorMessage(error: any): string {
    console.error('Login error:', error);
    
    // Handle different HTTP status codes
    if (error.status === 401) {
      return 'Invalid username or password. Please check your credentials and try again.';
    } else if (error.status === 403) {
      return 'Access denied. Invalid username or password.';
    } else if (error.status === 404) {
      return 'User not found. Please check your username and try again.';
    } else if (error.status === 500) {
      return 'Server error. Please try again later.';
    } else if (error.status === 0) {
      return 'Network error. Please check your internet connection and try again.';
    } else if (error.status === 400) {
      return 'Invalid request. Please check your input and try again.';
    } else if (error.error && error.error.message) {
      return error.error.message;
    } else if (error.message) {
      return error.message;
    } else {
      return 'Login failed. Please check your credentials and try again.';
    }
  }
}
