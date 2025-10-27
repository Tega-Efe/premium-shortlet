import { Directive, ElementRef, HostListener, OnInit, input, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Directive to add smooth hover effects to elements
 * Usage: <div appHoverEffect effect="lift" scale="1.05">
 */
@Directive({
  selector: '[appHoverEffect]',
})
export class HoverEffectDirective implements OnInit {
  // Input signals for configuration
  effect = input<'lift' | 'glow' | 'tilt' | 'scale' | 'border-glow'>('lift');
  scale = input<number>(1.05); // Scale factor for scale effect
  duration = input<number>(300); // Transition duration in ms
  shadowColor = input<string>('rgba(125, 25, 53, 0.15)'); // Shadow color for lift/glow effects

  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  constructor(private el: ElementRef<HTMLElement>) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Only run in browser environment (not during SSR)
    if (!this.isBrowser) return;
    
    const element = this.el.nativeElement;
    
    // Set base transition
    element.style.transition = `all ${this.duration()}ms ease-out`;
    
    // Set initial cursor
    element.style.cursor = 'pointer';
    
    // Store original transform if any
    const computedStyle = window.getComputedStyle(element);
    const originalTransform = computedStyle.transform;
    element.setAttribute('data-original-transform', originalTransform === 'none' ? '' : originalTransform);
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.isBrowser) return;
    const element = this.el.nativeElement;
    const effectType = this.effect();
    const originalTransform = element.getAttribute('data-original-transform') || '';

    switch (effectType) {
      case 'lift':
        element.style.transform = `${originalTransform} translateY(-8px)`;
        element.style.boxShadow = `0 12px 24px -6px ${this.shadowColor()}`;
        break;

      case 'glow':
        element.style.boxShadow = `0 0 20px ${this.shadowColor()}, 0 0 40px ${this.shadowColor()}`;
        break;

      case 'scale':
        element.style.transform = `${originalTransform} scale(${this.scale()})`;
        break;

      case 'tilt':
        element.style.transform = `${originalTransform} perspective(1000px) rotateX(5deg) rotateY(-5deg)`;
        break;

      case 'border-glow':
        element.style.borderColor = '#7D1935';
        element.style.boxShadow = `0 0 0 2px rgba(125, 25, 53, 0.2)`;
        break;
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (!this.isBrowser) return;
    
    const element = this.el.nativeElement;
    const originalTransform = element.getAttribute('data-original-transform') || '';

    // Reset to original state
    element.style.transform = originalTransform || 'none';
    element.style.boxShadow = '';
    element.style.borderColor = '';
  }

  @HostListener('mousedown')
  onMouseDown(): void {
    if (!this.isBrowser) return;
    
    const element = this.el.nativeElement;
    const originalTransform = element.getAttribute('data-original-transform') || '';
    
    // Add pressed effect
    element.style.transform = `${originalTransform} scale(0.98)`;
  }

  @HostListener('mouseup')
  onMouseUp(): void {
    if (!this.isBrowser) return;
    
    // Trigger mouseenter again to restore hover state
    this.onMouseEnter();
  }
}
