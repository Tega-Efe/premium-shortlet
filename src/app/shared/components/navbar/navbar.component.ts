import { Component, signal, ChangeDetectionStrategy, HostListener, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { slideInUp } from '../../../core/animations';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInUp],
  templateUrl: './navbar.component.html',
  styles: [`
    /* ===== Navbar Container ===== */
    .navbar {
      background: rgba(var(--bg-primary-rgb, 250, 247, 242), 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 16px rgba(31, 38, 135, 0.15);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: var(--z-sticky);
      transition: all var(--transition-base);
      border-bottom: 1px solid var(--border-light);
    }

    .navbar.scrolled {
      background: rgba(var(--bg-primary-rgb, 250, 247, 242), 0.98);
      backdrop-filter: blur(12px);
      box-shadow: var(--shadow-lg);
      border-bottom-color: var(--border-medium);
    }

    .navbar-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0.75rem var(--spacing-lg);
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 56px;
    }

    /* ===== Logo & Branding ===== */
    .navbar-brand {
      display: flex;
      align-items: center;
      z-index: 2;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      text-decoration: none;
      font-family: 'Playfair Display', Georgia, serif;
      color: var(--color-burgundy);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-xl);
      transition: all var(--transition-base);
      position: relative;
    }

    .logo:hover {
      transform: translateY(-2px);
    }

    .logo-icon {
      font-size: var(--font-size-2xl);
      color: var(--color-tan);
      transition: all var(--transition-base);
    }

    .logo:hover .logo-icon {
      color: var(--color-burgundy);
      transform: scale(1.1);
    }

    .logo-text {
      background: linear-gradient(135deg, var(--color-burgundy) 0%, var(--color-burgundy-light) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ===== Desktop Navigation ===== */
    .navbar-menu {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
    }

    .desktop-menu {
      display: none;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      text-decoration: none;
      color: var(--text-primary);
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      position: relative;
      overflow: hidden;
    }

    .nav-link i {
      font-size: var(--font-size-base);
      transition: transform var(--transition-fast);
    }

    .nav-link:hover {
      color: var(--color-burgundy);
      background-color: var(--bg-secondary);
      transform: translateY(-1px);
    }

    .nav-link:hover i {
      transform: scale(1.1);
    }

    .nav-link.active {
      color: var(--color-burgundy);
      font-weight: var(--font-weight-semibold);
      background: var(--bg-secondary);
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: var(--spacing-md);
      right: var(--spacing-md);
      height: 2px;
      background: linear-gradient(90deg, var(--color-burgundy) 0%, var(--color-burgundy-light) 100%);
      border-radius: var(--radius-full);
    }

    .nav-link.clickable {
      cursor: pointer;
    }

    /* ===== CTA Button ===== */
    .btn-cta {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-lg);
      background: linear-gradient(135deg, var(--color-burgundy) 0%, var(--color-burgundy-light) 100%);
      color: var(--text-inverse);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border-radius: var(--radius-full);
      text-decoration: none;
      transition: all var(--transition-base);
      box-shadow: 0 4px 12px rgba(125, 25, 53, 0.2);
      border: 2px solid transparent;
    }

    .btn-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(125, 25, 53, 0.3);
      background: linear-gradient(135deg, var(--color-burgundy-dark) 0%, var(--color-burgundy) 100%);
    }

    .btn-cta:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(125, 25, 53, 0.2);
    }

    .btn-cta.mobile {
      width: 100%;
      justify-content: center;
      padding: var(--spacing-md);
      font-size: var(--font-size-base);
    }

    /* ===== Mobile Menu Toggle & Hamburger ===== */
    .mobile-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      z-index: 2;
    }

    .mobile-theme-toggle {
      display: block;
    }

    .hamburger {
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      outline: none !important;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hamburger:focus {
      outline: none !important;
    }

    .hamburger input {
      display: none;
    }

    .hamburger svg {
      height: 2em;
      transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hamburger input:checked + svg {
      transform: rotate(-45deg);
    }

    .line {
      fill: none;
      stroke: var(--color-burgundy);
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 2.5;
      transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
                  stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .line-top-bottom {
      stroke-dasharray: 12 63;
    }

    .hamburger input:checked + svg .line-top-bottom {
      stroke-dasharray: 20 300;
      stroke-dashoffset: -32.42;
    }

    .mobile-menu-toggle {
      display: flex;
    }

    /* ===== Mobile Navigation ===== */
    .mobile-menu {
      display: flex;
      flex-direction: column;
      padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-2xl);
      background: rgba(var(--bg-secondary-rgb, 255, 248, 240), 0.98);
      backdrop-filter: blur(10px);
      border-top: 1px solid var(--border-light);
      border-radius: 0 0 15px 15px;
      gap: var(--spacing-xs);
      box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.05);
      margin-top: 0.5rem;
    }

    .mobile-menu .nav-link {
      padding: var(--spacing-md);
      font-size: var(--font-size-base);
      border-radius: var(--radius-lg);
      justify-content: flex-start;
    }

    .mobile-menu .nav-link.active::after {
      display: none;
    }

    .mobile-menu .nav-link.active {
      background: var(--bg-primary);
      border-left: 4px solid var(--color-burgundy);
    }

    /* ===== Mobile Backdrop ===== */
    .mobile-backdrop {
      position: fixed;
      inset: 0;
      background: var(--bg-overlay);
      backdrop-filter: blur(2px);
      z-index: calc(var(--z-sticky) - 1);
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /* ===== Responsive Breakpoints ===== */
    @media (min-width: 768px) {
      .desktop-menu {
        display: flex;
      }

      .mobile-controls {
        display: none;
      }

      .nav-link.active::after {
        bottom: var(--spacing-xs);
      }

      .navbar-container {
        padding: 0.75rem var(--spacing-xl);
        min-height: 60px;
      }
    }

    @media (max-width: 767px) {
      .navbar-container {
        padding: 0.6rem var(--spacing-md);
        min-height: 52px;
      }

      .logo {
        font-size: var(--font-size-base);
      }

      .logo-icon {
        font-size: var(--font-size-lg);
      }

      .logo-text {
        display: none;
      }

      .desktop-menu {
        display: none;
      }

      .mobile-controls {
        display: flex;
      }

      .hamburger svg {
        height: 1.8em;
      }
    }

    @media (min-width: 480px) and (max-width: 767px) {
      .logo-text {
        display: inline;
      }
      
      .logo {
        font-size: var(--font-size-lg);
      }
    }

    @media (min-width: 1024px) {
      .navbar-container {
        padding: 0.75rem var(--spacing-2xl);
        min-height: 64px;
      }

      .navbar-menu {
        gap: var(--spacing-lg);
      }
    }

    /* ===== About Modal Styles ===== */
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

    .legal-section {
      margin-bottom: 2rem;
    }

    .legal-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
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
export class NavbarComponent {
  @ViewChild('aboutModal') aboutModal!: ModalComponent;
  
  mobileMenuOpen = signal<boolean>(false);
  isScrolled = signal<boolean>(false);

  constructor() {
    // Close mobile menu when scrolled is updated (for responsive behavior)
    effect(() => {
      if (this.isScrolled()) {
        // Optional: Could add additional scroll-based behaviors
      }
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled.set(scrollPosition > 50);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(value => !value);
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = this.mobileMenuOpen() ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  openAboutModal(): void {
    if (this.aboutModal) {
      this.aboutModal.openModal('About Sweet Homes');
    }
  }

  closeAboutModal(): void {
    // Modal closes automatically
  }
}
