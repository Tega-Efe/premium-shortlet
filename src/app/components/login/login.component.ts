import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Login to Shortlet Connect</h2>
        
        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email"
              [class.invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            >
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <span class="error">Please enter a valid email</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              [class.invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <span class="error">Password is required</span>
            }
          </div>

          <button 
            type="submit" 
            [disabled]="loginForm.invalid || isLoading()"
            class="btn-primary"
          >
            @if (isLoading()) {
              <span>Loading...</span>
            } @else {
              <span>Login</span>
            }
          </button>
        </form>

        <div class="divider">
          <span>OR</span>
        </div>

        <button 
          type="button" 
          (click)="signInWithGoogle()"
          [disabled]="isLoading()"
          class="btn-google"
        >
          Sign in with Google
        </button>

        <div class="auth-links">
          <a routerLink="/signup">Don't have an account? Sign up</a>
          <a routerLink="/forgot-password">Forgot password?</a>
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
      background-color: #007bff;
      color: white;
      margin-bottom: 10px;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
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
      display: flex;
      flex-direction: column;
      gap: 10px;
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
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const { email, password } = this.loginForm.value;

      try {
        await this.authService.signIn(email!, password!);
        this.router.navigate(['/']);
      } catch (error: any) {
        this.errorMessage.set(this.getErrorMessage(error.code));
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  async signInWithGoogle() {
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
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/popup-closed-by-user':
        return 'Sign in cancelled.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}
