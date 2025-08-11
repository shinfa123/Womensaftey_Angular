import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  errorMessage = '';
  isSubmitting = false;
  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit(): void {
    this.errorMessage = '';
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const { username, password } = this.form.value as { username: string; password: string };
    // Clear any stale token before logging in
    this.auth.logout();
    this.auth.login(username, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl('/home');
      },
      error: () => {
        this.isSubmitting = false;
        this.auth.logout();
        this.errorMessage = 'Invalid password';
      }
    });
  }
}
