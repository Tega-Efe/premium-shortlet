import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <nav class="navbar">
        <div class="nav-content">
          <h1>Shortlet Connect</h1>
        </div>
      </nav>

      <main class="main-content">
        <div class="hero">
          <h2>Welcome to Shortlet Connect</h2>
          <p>Your booking management system powered by Firebase!</p>
          
          <div class="cta">
            <p>Start managing your shortlet bookings</p>
          </div>
        </div>

        <div class="features">
          <h3>Firebase Features Integrated</h3>
          <div class="feature-grid">
            <div class="feature-card">
              <h4>� Firestore</h4>
              <p>Real-time NoSQL database for storing booking data</p>
            </div>
            <div class="feature-card">
              <h4>� Storage</h4>
              <p>File upload and download capabilities for documents</p>
            </div>
            <div class="feature-card">
              <h4>� Hosting</h4>
              <p>Deploy your app with Firebase Hosting</p>
            </div>
            <div class="feature-card">
              <h4>⚡ Real-time</h4>
              <p>Live updates for booking status and data</p>
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

    .cta {
      margin: 2rem 0;
    }

    .cta p {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
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
export class HomeComponent {
}
