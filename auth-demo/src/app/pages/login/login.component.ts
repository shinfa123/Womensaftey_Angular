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
          this.errorMessage = error.message || 'Login failed. Please try again.';
          this.isSubmitting = false;
        }
      });
    }
  }
}
