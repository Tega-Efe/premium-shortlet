import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Create Account</h2>
        
        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }
        
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="displayName">Full Name</label>
            <input 
              type="text" 
              id="displayName" 
              formControlName="displayName"
              [class.invalid]="signupForm.get('displayName')?.invalid && signupForm.get('displayName')?.touched"
            >
            @if (signupForm.get('displayName')?.invalid && signupForm.get('displayName')?.touched) {
              <span class="error">Name is required</span>
            }
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              [class.invalid]="signupForm.get('email')?.invalid && signupForm.get('email')?.touched"
            >
            @if (signupForm.get('email')?.invalid && signupForm.get('email')?.touched) {
              <span class="error">Please enter a valid email</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              [class.invalid]="signupForm.get('password')?.invalid && signupForm.get('password')?.touched"
            >
            @if (signupForm.get('password')?.invalid && signupForm.get('password')?.touched) {
              <span class="error">Password must be at least 6 characters</span>
            }
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              formControlName="confirmPassword"
              [class.invalid]="signupForm.get('confirmPassword')?.invalid && signupForm.get('confirmPassword')?.touched"
            >
            @if (signupForm.hasError('passwordMismatch') && signupForm.get('confirmPassword')?.touched) {
              <span class="error">Passwords do not match</span>
            }
          </div>

          <button 
            type="submit" 
            [disabled]="signupForm.invalid || isLoading()"
            class="btn-primary"
          >
            @if (isLoading()) {
              <span>Creating account...</span>
            } @else {
              <span>Sign Up</span>
            }
          </button>
        </form>

        <div class="divider">
          <span>OR</span>
        </div>

        <button 
          type="button" 
          (click)="signUpWithGoogle()"
          [disabled]="isLoading()"
          class="btn-google"
        >
          Sign up with Google
        </button>

        <div class="auth-links">
          <a routerLink="/login">Already have an account? Login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px;
    }

    .auth-card {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      margin-bottom: 30px;
      text-align: center;
      color: #333;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      color: #555;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      box-sizing: border-box;
    }

    input.invalid {
      border-color: #dc3545;
    }

    .error {
      color: #dc3545;
      font-size: 14px;
      margin-top: 5px;
      display: block;
    }

    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .btn-primary, .btn-google {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #28a745;
      color: white;
      margin-bottom: 10px;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #218838;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-google {
      background-color: #fff;
      color: #333;
      border: 1px solid #ddd;
      margin-bottom: 20px;
    }

    .btn-google:hover:not(:disabled) {
      background-color: #f8f9fa;
    }

    .divider {
      text-align: center;
      margin: 20px 0;
      position: relative;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background-color: #ddd;
    }

    .divider span {
      background-color: white;
      padding: 0 10px;
      position: relative;
      color: #999;
    }

    .auth-links {
      text-align: center;
    }

    .auth-links a {
      color: #007bff;
      text-decoration: none;
    }

    .auth-links a:hover {
      text-decoration: underline;
    }
  `]
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  signupForm = new FormGroup({
    displayName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const { email, password, displayName } = this.signupForm.value;

      try {
        await this.authService.signUp(email!, password!, displayName!);
        this.router.navigate(['/']);
      } catch (error: any) {
        this.errorMessage.set(this.getErrorMessage(error.code));
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  async signUpWithGoogle() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.signInWithGoogle();
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage.set(this.getErrorMessage(error.code));
    } finally {
      this.isLoading.set(false);
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/weak-password':
        return 'Password is too weak.';
      case 'auth/popup-closed-by-user':
        return 'Sign up cancelled.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}
