import { Component, signal, ChangeDetectionStrategy, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { slideInUp } from '../../../core/animations';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInUp],
  templateUrl: './navbar.component.html',
  styles: [`
    /* ===== Navbar Container ===== */
    .navbar {
      background: var(--bg-primary);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
      transition: all var(--transition-base);
      border-bottom: 1px solid var(--border-light);
    }

    .navbar.scrolled {
      background: var(--bg-primary);
      backdrop-filter: blur(12px);
      box-shadow: var(--shadow-lg);
      border-bottom-color: var(--border-medium);
    }

    .navbar-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 1rem var(--spacing-xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    /* ===== Mobile Menu Toggle ===== */
    .mobile-menu-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background: var(--bg-secondary);
      border: 2px solid var(--border-medium);
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--color-burgundy);
      font-size: var(--font-size-xl);
      transition: all var(--transition-base);
      z-index: 2;
    }

    .mobile-menu-toggle:hover {
      background: var(--bg-primary);
      border-color: var(--color-burgundy);
      transform: scale(1.05);
    }

    .mobile-menu-toggle:active {
      transform: scale(0.95);
    }

    /* ===== Mobile Navigation ===== */
    .mobile-menu {
      display: flex;
      flex-direction: column;
      padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-2xl);
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-light);
      gap: var(--spacing-xs);
      box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.05);
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

    .mobile-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, var(--border-light) 50%, transparent 100%);
      margin: var(--spacing-sm) 0;
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

      .mobile-menu-toggle {
        display: none;
      }

      .nav-link.active::after {
        bottom: var(--spacing-xs);
      }
    }

    @media (max-width: 767px) {
      .navbar-container {
        padding: var(--spacing-md) var(--spacing-lg);
      }

      .logo {
        font-size: var(--font-size-lg);
      }

      .logo-icon {
        font-size: var(--font-size-xl);
      }

      .logo-text {
        display: none;
      }
    }

    @media (min-width: 480px) and (max-width: 767px) {
      .logo-text {
        display: inline;
      }
    }

    @media (min-width: 1024px) {
      .navbar-container {
        padding: 1.25rem var(--spacing-2xl);
      }

      .navbar-menu {
        gap: var(--spacing-lg);
      }
    }
  `]
})
export class NavbarComponent {
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
}
