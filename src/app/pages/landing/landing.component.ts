import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApartmentServiceFirestore } from '../../core/services/apartment.service.firestore';
import { ThemeService } from '../../core/services/theme.service';
import { Apartment } from '../../core/interfaces';
import { AnimateOnScrollDirective } from '../../core/directives/animate-on-scroll.directive';
import { HoverEffectDirective } from '../../core/directives/hover-effect.directive';
import { TypingEffectDirective } from '../../shared/directives/typing-effect.directive';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective, HoverEffectDirective, TypingEffectDirective],
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
      font-size: clamp(2rem, 4vw, 3.25rem); /* Responsive: 2rem mobile, scales to 3.25rem desktop */
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
      font-size: clamp(0.95rem, 1.8vw, 1.125rem); /* Responsive subtitle */
      color: var(--color-warm-gray, #6B6B6B);
      line-height: 1.75;
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
      font-size: clamp(1.5rem, 3vw, 1.875rem); /* Responsive stat values */
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
      width: clamp(180px, 35vw, 260px); /* Responsive illustration */
      height: clamp(180px, 35vw, 260px);
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, var(--color-terracotta, #C17D5C) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: clamp(4.5rem, 12vw, 7rem); /* Responsive icon size */
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
      background: var(--bg-secondary);
      padding: 1rem 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 10px 30px rgba(125, 25, 53, 0.15);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-primary);
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
      font-size: clamp(1.75rem, 3.5vw, 2.5rem); /* Responsive section titles */
      font-weight: 700;
      color: var(--color-charcoal, #2C2C2C);
      margin: 0 0 1rem 0;
    }

    .section-subtitle {
      font-size: clamp(0.95rem, 1.8vw, 1.0625rem); /* Responsive subtitle */
      color: var(--color-warm-gray, #6B6B6B);
      margin: 0;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Gallery Carousel */
    .gallery-container {
      position: relative;
      max-width: 1000px;
      margin: 0 auto 3rem;
      padding: 0 4rem;
    }

    .gallery-slider {
      overflow: hidden;
      border-radius: var(--radius-xl);
      box-shadow: 0 8px 32px rgba(125, 25, 53, 0.12);
    }

    .gallery-track {
      display: flex;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .gallery-slide {
      min-width: 100%;
      aspect-ratio: 16/9;
      flex-shrink: 0;
    }

    .gallery-image {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, var(--color-tan, #D4A574) 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      position: relative;
      overflow: hidden;
    }

    .gallery-image::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
      opacity: 0.5;
    }

    .gallery-image i {
      font-size: clamp(4rem, 10vw, 6rem);
      color: white;
      opacity: 0.95;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
      z-index: 1;
    }

    .gallery-label {
      color: white;
      font-size: clamp(1.25rem, 3vw, 1.75rem);
      font-weight: 700;
      text-align: center;
      padding: 0.75rem 2rem;
      background: rgba(0, 0, 0, 0.3);
      border-radius: var(--radius-md);
      backdrop-filter: blur(12px);
      z-index: 1;
      font-family: 'Playfair Display', serif;
    }

    .gallery-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.95);
      border: none;
      color: var(--color-burgundy, #7D1935);
      font-size: 1.25rem;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .gallery-nav:hover {
      background: var(--bg-secondary);
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 6px 20px rgba(125, 25, 53, 0.2);
    }

    .gallery-nav:active {
      transform: translateY(-50%) scale(0.95);
    }

    .gallery-nav-prev {
      left: 0;
    }

    .gallery-nav-next {
      right: 0;
    }

    .gallery-dots {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 2rem;
    }

    .gallery-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid var(--color-burgundy, #7D1935);
      background: transparent;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }

    .gallery-dot:hover {
      background: rgba(125, 25, 53, 0.3);
      transform: scale(1.2);
    }

    .gallery-dot.active {
      background: var(--color-burgundy, #7D1935);
      transform: scale(1.3);
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
      width: clamp(60px, 12vw, 80px); /* Responsive icon container */
      height: clamp(60px, 12vw, 80px);
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: clamp(1.5rem, 4vw, 2rem); /* Responsive icon */
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
      font-size: clamp(1.125rem, 2.2vw, 1.375rem); /* Responsive feature title */
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 1rem 0;
    }

    .feature-description {
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0;
      font-size: clamp(0.875rem, 1.6vw, 1rem); /* Responsive description */
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
      font-size: clamp(1.875rem, 4vw, 2.5rem); /* Responsive CTA title */
      font-weight: 700;
      margin: 0 0 1rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .cta-subtitle {
      font-size: clamp(1rem, 2vw, 1.25rem); /* Responsive subtitle */
      margin: 0 0 2.5rem 0;
      opacity: 0.95;
      line-height: 1.6;
    }

    .btn-cta {
      background: var(--bg-secondary);
      color: var(--color-burgundy, #7D1935);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-cta:hover {
      background: var(--bg-primary);
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
      padding: clamp(0.75rem, 2vw, 0.875rem) clamp(1.5rem, 3vw, 1.75rem); /* Responsive padding */
      border: none;
      border-radius: 0.5rem;
      font-size: clamp(0.875rem, 1.8vw, 1rem); /* Responsive font size */
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
      font-size: clamp(1rem, 2vw, 1.125rem); /* Responsive icon */
    }

    .btn-lg {
      padding: clamp(0.875rem, 2.2vw, 1.125rem) clamp(1.75rem, 3.5vw, 2.25rem); /* Responsive large button */
      font-size: clamp(0.9375rem, 1.9vw, 1.0625rem);
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
      background: var(--bg-secondary);
      color: var(--color-burgundy, #7D1935);
      border: 2px solid var(--color-burgundy, #7D1935);
      box-shadow: 0 2px 8px rgba(125, 25, 53, 0.1);
    }

    .btn-secondary:hover {
      background: var(--color-burgundy, #7D1935);
      color: var(--bg-secondary);
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

      .gallery-container {
        padding: 0 3rem;
      }

      .gallery-nav {
        width: 40px;
        height: 40px;
        font-size: 1rem;
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

      .gallery-container {
        padding: 0 2.5rem;
      }

      .gallery-slide {
        aspect-ratio: 4/3;
      }

      .gallery-nav {
        width: 36px;
        height: 36px;
        font-size: 0.875rem;
      }

      .gallery-dot {
        width: 10px;
        height: 10px;
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
export class LandingComponent implements OnInit, OnDestroy {
  private apartmentService = inject(ApartmentServiceFirestore);
  private router = inject(Router);
  protected themeService = inject(ThemeService);

  featuredApartments = signal<Apartment[]>([]);
  isLoading = signal<boolean>(false);
  stats = signal({
    totalListings: 1, // Single two-bedroom apartment
    totalBookings: 12, // Realistic for small-scale operation
    cities: 1 // Single location: Lagos
  });

  // Gallery carousel state
  currentSlide = signal(0);
  private autoPlayInterval?: number;
  galleryImages = [
    { icon: 'fas fa-bed', label: 'Master Bedroom' },
    { icon: 'fas fa-couch', label: 'Living Room' },
    { icon: 'fas fa-utensils', label: 'Kitchen' },
    { icon: 'fas fa-bath', label: 'Bathroom' },
    { icon: 'fas fa-door-open', label: 'Second Bedroom' },
    { icon: 'fas fa-building', label: 'Exterior View' }
  ];

  ngOnInit(): void {
    this.loadFeaturedApartments();
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  startAutoPlay(): void {
    this.autoPlayInterval = window.setInterval(() => {
      this.nextSlide();
    }, 4000); // Change slide every 4 seconds
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  nextSlide(): void {
    this.currentSlide.update(current => 
      current === this.galleryImages.length - 1 ? 0 : current + 1
    );
  }

  prevSlide(): void {
    this.stopAutoPlay(); // Stop auto-play when user manually navigates
    this.currentSlide.update(current => 
      current === 0 ? this.galleryImages.length - 1 : current - 1
    );
    this.startAutoPlay(); // Restart auto-play
  }

  goToSlide(index: number): void {
    this.stopAutoPlay(); // Stop auto-play when user manually navigates
    this.currentSlide.set(index);
    this.startAutoPlay(); // Restart auto-play
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
    this.router.navigate(['/home']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
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


