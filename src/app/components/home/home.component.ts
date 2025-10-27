import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <nav class="navbar">
        <div class="nav-content">
          <h1>Shortlet Connect</h1>
          <div class="nav-actions">
            @if (currentUser()) {
              <span class="user-name">Hello, {{ currentUser()?.displayName || currentUser()?.email }}</span>
              <button (click)="logout()" class="btn-logout">Logout</button>
            } @else {
              <a routerLink="/login" class="btn-link">Login</a>
              <a routerLink="/signup" class="btn-primary">Sign Up</a>
            }
          </div>
        </div>
      </nav>

      <main class="main-content">
        <div class="hero">
          <h2>Welcome to Shortlet Connect</h2>
          <p>Your Angular app with Firebase integration is ready!</p>
          
          @if (currentUser()) {
            <div class="user-info">
              <h3>You are logged in!</h3>
              <div class="info-card">
                <p><strong>Email:</strong> {{ currentUser()?.email }}</p>
                @if (currentUser()?.displayName) {
                  <p><strong>Name:</strong> {{ currentUser()?.displayName }}</p>
                }
                <p><strong>UID:</strong> {{ currentUser()?.uid }}</p>
                <p><strong>Email Verified:</strong> {{ currentUser()?.emailVerified ? 'Yes' : 'No' }}</p>
              </div>
            </div>
          } @else {
            <div class="cta">
              <p>Get started by creating an account or logging in</p>
              <div class="button-group">
                <a routerLink="/signup" class="btn-large btn-primary">Get Started</a>
                <a routerLink="/login" class="btn-large btn-secondary">Login</a>
              </div>
            </div>
          }
        </div>

        <div class="features">
          <h3>Firebase Features Integrated</h3>
          <div class="feature-grid">
            <div class="feature-card">
              <h4>🔐 Authentication</h4>
              <p>Email/Password and Google Sign-in ready to use</p>
            </div>
            <div class="feature-card">
              <h4>🔥 Firestore</h4>
              <p>NoSQL database for storing and syncing data</p>
            </div>
            <div class="feature-card">
              <h4>📁 Storage</h4>
              <p>File upload and download capabilities</p>
            </div>
            <div class="feature-card">
              <h4>🚀 Hosting</h4>
              <p>Deploy your app with Firebase Hosting</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .navbar {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 1rem 0;
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h1 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .nav-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .user-name {
      color: #555;
      font-weight: 500;
    }

    .btn-link, .btn-primary, .btn-logout {
      padding: 0.5rem 1.5rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-link {
      color: #667eea;
      background: transparent;
    }

    .btn-link:hover {
      background: rgba(102, 126, 234, 0.1);
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-logout {
      background: #dc3545;
      color: white;
    }

    .btn-logout:hover {
      background: #c82333;
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .hero {
      text-align: center;
      color: white;
      margin-bottom: 60px;
    }

    .hero h2 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .hero > p {
      font-size: 1.5rem;
      opacity: 0.9;
      margin-bottom: 2rem;
    }

    .user-info {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      padding: 2rem;
      margin: 2rem auto;
      max-width: 600px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .user-info h3 {
      color: #333;
      margin-bottom: 1.5rem;
    }

    .info-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      text-align: left;
    }

    .info-card p {
      color: #555;
      margin: 0.75rem 0;
      font-size: 1rem;
    }

    .cta {
      margin: 2rem 0;
    }

    .cta p {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-large {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      display: inline-block;
    }

    .btn-large.btn-primary {
      background: white;
      color: #667eea;
    }

    .btn-large.btn-primary:hover {
      background: #f8f9fa;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .btn-large.btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-large.btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .features {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      padding: 3rem 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .features h3 {
      text-align: center;
      color: #333;
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      text-align: center;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      transition: transform 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-card h4 {
      color: #667eea;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .hero h2 {
        font-size: 2rem;
      }

      .hero > p {
        font-size: 1.2rem;
      }

      .nav-content {
        flex-direction: column;
        gap: 1rem;
      }

      .feature-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  currentUser = signal<User | null>(null);
  private userSubscription?: Subscription;

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.currentUser.set(user);
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  async logout() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
