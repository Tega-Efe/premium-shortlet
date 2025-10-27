import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApartmentService } from '../../core/services';
import { ThemeService } from '../../core/services/theme.service';
import { Apartment } from '../../core/interfaces';
import { CardComponent } from '../../shared/components/card/card.component';
import { AnimateOnScrollDirective } from '../../core/directives/animate-on-scroll.directive';
import { HoverEffectDirective } from '../../core/directives/hover-effect.directive';
import { TypingEffectDirective } from '../../shared/directives/typing-effect.directive';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, CardComponent, AnimateOnScrollDirective, HoverEffectDirective, TypingEffectDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing.component.html', styles: [`
    .landing-page {
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* Hero Section */
    .hero {
      position: relative;
      min-height: 90vh;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 4rem;
      align-items: center;
      padding: 6rem 2rem 4rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      overflow: hidden;
    }

    .bg-svg {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--bg-secondary);
      color: var(--color-burgundy, #7D1935);
      padding: 0.5rem 1.25rem;
      border-radius: 2rem;
      font-size: 0.875rem;
      font-weight: 600;
      border: 1px solid var(--border-color);
      width: fit-content;
      box-shadow: 0 2px 8px rgba(125, 25, 53, 0.1);
    }

    .hero-badge i {
      color: var(--color-gold, #D4AF37);
      font-size: 1rem;
    }

    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: 3.75rem;
      font-weight: 700;
      line-height: 1.1;
      color: var(--color-charcoal, #2C2C2C);
      margin: 0;
    }

    .highlight {
      display: block;
      background: linear-gradient(135deg, var(--color-tan, #D4A574) 0%, var(--color-burgundy, #7D1935) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-top: 0.25rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--color-warm-gray, #6B6B6B);
      line-height: 1.8;
      margin: 0;
      max-width: 600px;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin-top: 3rem;
      padding: 2rem;
      background: var(--bg-secondary);
      border-radius: 1rem;
      box-shadow: 0 4px 20px rgba(125, 25, 53, 0.08);
      border: 1px solid var(--border-color);
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      text-align: center;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--color-tan, #D4A574) 0%, var(--color-terracotta, #C17D5C) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, var(--color-tan, #D4A574) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--color-warm-gray, #6B6B6B);
      font-weight: 500;
    }

    /* Hero Image */
    .hero-image {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .image-container {
      position: relative;
      width: 100%;
      max-width: 500px;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .main-illustration {
      width: 280px;
      height: 280px;
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, var(--color-terracotta, #C17D5C) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8rem;
      color: white;
      box-shadow: 0 20px 60px rgba(125, 25, 53, 0.25);
      position: relative;
      z-index: 1;
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .floating-card {
      position: absolute;
      background: white;
      padding: 1rem 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 10px 30px rgba(125, 25, 53, 0.15);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--color-charcoal, #2C2C2C);
      border: 1px solid rgba(212, 165, 116, 0.2);
      animation: floatCard 4s ease-in-out infinite;
    }

    .floating-card i {
      font-size: 1.5rem;
      color: var(--color-burgundy, #7D1935);
    }

    .card-1 {
      top: 10%;
      left: 5%;
      animation-delay: 0s;
    }

    .card-2 {
      top: 50%;
      right: 0%;
      animation-delay: 1s;
    }

    .card-3 {
      bottom: 15%;
      left: 10%;
      animation-delay: 2s;
    }

    @keyframes floatCard {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(2deg); }
    }

    /* Sections */
    .featured-section,
    .features-section,
    .testimonials-section {
      padding: 5rem 2rem;
      background-color: var(--color-cream, #FFF8F0);
    }

    .features-section {
      background: var(--bg-primary);
    }

    .section-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--bg-secondary);
      color: var(--color-burgundy, #7D1935);
      padding: 0.5rem 1.25rem;
      border-radius: 2rem;
      font-size: 0.875rem;
      font-weight: 600;
      border: 1px solid var(--border-color);
      margin-bottom: 1.5rem;
    }

    .section-tag i {
      color: var(--color-gold, #D4AF37);
    }

    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 2.75rem;
      font-weight: 700;
      color: var(--color-charcoal, #2C2C2C);
      margin: 0 0 1rem 0;
    }

    .section-subtitle {
      font-size: 1.125rem;
      color: var(--color-warm-gray, #6B6B6B);
      margin: 0;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .apartments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .loading-state {
      text-align: center;
      padding: 5rem 2rem;
      color: var(--color-warm-gray, #6B6B6B);
    }

    .spinner {
      font-size: 3rem;
      color: var(--color-burgundy, #7D1935);
      margin-bottom: 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
    }

    .empty-icon {
      font-size: 5rem;
      color: var(--color-tan, #D4A574);
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.75rem;
      color: var(--color-charcoal, #2C2C2C);
      margin: 0 0 1rem 0;
    }

    .empty-state p {
      color: var(--color-warm-gray, #6B6B6B);
      margin: 0;
    }

    .section-footer {
      text-align: center;
      margin-top: 3rem;
    }

    /* Features Grid */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: var(--bg-secondary);
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 20px rgba(125, 25, 53, 0.06);
      text-align: center;
      transition: all 0.3s ease;
      border: 1px solid var(--border-color);
      position: relative;
      overflow: hidden;
    }

    .feature-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, transparent, var(--color-burgundy, #7D1935), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(125, 25, 53, 0.12);
    }

    .feature-card:hover::before {
      opacity: 1;
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: white;
      position: relative;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .feature-icon.burgundy {
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, #9B2447 100%);
    }

    .feature-icon.tan {
      background: linear-gradient(135deg, var(--color-tan, #D4A574) 0%, var(--color-gold, #D4AF37) 100%);
    }

    .feature-icon.terracotta {
      background: linear-gradient(135deg, var(--color-terracotta, #C17D5C) 0%, #D4A574 100%);
    }

    .feature-icon.sage {
      background: linear-gradient(135deg, var(--color-sage, #A8B4A5) 0%, #8B9986 100%);
    }

    .feature-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 1rem 0;
    }

    .feature-description {
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0;
      font-size: 1rem;
    }

    /* Testimonials */
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }

    .testimonial-card {
      background: var(--bg-secondary);
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 20px rgba(125, 25, 53, 0.06);
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      transition: all 0.3s ease;
    }

    .testimonial-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(125, 25, 53, 0.12);
    }

    .testimonial-rating {
      display: flex;
      gap: 0.25rem;
      color: var(--color-gold, #D4AF37);
      font-size: 1.125rem;
    }

    .testimonial-text {
      font-size: 1.0625rem;
      line-height: 1.8;
      color: var(--text-primary);
      font-style: italic;
      margin: 0;
      flex-grow: 1;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(212, 165, 116, 0.2);
    }

    .author-avatar {
      width: 52px;
      height: 52px;
      background: linear-gradient(135deg, var(--color-tan, #D4A574) 0%, var(--color-terracotta, #C17D5C) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .author-info {
      flex-grow: 1;
    }

    .author-name {
      font-weight: 700;
      color: var(--color-charcoal, #2C2C2C);
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
    }

    .author-role {
      font-size: 0.875rem;
      color: var(--color-warm-gray, #6B6B6B);
      margin: 0;
    }

    /* CTA Section */
    .cta-section {
      position: relative;
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, #9B2447 50%, var(--color-terracotta, #C17D5C) 100%);
      padding: 6rem 2rem;
      overflow: hidden;
    }

    .cta-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.3;
    }

    .cta-background svg {
      width: 100%;
      height: 100%;
    }

    .cta-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
      color: white;
      position: relative;
      z-index: 1;
    }

    .cta-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      margin: 0 auto 2rem;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .cta-title {
      font-family: 'Playfair Display', serif;
      font-size: 2.75rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .cta-subtitle {
      font-size: 1.25rem;
      margin: 0 0 2.5rem 0;
      opacity: 0.95;
      line-height: 1.6;
    }

    .btn-cta {
      background: white;
      color: var(--color-burgundy, #7D1935);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-cta:hover {
      background: var(--color-cream, #FFF8F0);
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    }

    .cta-features {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 3rem;
      flex-wrap: wrap;
    }

    .cta-feature {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 500;
      opacity: 0.95;
    }

    .cta-feature i {
      font-size: 1.125rem;
      color: var(--color-gold, #D4AF37);
    }

    /* Buttons */
    .btn {
      padding: 0.875rem 1.75rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.625rem;
      font-family: inherit;
    }

    .btn i {
      font-size: 1.125rem;
    }

    .btn-lg {
      padding: 1.125rem 2.25rem;
      font-size: 1.0625rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, #9B2447 100%);
      color: white;
      box-shadow: 0 4px 14px rgba(125, 25, 53, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(125, 25, 53, 0.4);
    }

    .btn-secondary {
      background: white;
      color: var(--color-burgundy, #7D1935);
      border: 2px solid var(--color-burgundy, #7D1935);
      box-shadow: 0 2px 8px rgba(125, 25, 53, 0.1);
    }

    .btn-secondary:hover {
      background: var(--color-burgundy, #7D1935);
      color: white;
      transform: translateY(-2px);
    }

    .btn-outline {
      background-color: transparent;
      color: var(--color-burgundy, #7D1935);
      border: 2px solid var(--color-burgundy, #7D1935);
      padding: 0.875rem 2rem;
    }

    .btn-outline:hover {
      background: var(--color-burgundy, #7D1935);
      color: white;
      transform: translateY(-2px);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero {
        grid-template-columns: 1fr;
        min-height: auto;
        padding: 4rem 1.5rem 3rem;
        gap: 3rem;
      }

      .hero-title {
        font-size: 3rem;
      }

      .image-container {
        max-width: 400px;
      }

      .main-illustration {
        width: 220px;
        height: 220px;
        font-size: 6rem;
      }

      .stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .section-title {
        font-size: 2.25rem;
      }

      .cta-title {
        font-size: 2.25rem;
      }
    }

    @media (max-width: 768px) {
      .hero {
        padding: 3rem 1rem 2rem;
      }

      .hero-title {
        font-size: 2.25rem;
      }

      .section-title {
        font-size: 1.875rem;
      }

      .cta-title {
        font-size: 1.875rem;
      }

      .hero-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }

      .apartments-grid {
        grid-template-columns: 1fr;
      }

      .stats {
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        padding: 1.5rem;
      }

      .stat-icon {
        width: 40px;
        height: 40px;
        font-size: 1rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .floating-card {
        font-size: 0.75rem;
        padding: 0.75rem 1rem;
      }

      .floating-card i {
        font-size: 1.125rem;
      }

      .card-1, .card-2, .card-3 {
        display: none;
      }

      .main-illustration {
        width: 200px;
        height: 200px;
        font-size: 5rem;
      }

      .featured-section,
      .features-section,
      .testimonials-section {
        padding: 3rem 1rem;
      }

      .section-header {
        margin-bottom: 2.5rem;
      }

      .feature-card,
      .testimonial-card {
        padding: 2rem;
      }

      .cta-section {
        padding: 4rem 1rem;
      }

      .cta-features {
        flex-direction: column;
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 1.875rem;
      }

      .stats {
        grid-template-columns: 1fr;
      }

      .apartments-grid,
      .features-grid,
      .testimonials-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LandingComponent implements OnInit {
  private apartmentService = inject(ApartmentService);
  private router = inject(Router);
  protected themeService = inject(ThemeService);

  featuredApartments = signal<Apartment[]>([]);
  isLoading = signal<boolean>(false);
  stats = signal({
    totalListings: 150,
    totalBookings: 500,
    cities: 12
  });

  ngOnInit(): void {
    this.loadFeaturedApartments();
  }

  loadFeaturedApartments(): void {
    this.isLoading.set(true);
    this.apartmentService.getApartments().subscribe({
      next: (apartments) => {
        // Take first 6 apartments as featured
        this.featuredApartments.set(apartments.slice(0, 6));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  navigateToBrowse(): void {
    this.router.navigate(['/home']);
  }

  scrollToFeatured(): void {
    const element = document.getElementById('featured');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  onBookApartment(apartment: Apartment): void {
    // Navigate to home with selected apartment
    this.router.navigate(['/home'], { 
      queryParams: { apartmentId: apartment.id } 
    });
  }
}


