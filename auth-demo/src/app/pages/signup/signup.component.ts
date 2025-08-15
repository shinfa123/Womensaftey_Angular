import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  errorMessage = '';
  isSubmitting = false;
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    age: [null as number | null, [Validators.required, Validators.min(1), Validators.max(120)]],
    place: ['', [Validators.required]],
    phoneno: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    email: ['', [Validators.required, Validators.email]],
    userName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit(): void {
    this.errorMessage = '';
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const payload = this.form.value as {
      name: string;
      age: number;
      place: string;
      phoneno: string;
      email: string;
      userName: string;
      password: string;
    };
    this.auth.signup(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl('/login');
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Signup failed';
      }
    });
  }
}
