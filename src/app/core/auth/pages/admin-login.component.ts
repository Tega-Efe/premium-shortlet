import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-page">
      <!-- Background Decoration -->
      <div class="login-background">
        <svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,400 Q480,320 960,400 T1920,400 L1920,1080 L0,1080 Z" fill="rgba(212, 165, 116, 0.08)"/>
          <path d="M0,500 Q480,580 960,500 T1920,500 L1920,1080 L0,1080 Z" fill="rgba(125, 25, 53, 0.05)"/>
        </svg>
      </div>

      <div class="login-container">
        <!-- Login Card -->
        <div class="login-card">
          <!-- Logo/Brand Section -->
          <div class="login-header">
            <div class="brand-icon">
              <i class="fas fa-shield-halved"></i>
            </div>
            <h1 class="login-title">Admin Portal</h1>
            <p class="login-subtitle">Sign in to access the dashboard</p>
          </div>

          <!-- Login Form -->
          <form class="login-form" (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <!-- Email Field -->
            <div class="form-group">
              <label for="email" class="form-label">
                <i class="fas fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                class="form-input"
                [(ngModel)]="email"
                [disabled]="isLoading()"
                placeholder="admin@sweethomes.com"
                required
                email
                autocomplete="email"
              />
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <label for="password" class="form-label">
                <i class="fas fa-lock"></i>
                Password
              </label>
              <div class="password-input-wrapper">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  id="password"
                  name="password"
                  class="form-input"
                  [(ngModel)]="password"
                  [disabled]="isLoading()"
                  placeholder="Enter your password"
                  required
                  minlength="6"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="password-toggle"
                  (click)="togglePasswordVisibility()"
                  [disabled]="isLoading()"
                  tabindex="-1"
                >
                  <i [class]="showPassword() ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Remember Me Checkbox -->
            <div class="form-group remember-me-group">
              <label class="remember-me-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  [(ngModel)]="rememberMe"
                  [disabled]="isLoading()"
                  class="remember-me-checkbox"
                />
                <span class="remember-me-text">
                  <i class="fas fa-clock-rotate-left"></i>
                  Remember me
                </span>
              </label>
              <span class="remember-me-hint">Stay signed in for 30 days</span>
            </div>

            <!-- Warning Message -->
            @if (warningMessage()) {
              <div class="warning-message">
                <i class="fas fa-exclamation-triangle"></i>
                <span>{{ warningMessage() }}</span>
              </div>
            }

            <!-- Error Message -->
            @if (errorMessage()) {
              <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>{{ errorMessage() }}</span>
              </div>
            }

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn-login"
              [disabled]="isLoading() || !loginForm.form.valid"
            >
              @if (isLoading()) {
                <i class="fas fa-spinner fa-spin"></i>
                <span>Signing in...</span>
              } @else {
                <i class="fas fa-sign-in-alt"></i>
                <span>Sign In</span>
              }
            </button>
          </form>

          <!-- Footer Info -->
          <div class="login-footer">
            <p class="security-note">
              <i class="fas fa-shield-alt"></i>
              Secured with Firebase Authentication
            </p>
          </div>
        </div>

        <!-- Back to Home Link -->
        <div class="back-to-home">
          <a routerLink="/" class="home-link">
            <i class="fas fa-arrow-left"></i>
            <span>Back to Homepage</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-primary);
      position: relative;
      overflow: hidden;
      padding: 2rem 1rem;
    }

    .login-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .login-background svg {
      width: 100%;
      height: 100%;
    }

    .login-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 450px;
    }

    .login-card {
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      padding: 2rem 1.75rem;
      border: 1px solid var(--border-color);
    }

    /* Header */
    .login-header {
      text-align: center;
      margin-bottom: 1.75rem;
    }

    .brand-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 1rem;
      background: linear-gradient(135deg, var(--color-burgundy) 0%, var(--color-tan) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 12px rgba(125, 25, 53, 0.2);
    }

    .brand-icon i {
      font-size: 1.75rem;
      color: white;
    }

    .login-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.375rem;
    }

    .login-subtitle {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    /* Form */
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.125rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.8125rem;
    }

    .form-label i {
      color: var(--color-burgundy);
      font-size: 0.75rem;
    }

    .form-input {
      padding: 0.625rem 0.875rem;
      border: 2px solid transparent;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      color: var(--text-primary);
      background-image: 
        linear-gradient(var(--bg-primary), var(--bg-primary)),
        linear-gradient(135deg, 
          var(--color-burgundy) 0%, 
          var(--color-tan) 50%, 
          var(--color-sage) 100%
        );
      background-origin: border-box;
      background-clip: padding-box, border-box;
      transition: all 0.3s ease;
    }

    .form-input:focus {
      outline: none;
      background-image: 
        linear-gradient(var(--bg-primary), var(--bg-primary)),
        linear-gradient(135deg, 
          var(--color-burgundy) 0%, 
          var(--color-tan) 30%,
          var(--color-sage) 60%,
          var(--color-burgundy) 100%
        );
      box-shadow: 0 0 0 3px rgba(125, 25, 53, 0.1);
    }

    .form-input::placeholder {
      color: var(--text-tertiary);
      opacity: 0.7;
    }

    .form-input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Password Input */
    .password-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .password-input-wrapper .form-input {
      padding-right: 3rem;
      flex: 1;
    }

    .password-toggle {
      position: absolute;
      right: 0.625rem;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0.375rem;
      font-size: 0.9375rem;
      transition: color 0.2s ease;
    }

    .password-toggle:hover {
      color: var(--color-burgundy);
    }

    .password-toggle:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Remember Me */
    .remember-me-group {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .remember-me-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      user-select: none;
    }

    .remember-me-checkbox {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
      accent-color: var(--color-burgundy);
    }

    .remember-me-text {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      color: var(--text-primary);
      font-weight: 500;
      font-size: 0.8125rem;
    }

    .remember-me-text i {
      color: var(--color-burgundy);
      font-size: 0.75rem;
    }

    .remember-me-hint {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      font-style: italic;
    }

    /* Warning Message */
    .warning-message {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.75rem;
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: var(--radius-md);
      color: #d97706;
      font-size: 0.8125rem;
      animation: shake 0.3s ease-in-out;
    }

    .warning-message i {
      font-size: 0.9375rem;
      flex-shrink: 0;
    }

    /* Error Message */
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.75rem;
      background: rgba(220, 38, 38, 0.1);
      border: 1px solid rgba(220, 38, 38, 0.3);
      border-radius: var(--radius-md);
      color: #dc2626;
      font-size: 0.8125rem;
      animation: shake 0.3s ease-in-out;
    }

    .error-message i {
      font-size: 0.9375rem;
      flex-shrink: 0;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    /* Submit Button */
    .btn-login {
      padding: 1rem;
      background: linear-gradient(135deg, var(--color-burgundy) 0%, #a5264a 100%);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.625rem;
      transition: all 0.3s ease;
      margin-top: 0.5rem;
    }

    .btn-login:hover:not(:disabled) {
      background: linear-gradient(135deg, #a5264a 0%, var(--color-burgundy) 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(125, 25, 53, 0.3);
    }

    .btn-login:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-login i {
      font-size: 1.125rem;
    }

    /* Footer */
    .login-footer {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
      text-align: center;
    }

    .security-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: var(--text-tertiary);
      font-size: 0.8125rem;
    }

    .security-note i {
      color: var(--color-sage);
    }

    /* Back to Home */
    .back-to-home {
      margin-top: 2rem;
      text-align: center;
    }

    .home-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9375rem;
      transition: all 0.2s ease;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
    }

    .home-link:hover {
      color: var(--color-burgundy);
      background: var(--bg-secondary);
    }

    /* Responsive */
    @media (max-width: 640px) {
      .login-card {
        padding: 2rem 1.5rem;
      }

      .login-title {
        font-size: 1.75rem;
      }

      .brand-icon {
        width: 70px;
        height: 70px;
      }

      .brand-icon i {
        font-size: 2rem;
      }

      .remember-me-group {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .remember-me-hint {
        margin-left: 1.75rem;
      }
    }

    /* Dark mode adjustments */
    :root.dark-theme .login-card,
    [data-theme='dark'] .login-card {
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }
  `]
})
export class AdminLoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  warningMessage = signal<string | null>(null);

  constructor(
    private authService: AdminAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    // Check for session termination message
    this.checkSessionTermination();
  }

  /**
   * Check if user was logged out due to session termination
   */
  private checkSessionTermination(): void {
    const reason = this.route.snapshot.queryParams['reason'];
    
    if (reason === 'session-terminated') {
      // Notification already shown by auth service
      // Just clear the query params by navigating to clean URL
      this.router.navigate(['/admin/login'], { replaceUrl: true });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  async onSubmit(): Promise<void> {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.warningMessage.set(null);

    try {
      await this.authService.login(this.email.trim(), this.password, this.rememberMe);
      
      this.notificationService.success('Welcome back! Signed in successfully.');

      // Get return URL from query params or default to /admin
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
      this.router.navigate([returnUrl]);
    } catch (error: any) {
      this.errorMessage.set(error.message);
      this.notificationService.error(error.message);
    } finally {
      this.isLoading.set(false);
    }
  }
}
