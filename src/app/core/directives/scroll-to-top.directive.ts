import { Directive, HostListener, Inject, PLATFORM_ID, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Scroll-to-Top Directive
 * 
 * A directive that creates a floating button to scroll back to the top of the page.
 * The button appears when user scrolls down and hides when at the top.
 * 
 * Usage:
 * <div appScrollToTop></div>
 * 
 * Features:
 * - Auto-shows/hides based on scroll position
 * - Smooth scroll animation
 * - SSR-safe
 * - Customizable appearance via CSS
 */
@Directive({
  selector: '[appScrollToTop]',
  standalone: true
})
export class ScrollToTopDirective implements OnInit, OnDestroy {
  private button: HTMLElement | null = null;
  private isBrowser: boolean;
  private scrollListener: (() => void) | null = null;
  private readonly SCROLL_THRESHOLD = 300; // Show button after scrolling 300px

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.createButton();
    this.setupScrollListener();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      this.scrollListener();
    }
    if (this.button && this.button.parentNode) {
      this.renderer.removeChild(this.button.parentNode, this.button);
    }
  }

  private createButton(): void {
    if (!this.isBrowser) return;

    // Create button element
    this.button = this.renderer.createElement('button');
    this.renderer.addClass(this.button, 'scroll-to-top-btn');
    this.renderer.setAttribute(this.button, 'type', 'button');
    this.renderer.setAttribute(this.button, 'aria-label', 'Scroll to top');
    this.renderer.setAttribute(this.button, 'title', 'Back to top');

    // Create icon
    const icon = this.renderer.createElement('i');
    this.renderer.addClass(icon, 'fas');
    this.renderer.addClass(icon, 'fa-arrow-up');
    this.renderer.appendChild(this.button, icon);

    // Apply styles
    this.applyStyles();

    // Initially hidden
    this.renderer.setStyle(this.button, 'opacity', '0');
    this.renderer.setStyle(this.button, 'visibility', 'hidden');

    // Add click listener
    this.renderer.listen(this.button, 'click', () => this.scrollToTop());

    // Append to body
    this.renderer.appendChild(document.body, this.button);
  }

  private applyStyles(): void {
    if (!this.button) return;

    const styles = {
      'position': 'fixed',
      'bottom': '2rem',
      'left': '2rem',
      'width': '50px',
      'height': '50px',
      'border-radius': '50%',
      'background': 'linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, #9B2447 100%)',
      'color': 'var(--color-cream, #FAF7F2)',
      'border': 'none',
      'cursor': 'pointer',
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'font-size': '1.25rem',
      'box-shadow': '0 4px 20px rgba(125, 25, 53, 0.3)',
      'transition': 'all 0.3s ease',
      'z-index': '9999',
      'outline': 'none'
    };

    Object.entries(styles).forEach(([property, value]) => {
      this.renderer.setStyle(this.button, property, value);
    });

    // Apply mobile-specific styles
    this.applyMobileStyles();

    // Add hover effect via event listeners
    this.renderer.listen(this.button, 'mouseenter', () => {
      this.renderer.setStyle(this.button, 'transform', 'translateY(-4px) scale(1.05)');
      this.renderer.setStyle(this.button, 'box-shadow', '0 8px 30px rgba(125, 25, 53, 0.4)');
    });

    this.renderer.listen(this.button, 'mouseleave', () => {
      this.renderer.setStyle(this.button, 'transform', 'translateY(0) scale(1)');
      this.renderer.setStyle(this.button, 'box-shadow', '0 4px 20px rgba(125, 25, 53, 0.3)');
    });
  }

  private applyMobileStyles(): void {
    if (!this.button || !this.isBrowser) return;

    // Check if mobile screen
    const checkAndApplyMobileStyles = () => {
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        this.renderer.setStyle(this.button, 'width', '40px');
        this.renderer.setStyle(this.button, 'height', '40px');
        this.renderer.setStyle(this.button, 'font-size', '1rem');
        this.renderer.setStyle(this.button, 'bottom', '1.5rem');
        this.renderer.setStyle(this.button, 'left', '1.5rem');
      } else {
        this.renderer.setStyle(this.button, 'width', '50px');
        this.renderer.setStyle(this.button, 'height', '50px');
        this.renderer.setStyle(this.button, 'font-size', '1.25rem');
        this.renderer.setStyle(this.button, 'bottom', '2rem');
        this.renderer.setStyle(this.button, 'left', '2rem');
      }
    };

    // Apply on load
    checkAndApplyMobileStyles();

    // Reapply on resize
    this.renderer.listen('window', 'resize', () => {
      checkAndApplyMobileStyles();
    });
  }

  private setupScrollListener(): void {
    if (!this.isBrowser) return;

    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      this.handleScroll();
    });

    // Initial check
    this.handleScroll();
  }

  private handleScroll(): void {
    if (!this.button || !this.isBrowser) return;

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const shouldShow = scrollPosition > this.SCROLL_THRESHOLD;

    if (shouldShow) {
      this.renderer.setStyle(this.button, 'opacity', '1');
      this.renderer.setStyle(this.button, 'visibility', 'visible');
    } else {
      this.renderer.setStyle(this.button, 'opacity', '0');
      this.renderer.setStyle(this.button, 'visibility', 'hidden');
    }
  }

  private scrollToTop(): void {
    if (!this.isBrowser) return;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Allow manual scroll to top via click on the host element
  @HostListener('click')
  onClick(): void {
    this.scrollToTop();
  }
}
