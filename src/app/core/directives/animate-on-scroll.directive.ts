import { Directive, ElementRef, OnInit, OnDestroy, input, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Directive to animate elements when they scroll into viewport
 * Usage: <div appAnimateOnScroll animation="fade-in" delay="0">
 */
@Directive({
  selector: '[appAnimateOnScroll]',
})
export class AnimateOnScrollDirective implements OnInit, OnDestroy {
  // Input signals for configuration
  animation = input<'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale-in' | 'zoom-in'>('fade-in');
  delay = input<number>(0); // Delay in milliseconds
  threshold = input<number>(0.1); // Intersection threshold (0-1)
  once = input<boolean>(true); // Animate only once or every time element enters viewport

  private observer!: IntersectionObserver;
  private hasAnimated = false;
  private platformId = inject(PLATFORM_ID);

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // Only run animations in the browser
    if (!isPlatformBrowser(this.platformId)) {
      // In SSR, show the element immediately without animation
      this.el.nativeElement.style.opacity = '1';
      return;
    }

    // Set initial state - element is invisible
    this.el.nativeElement.style.opacity = '0';
    this.el.nativeElement.style.transform = this.getInitialTransform();
    this.el.nativeElement.style.transition = `opacity 0.6s ease-out, transform 0.6s ease-out`;

    // Create Intersection Observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateElement();
            
            // Disconnect observer if animation should only happen once
            if (this.once() && this.hasAnimated) {
              this.observer.unobserve(this.el.nativeElement);
            }
          } else if (!this.once()) {
            // Reset animation if it should repeat
            this.resetElement();
          }
        });
      },
      {
        threshold: this.threshold(),
        rootMargin: '0px',
      }
    );

    // Start observing the element
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private getInitialTransform(): string {
    const animationType = this.animation();
    
    switch (animationType) {
      case 'slide-up':
        return 'translateY(30px)';
      case 'slide-left':
        return 'translateX(30px)';
      case 'slide-right':
        return 'translateX(-30px)';
      case 'scale-in':
        return 'scale(0.95)';
      case 'zoom-in':
        return 'scale(0.8)';
      case 'fade-in':
      default:
        return 'none';
    }
  }

  private animateElement(): void {
    setTimeout(() => {
      this.el.nativeElement.style.opacity = '1';
      this.el.nativeElement.style.transform = 'translateY(0) translateX(0) scale(1)';
      this.hasAnimated = true;
    }, this.delay());
  }

  private resetElement(): void {
    this.el.nativeElement.style.opacity = '0';
    this.el.nativeElement.style.transform = this.getInitialTransform();
    this.hasAnimated = false;
  }
}
