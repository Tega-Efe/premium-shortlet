import { Component, ChangeDetectionStrategy, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TypingEffectDirective } from '../../../core/directives';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink, FormsModule, TypingEffectDirective, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styles: [`
    /* ===== Footer Container ===== */
    .footer {
      background: linear-gradient(180deg, var(--color-charcoal) 0%, var(--color-almost-black) 100%);
      color: var(--color-beige);
      padding: 0 0 1.5rem;
      margin-top: auto;
      position: relative;
      overflow: hidden;
    }

    .footer-wave {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100px;
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
      padding: 4rem var(--spacing-xl) 0;
      position: relative;
      z-index: 1;
    }

    /* ===== Footer Content Grid ===== */
    .footer-content {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
      gap: var(--spacing-2xl);
      margin-bottom: var(--spacing-2xl);
    }

    .footer-section {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    /* ===== Brand Section ===== */
    .brand-section {
      gap: var(--spacing-md);
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-family: 'Playfair Display', Georgia, serif;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-dark-vanilla);
      margin: 0;
    }

    .brand-icon {
      font-size: var(--font-size-2xl);
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
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-dark-vanilla);
      margin: 0 0 var(--spacing-xs) 0;
      font-family: 'Playfair Display', Georgia, serif;
    }

    .footer-heading i {
      color: var(--color-tan);
      font-size: 0.875rem;
    }

    /* ===== Footer Links ===== */
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .footer-links a {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--color-warm-gray);
      text-decoration: none;
      font-size: 0.8125rem;
      transition: all var(--transition-fast);
      padding: 0.25rem 0;
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
      gap: var(--spacing-sm);
      margin-top: var(--spacing-xs);
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(212, 165, 116, 0.1);
      border: 2px solid rgba(212, 165, 116, 0.3);
      border-radius: var(--radius-md);
      color: var(--color-tan);
      font-size: var(--font-size-base);
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
      font-size: 0.8125rem;
      line-height: 1.5;
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
      left: var(--spacing-sm);
      color: var(--color-warm-gray);
      font-size: 0.8125rem;
      pointer-events: none;
    }

    .newsletter-input {
      width: 100%;
      padding: 0.625rem var(--spacing-sm) 0.625rem var(--spacing-2xl);
      background: rgba(250, 247, 242, 0.05);
      border: 1.5px solid rgba(212, 165, 116, 0.3);
      border-radius: var(--radius-md);
      color: var(--color-cream);
      font-size: 0.8125rem;
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
      padding: 0.625rem var(--spacing-md);
      background: linear-gradient(135deg, var(--color-tan) 0%, var(--color-gold) 100%);
      color: var(--color-charcoal);
      font-weight: var(--font-weight-semibold);
      font-size: 0.8125rem;
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
      padding-top: var(--spacing-xl);
      border-top: 1px solid rgba(212, 165, 116, 0.2);
      flex-wrap: wrap;
      gap: var(--spacing-md);
    }

    .copyright {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--color-warm-gray);
      font-size: 0.8125rem;
      margin: 0;
    }

    .copyright i {
      font-size: 0.75rem;
    }

    .footer-legal {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      flex-wrap: wrap;
    }

    .legal-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--color-warm-gray);
      text-decoration: none;
      font-size: 0.8125rem;
      transition: color var(--transition-fast);
      cursor: pointer;
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
        gap: var(--spacing-xl);
      }

      .brand-section {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 768px) {
      .footer {
        padding: 0 0 1.25rem;
      }

      .footer-container {
        padding: 3rem var(--spacing-md) 0;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
      }

      .brand-section {
        grid-column: 1;
      }

      .footer-bottom {
        flex-direction: column;
        text-align: center;
        gap: var(--spacing-sm);
        padding-top: var(--spacing-lg);
      }

      .footer-legal {
        justify-content: center;
        gap: var(--spacing-xs);
      }

      .social-links {
        justify-content: center;
      }

      .footer-brand {
        font-size: var(--font-size-lg);
      }

      .brand-icon {
        font-size: var(--font-size-xl);
      }
    }

    @media (max-width: 480px) {
      .footer-wave {
        height: 60px;
      }

      .footer-container {
        padding: 2.5rem var(--spacing-sm) 0;
      }

      .footer {
        padding: 0 0 1rem;
      }

      .footer-content {
        gap: var(--spacing-md);
      }

      .footer-brand {
        font-size: var(--font-size-base);
      }

      .brand-icon {
        font-size: var(--font-size-lg);
      }

      .footer-heading {
        font-size: 0.875rem;
      }

      .footer-links a {
        font-size: 0.75rem;
      }

      .social-link {
        width: 36px;
        height: 36px;
        font-size: 0.875rem;
      }

      .social-links {
        gap: 0.5rem;
      }

      .newsletter-description {
        font-size: 0.75rem;
      }

      .newsletter-input,
      .newsletter-btn {
        font-size: 0.75rem;
      }

      .copyright,
      .legal-link {
        font-size: 0.75rem;
      }

      .footer-bottom {
        gap: 0.625rem;
      }
    }

    /* ===== Legal Modal Styles ===== */
    .legal-modal-content {
      max-height: 70vh;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .legal-modal-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--border-color);
    }

    .legal-effective-date {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
      font-style: italic;
    }

    .legal-section {
      margin-bottom: 2rem;
    }

    .legal-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
    }

    .legal-section h4 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 1.5rem 0 0.75rem 0;
      line-height: 1.4;
    }

    .legal-section p {
      line-height: 1.7;
      color: var(--text-secondary);
      margin-bottom: 1rem;
      text-align: justify;
    }

    .legal-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .legal-list li {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      line-height: 1.7;
      color: var(--text-secondary);
      text-align: justify;
    }

    .legal-list li:last-child {
      margin-bottom: 0;
    }

    .legal-list li i {
      color: var(--color-burgundy);
      margin-top: 0.3rem;
      flex-shrink: 0;
      font-size: 0.875rem;
    }

    .legal-list li strong {
      display: block;
      color: var(--text-primary);
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
      margin-top: 1rem;
    }

    .feature-card {
      padding: 1.25rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      text-align: center;
    }

    .feature-card i {
      font-size: 2rem;
      color: var(--color-burgundy);
      margin-bottom: 0.75rem;
    }

    .feature-card h4 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.5;
    }

    .contact-info {
      background: var(--bg-secondary);
      padding: 1.25rem;
      border-radius: var(--radius-md);
      border-left: 4px solid var(--color-burgundy);
    }

    .contact-info p {
      margin-bottom: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      line-height: 1.6;
      color: var(--text-secondary);
    }

    .contact-info p:last-child {
      margin-bottom: 0;
    }

    .contact-info i {
      color: var(--color-burgundy);
      width: 20px;
      flex-shrink: 0;
    }

    .contact-info strong {
      color: var(--text-primary);
      font-weight: 600;
    }

    .warning-text {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      background: rgba(255, 193, 7, 0.1);
      border-left: 4px solid #ffc107;
      padding: 1.25rem;
      border-radius: var(--radius-md);
      margin-top: 1rem;
      color: var(--text-primary);
      line-height: 1.7;
      text-align: justify;
    }

    .warning-text i {
      color: #ffc107;
      margin-top: 0.3rem;
      flex-shrink: 0;
      font-size: 1.125rem;
    }

    .warning-text strong {
      color: var(--text-primary);
      font-weight: 600;
    }

    /* Scrollbar styling for legal modals */
    .legal-modal-content::-webkit-scrollbar {
      width: 8px;
    }

    .legal-modal-content::-webkit-scrollbar-track {
      background: var(--bg-secondary);
      border-radius: 4px;
    }

    .legal-modal-content::-webkit-scrollbar-thumb {
      background: var(--color-burgundy);
      border-radius: 4px;
    }

    .legal-modal-content::-webkit-scrollbar-thumb:hover {
      background: var(--color-tan);
    }

    /* ===== DARK MODE STYLES ===== */
    :host-context(.dark-theme) {
      .input-icon {
        color: var(--color-tan);
      }

      .newsletter-input {
        background: rgba(250, 247, 242, 0.1);
        border-color: rgba(212, 165, 116, 0.4);
        color: var(--text-primary);
      }

      .newsletter-input::placeholder {
        color: rgba(212, 165, 116, 0.6);
      }

      .newsletter-input:focus {
        border-color: var(--color-tan);
        background: rgba(250, 247, 242, 0.15);
      }
    }

    @media (max-width: 768px) {
      .legal-modal-content {
        padding: 1rem;
      }

      .legal-modal-title {
        font-size: 1.5rem;
      }

      .legal-section h3 {
        font-size: 1.1rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FooterComponent {
  @ViewChild('aboutModal') aboutModal!: ModalComponent;
  @ViewChild('privacyModal') privacyModal!: ModalComponent;
  @ViewChild('termsModal') termsModal!: ModalComponent;
  @ViewChild('cookieModal') cookieModal!: ModalComponent;

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

  // Modal methods
  openAboutModal(): void {
    if (this.aboutModal) {
      this.aboutModal.openModal('About Sweet Homes');
    }
  }

  closeAboutModal(): void {
    // Modal closes automatically
  }

  openPrivacyModal(): void {
    if (this.privacyModal) {
      this.privacyModal.openModal('Privacy Policy');
    }
  }

  closePrivacyModal(): void {
    // Modal closes automatically
  }

  openTermsModal(): void {
    if (this.termsModal) {
      this.termsModal.openModal('Terms of Service');
    }
  }

  closeTermsModal(): void {
    // Modal closes automatically
  }

  openCookieModal(): void {
    if (this.cookieModal) {
      this.cookieModal.openModal('Cookie Policy');
    }
  }

  closeCookieModal(): void {
    // Modal closes automatically
  }
}
