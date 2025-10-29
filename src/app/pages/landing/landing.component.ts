import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApartmentBrowsingService } from '../../core/services/apartment-browsing.service';
import { ThemeService } from '../../core/services/theme.service';
import { Apartment } from '../../core/interfaces';
import { AnimateOnScrollDirective, HoverEffectDirective, TypingEffectDirective } from '../../core/directives';

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
      min-height: 85vh;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 2.5rem;
      align-items: center;
      padding: 4rem 1.5rem 3rem;
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
      gap: 1rem;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--bg-secondary);
      color: var(--color-burgundy, #7D1935);
      padding: 0.4rem 1rem;
      border-radius: 2rem;
      font-size: 0.8125rem;
      font-weight: 600;
      border: 1px solid var(--border-color);
      width: fit-content;
      box-shadow: 0 2px 8px rgba(125, 25, 53, 0.1);
      margin-bottom: 1rem; /* Add space between badge and title */
    }

    .hero-badge i {
      color: var(--color-gold, #D4AF37);
      font-size: 0.875rem;
    }

    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.75rem, 4vw, 2.75rem);
      font-weight: 700;
      line-height: 1.15;
      color: var(--color-charcoal, #2C2C2C);
      margin: 0;
    }

    .highlight {
      display: block;
      background: linear-gradient(135deg, var(--color-tan, #D4A574) 0%, var(--color-burgundy, #7D1935) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-top: 0.2rem;
    }

    .hero-subtitle {
      font-size: clamp(0.875rem, 1.8vw, 1rem);
      color: var(--color-warm-gray, #6B6B6B);
      line-height: 1.6;
      margin: 0;
      max-width: 600px;
    }

    .hero-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-top: 0.75rem;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: 0.75rem;
      box-shadow: 0 4px 20px rgba(125, 25, 53, 0.08);
      border: 1px solid var(--border-color);
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      text-align: center;
    }

    .stat-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--color-tan, #D4A574) 0%, var(--color-terracotta, #C17D5C) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
      margin-bottom: 0.15rem;
    }

    .stat-value {
      font-size: clamp(1.25rem, 3vw, 1.5rem);
      font-weight: 700;
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, var(--color-tan, #D4A574) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      font-size: 0.8125rem;
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
      width: clamp(150px, 35vw, 220px);
      height: clamp(150px, 35vw, 220px);
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, var(--color-terracotta, #C17D5C) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: clamp(4rem, 12vw, 6rem);
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
      padding: 0.75rem 1.125rem;
      border-radius: 0.75rem;
      box-shadow: 0 10px 30px rgba(125, 25, 53, 0.15);
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-weight: 600;
      font-size: 0.8125rem;
      color: var(--text-primary);
      border: 1px solid rgba(212, 165, 116, 0.2);
      animation: floatCard 4s ease-in-out infinite;
    }

    .floating-card i {
      font-size: 1.25rem;
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
      padding: 3.5rem 1.5rem;
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
      margin-bottom: 2.5rem;
    }

    .section-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--bg-secondary);
      color: var(--color-burgundy, #7D1935);
      padding: 0.4rem 1rem;
      border-radius: 2rem;
      font-size: 0.8125rem;
      font-weight: 600;
      border: 1px solid var(--border-color);
      margin-bottom: 1rem;
    }

    .section-tag i {
      color: var(--color-gold, #D4AF37);
    }

    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.5rem, 3.5vw, 2.125rem);
      font-weight: 700;
      color: var(--color-charcoal, #2C2C2C);
      margin: 0 0 0.75rem 0;
    }

    .section-subtitle {
      font-size: clamp(0.875rem, 1.8vw, 0.9375rem);
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
      margin: 0 auto 2rem;
      padding: 0 3rem;
    }

    .gallery-loading {
      position: relative;
      max-width: 1000px;
      margin: 0 auto 2rem;
      aspect-ratio: 16/9;
      background: var(--bg-secondary);
      border-radius: var(--radius-xl);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      box-shadow: 0 8px 32px rgba(125, 25, 53, 0.12);
    }

    .gallery-loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(125, 25, 53, 0.1);
      border-top-color: var(--color-burgundy, #7D1935);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .gallery-loading-text {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      font-weight: 500;
    }

    .gallery-slider {
      overflow: hidden;
      border-radius: var(--radius-xl);
      box-shadow: 0 8px 32px rgba(125, 25, 53, 0.12);
      position: relative;
      width: 100%;
    }

    .gallery-track {
      display: flex;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      width: 100%;
    }

    .gallery-slide {
      min-width: 100%;
      width: 100%;
      aspect-ratio: 16/9;
      flex-shrink: 0;
      position: relative;
    }

    .gallery-image {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, var(--color-tan, #D4A574) 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
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
      font-size: clamp(3.5rem, 10vw, 5rem);
      color: white;
      opacity: 0.95;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
      z-index: 1;
    }

    .gallery-actual-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      inset: 0;
    }

    .gallery-label {
      color: white;
      font-size: clamp(1rem, 3vw, 1.375rem);
      font-weight: 700;
      text-align: center;
      padding: 0.5rem 1.5rem;
      background: rgba(0, 0, 0, 0.5);
      border-radius: var(--radius-md);
      backdrop-filter: blur(12px);
      z-index: 2;
      font-family: 'Playfair Display', serif;
      position: relative;
      max-width: 90%;
      word-wrap: break-word;
    }

    .gallery-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.95);
      border: none;
      color: var(--color-burgundy, #7D1935);
      font-size: 1rem;
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
      gap: 0.5rem;
      margin-top: 1.25rem;
    }

    .gallery-dot {
      width: 10px;
      height: 10px;
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
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .loading-state {
      text-align: center;
      padding: 3rem 1.5rem;
      color: var(--color-warm-gray, #6B6B6B);
    }

    .spinner {
      font-size: 2.5rem;
      color: var(--color-burgundy, #7D1935);
      margin-bottom: 0.75rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1.5rem;
    }

    .empty-icon {
      font-size: 4rem;
      color: var(--color-tan, #D4A574);
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem;
      color: var(--color-charcoal, #2C2C2C);
      margin: 0 0 0.75rem 0;
    }

    .empty-state p {
      color: var(--color-warm-gray, #6B6B6B);
      margin: 0;
    }

    .section-footer {
      text-align: center;
      margin-top: 2rem;
    }

    /* Features Grid */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.25rem;
    }

    .feature-card {
      background: var(--bg-secondary);
      padding: 1.75rem;
      border-radius: 0.875rem;
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
      width: clamp(52px, 12vw, 64px);
      height: clamp(52px, 12vw, 64px);
      margin: 0 auto 1rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: clamp(1.25rem, 4vw, 1.625rem);
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
      font-size: clamp(1rem, 2.2vw, 1.25rem);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.75rem 0;
    }

    .feature-description {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
      font-size: clamp(0.8125rem, 1.6vw, 0.9375rem);
    }

    /* Testimonials */
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .testimonial-card {
      background: var(--bg-secondary);
      padding: 1.75rem;
      border-radius: 0.875rem;
      box-shadow: 0 4px 20px rgba(125, 25, 53, 0.06);
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: all 0.3s ease;
    }

    .testimonial-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(125, 25, 53, 0.12);
    }

    .testimonial-rating {
      display: flex;
      gap: 0.2rem;
      color: var(--color-gold, #D4AF37);
      font-size: 1rem;
    }

    .testimonial-text {
      font-size: 0.9375rem;
      line-height: 1.7;
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
      padding: 4rem 1.5rem;
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
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1.5rem;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .cta-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.625rem, 4vw, 2.125rem);
      font-weight: 700;
      margin: 0 0 0.75rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .cta-subtitle {
      font-size: clamp(0.9375rem, 2vw, 1.125rem);
      margin: 0 0 2rem 0;
      opacity: 0.95;
      line-height: 1.5;
    }

    .btn-cta {
      background: var(--bg-secondary);
      color: var(--color-burgundy, #7D1935);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
    }

    .btn-cta:hover {
      background: var(--bg-primary);
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    }

    .cta-features {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    }

    .cta-feature {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.875rem;
      font-weight: 500;
      opacity: 0.95;
    }

    .cta-feature i {
      font-size: 1rem;
      color: var(--color-gold, #D4AF37);
    }

    /* Buttons */
    .btn {
      padding: clamp(0.625rem, 2vw, 0.75rem) clamp(1.25rem, 3vw, 1.5rem);
      border: none;
      border-radius: 0.5rem;
      font-size: clamp(0.8125rem, 1.8vw, 0.9375rem);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-family: inherit;
    }

    .btn i {
      font-size: clamp(0.9375rem, 2vw, 1rem);
    }

    .btn-lg {
      padding: clamp(0.75rem, 2.2vw, 1rem) clamp(1.5rem, 3.5vw, 2rem);
      font-size: clamp(0.875rem, 1.9vw, 1rem);
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
        padding: 3rem 1.25rem 2.5rem;
        gap: 2rem;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .image-container {
        max-width: 360px;
      }

      .main-illustration {
        width: 180px;
        height: 180px;
        font-size: 5rem;
      }

      .stats {
        grid-template-columns: repeat(4, 1fr);
        gap: 0.625rem;
        padding: 0.875rem;
      }

      .section-title {
        font-size: 2rem;
      }

      .cta-title {
        font-size: 2rem;
      }

      .gallery-container {
        padding: 0 2.5rem;
      }

      .gallery-nav {
        width: 36px;
        height: 36px;
        font-size: 0.875rem;
      }
    }

    @media (max-width: 768px) {
      .hero {
        padding: 2.5rem 1rem 2rem;
        gap: 1.5rem;
      }

      .hero-title {
        font-size: 2rem;
      }

      .section-title {
        font-size: 1.75rem;
      }

      .cta-title {
        font-size: 1.75rem;
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
        max-width: 100%;
      }

      .gallery-loading {
        aspect-ratio: 4/3;
        margin: 0 0 2rem;
        max-height: 400px;
      }

      .gallery-slider {
        position: relative;
        width: 100%;
      }

      .gallery-track {
        width: 100%;
      }

      .gallery-slide {
        aspect-ratio: 4/3;
        width: 100%;
        max-height: 400px;
      }

      .gallery-image {
        padding: 1rem;
        width: 100%;
        height: 100%;
      }

      .gallery-label {
        font-size: 0.875rem;
        padding: 0.4rem 1rem;
      }

      .gallery-nav {
        width: 32px;
        height: 32px;
        font-size: 0.75rem;
      }

      .gallery-dot {
        width: 8px;
        height: 8px;
      }

      .apartments-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .stats {
        grid-template-columns: repeat(4, 1fr);
        gap: 0.625rem;
        padding: 0.875rem;
      }

      .stat-icon {
        width: 32px;
        height: 32px;
        font-size: 0.875rem;
      }

      .stat-value {
        font-size: 1.25rem;
      }

      .stat-label {
        font-size: 0.75rem;
      }

      .floating-card {
        font-size: 0.6875rem;
        padding: 0.625rem 0.875rem;
      }

      .floating-card i {
        font-size: 1rem;
      }

      .card-1, .card-2, .card-3 {
        display: none;
      }

      .main-illustration {
        width: 160px;
        height: 160px;
        font-size: 4.5rem;
      }

      .featured-section,
      .features-section,
      .testimonials-section {
        padding: 2.5rem 1rem;
      }

      .section-header {
        margin-bottom: 1.75rem;
      }

      .feature-card,
      .testimonial-card {
        padding: 1.5rem;
      }

      .cta-section {
        padding: 3rem 1rem;
      }

      .cta-features {
        flex-direction: column;
        gap: 0.75rem;
      }
    }

    @media (max-width: 480px) {
      .hero-badge {
        margin-top: 1rem; /* Add space before badge on mobile */
      }

      .hero-title {
        font-size: 1.625rem;
      }

      .stats {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
        padding: 0.75rem;
      }

      .stat-icon {
        width: 28px;
        height: 28px;
        font-size: 0.75rem;
      }

      .stat-value {
        font-size: 1.125rem;
      }

      .stat-label {
        font-size: 0.6875rem;
      }

      .gallery-container {
        padding: 0 2rem;
        max-width: 100%;
      }

      .gallery-loading {
        aspect-ratio: 4/3;
        border-radius: var(--radius-lg);
        max-height: 280px;
      }

      .gallery-loading-spinner {
        width: 40px;
        height: 40px;
        border-width: 3px;
      }

      .gallery-loading-text {
        font-size: 0.8125rem;
      }

      .gallery-slider {
        border-radius: var(--radius-lg);
        position: relative;
        width: 100%;
        overflow: hidden;
      }

      .gallery-track {
        width: 100%;
      }

      .gallery-slide {
        aspect-ratio: 4/3;
        width: 100%;
        max-height: 280px;
      }

      .gallery-image {
        padding: 0.75rem;
        width: 100%;
        height: 100%;
      }

      .gallery-image i {
        font-size: 2.5rem;
      }

      .gallery-label {
        font-size: 0.75rem;
        padding: 0.35rem 0.75rem;
      }

      .gallery-nav {
        width: 28px;
        height: 28px;
        font-size: 0.625rem;
      }

      .gallery-dots {
        margin-top: 1rem;
      }

      .gallery-dot {
        width: 7px;
        height: 7px;
        border-width: 1.5px;
      }

      .apartments-grid,
      .features-grid,
      .testimonials-grid {
        grid-template-columns: 1fr;
      }

      .feature-card,
      .testimonial-card {
        padding: 1.25rem;
      }
    }
  `]
})
export class LandingComponent implements OnInit, OnDestroy {
  private apartmentService = inject(ApartmentBrowsingService);
  private router = inject(Router);
  protected themeService = inject(ThemeService);

  featuredApartments = signal<Apartment[]>([]);
  isLoading = signal<boolean>(false);
  isGalleryLoading = signal<boolean>(true);
  stats = signal({
    totalListings: 1, // Single two-bedroom apartment
    totalBookings: 12, // Realistic for small-scale operation
    cities: 1 // Single location: Lagos
  });

  // Gallery carousel state
  currentSlide = signal(0);
  private autoPlayInterval?: number;
  galleryImages: { url?: string; icon?: string; label: string }[] = [];

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
    this.isGalleryLoading.set(true);
    this.apartmentService.getApartments().subscribe({
      next: (apartments) => {
        // Take first 6 apartments as featured
        this.featuredApartments.set(apartments.slice(0, 6));
        
        // Populate gallery with actual apartment images from database
        const allImages: { url?: string; icon?: string; label: string }[] = [];
        apartments.forEach((apartment, index) => {
          if (apartment.images && apartment.images.length > 0) {
            apartment.images.forEach((imageUrl, imgIndex) => {
              allImages.push({
                url: imageUrl,
                label: `${apartment.title} - Image ${imgIndex + 1}`
              });
            });
          }
        });
        
        // Update gallery images
        this.galleryImages = allImages.length > 0 ? allImages : [];
        
        this.isLoading.set(false);
        this.isGalleryLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.isGalleryLoading.set(false);
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


