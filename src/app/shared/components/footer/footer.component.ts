import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TypingEffectDirective } from '../../directives/typing-effect.directive';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink, FormsModule, TypingEffectDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styles: [`
    /* ===== Footer Container ===== */
    .footer {
      background: linear-gradient(180deg, var(--color-charcoal) 0%, var(--color-almost-black) 100%);
      color: var(--color-beige);
      padding: 0 0 2rem;
      margin-top: auto;
      position: relative;
      overflow: hidden;
    }

    .footer-wave {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 120px;
      pointer-events: none;
    }

    .footer-wave svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 5rem var(--spacing-2xl) 0;
      position: relative;
      z-index: 1;
    }

    /* ===== Footer Content Grid ===== */
    .footer-content {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
      gap: var(--spacing-3xl);
      margin-bottom: var(--spacing-3xl);
    }

    .footer-section {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    /* ===== Brand Section ===== */
    .brand-section {
      gap: var(--spacing-lg);
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-family: 'Playfair Display', Georgia, serif;
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-dark-vanilla);
      margin: 0;
    }

    .brand-icon {
      font-size: var(--font-size-3xl);
      color: var(--color-tan);
      transition: transform var(--transition-base);
    }

    .footer-brand:hover .brand-icon {
      transform: scale(1.1) rotate(-5deg);
    }

    .brand-text {
      background: linear-gradient(135deg, var(--color-dark-vanilla) 0%, var(--color-tan-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .footer-description {
      color: var(--color-warm-gray);
      line-height: 1.75;
      margin: 0;
      font-size: var(--font-size-sm);
    }

    /* ===== Section Headings ===== */
    .footer-heading {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-dark-vanilla);
      margin: 0 0 var(--spacing-sm) 0;
      font-family: 'Playfair Display', Georgia, serif;
    }

    .footer-heading i {
      color: var(--color-tan);
      font-size: var(--font-size-base);
    }

    /* ===== Footer Links ===== */
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .footer-links a {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--color-warm-gray);
      text-decoration: none;
      font-size: var(--font-size-sm);
      transition: all var(--transition-fast);
      padding: var(--spacing-xs) 0;
    }

    .footer-links a i {
      font-size: 0.75rem;
      color: var(--color-tan);
      transition: transform var(--transition-fast);
    }

    .footer-links a:hover {
      color: var(--color-tan-light);
      transform: translateX(4px);
    }

    .footer-links a:hover i {
      transform: translateX(2px);
    }

    .contact-links a i {
      font-size: var(--font-size-sm);
    }

    /* ===== Social Links ===== */
    .social-links {
      display: flex;
      gap: var(--spacing-md);
      margin-top: var(--spacing-sm);
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background: rgba(212, 165, 116, 0.1);
      border: 2px solid rgba(212, 165, 116, 0.3);
      border-radius: var(--radius-md);
      color: var(--color-tan);
      font-size: var(--font-size-lg);
      text-decoration: none;
      transition: all var(--transition-base);
    }

    .social-link:hover {
      background: linear-gradient(135deg, var(--color-burgundy) 0%, var(--color-burgundy-light) 100%);
      border-color: var(--color-burgundy);
      color: var(--color-cream);
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(125, 25, 53, 0.3);
    }

    /* ===== Newsletter Section ===== */
    .newsletter-description {
      color: var(--color-warm-gray);
      font-size: var(--font-size-sm);
      line-height: 1.6;
      margin: 0;
    }

    .newsletter-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-xs);
    }

    .input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: var(--spacing-md);
      color: var(--color-warm-gray);
      font-size: var(--font-size-sm);
      pointer-events: none;
    }

    .newsletter-input {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) var(--spacing-3xl);
      background: rgba(250, 247, 242, 0.05);
      border: 1.5px solid rgba(212, 165, 116, 0.3);
      border-radius: var(--radius-md);
      color: var(--color-cream);
      font-size: var(--font-size-sm);
      transition: all var(--transition-base);
    }

    .newsletter-input::placeholder {
      color: var(--color-warm-gray);
    }

    .newsletter-input:focus {
      outline: none;
      border-color: var(--color-tan);
      background: rgba(250, 247, 242, 0.08);
      box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.15);
    }

    .newsletter-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-lg);
      background: linear-gradient(135deg, var(--color-tan) 0%, var(--color-gold) 100%);
      color: var(--color-charcoal);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .newsletter-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--color-tan-light) 0%, var(--color-tan) 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(212, 165, 116, 0.4);
    }

    .newsletter-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .newsletter-btn i.fa-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* ===== Footer Bottom ===== */
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--spacing-2xl);
      border-top: 1px solid rgba(212, 165, 116, 0.2);
      flex-wrap: wrap;
      gap: var(--spacing-lg);
    }

    .copyright {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--color-warm-gray);
      font-size: var(--font-size-sm);
      margin: 0;
    }

    .copyright i {
      font-size: 0.875rem;
    }

    .footer-legal {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }

    .legal-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--color-warm-gray);
      text-decoration: none;
      font-size: var(--font-size-sm);
      transition: color var(--transition-fast);
    }

    .legal-link:hover {
      color: var(--color-tan-light);
    }

    .legal-link i {
      font-size: 0.75rem;
    }

    .separator {
      color: rgba(212, 165, 116, 0.4);
      user-select: none;
    }

    /* ===== Responsive Breakpoints ===== */
    @media (max-width: 1024px) {
      .footer-content {
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-2xl);
      }

      .brand-section {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 768px) {
      .footer {
        padding: 0 0 1.5rem;
      }

      .footer-container {
        padding: 4rem var(--spacing-lg) 0;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: var(--spacing-2xl);
      }

      .brand-section {
        grid-column: 1;
      }

      .footer-bottom {
        flex-direction: column;
        text-align: center;
        gap: var(--spacing-md);
      }

      .footer-legal {
        justify-content: center;
      }

      .social-links {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .footer-wave {
        height: 80px;
      }

      .footer-brand {
        font-size: var(--font-size-xl);
      }

      .social-link {
        width: 40px;
        height: 40px;
        font-size: var(--font-size-base);
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  newsletterEmail = '';
  newsletterSubmitting = signal<boolean>(false);

  onNewsletterSubmit(event: Event): void {
    event.preventDefault();
    
    if (!this.newsletterEmail || this.newsletterSubmitting()) {
      return;
    }

    this.newsletterSubmitting.set(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Newsletter subscription:', this.newsletterEmail);
      this.newsletterEmail = '';
      this.newsletterSubmitting.set(false);
      // In a real app, you would show a success toast here
    }, 1500);
  }
}
