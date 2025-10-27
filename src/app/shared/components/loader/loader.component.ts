import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fadeInOut, pulse } from '../../../core/animations';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut, pulse],
  templateUrl: './loader.component.html',
  styles: [`
    /* ===== Loader Overlay ===== */
    .loader-overlay {
      position: fixed;
      inset: 0;
      background: linear-gradient(135deg, rgba(31, 28, 24, 0.7) 0%, rgba(62, 56, 50, 0.8) 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: var(--z-modal);
      backdrop-filter: blur(8px);
      padding: var(--spacing-lg);
    }

    .loader-overlay.transparent {
      background: rgba(31, 28, 24, 0.4);
      backdrop-filter: blur(4px);
    }

    .loader-overlay.fullscreen {
      position: fixed;
    }

    /* ===== Loader Container ===== */
    .loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-lg);
      background: linear-gradient(135deg, var(--color-cream) 0%, var(--color-vanilla-light) 100%);
      padding: var(--spacing-3xl);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl), 0 0 0 1px rgba(212, 165, 116, 0.2);
      min-width: 280px;
      max-width: 400px;
      position: relative;
      overflow: hidden;
    }

    .loader-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, 
        var(--color-burgundy) 0%, 
        var(--color-tan) 50%, 
        var(--color-burgundy) 100%);
      background-size: 200% 100%;
      animation: shimmer 2s linear infinite;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .loader-container.compact {
      padding: var(--spacing-xl);
      min-width: 200px;
    }

    /* ===== Spinner Wrapper ===== */
    .spinner-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .spinner {
      width: 100px;
      height: 100px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .compact .spinner {
      width: 60px;
      height: 60px;
    }

    /* ===== Spinner Rings ===== */
    .spinner-ring {
      position: absolute;
      border-radius: 50%;
      border: 3px solid transparent;
      animation: spin 2s linear infinite;
    }

    .ring-1 {
      width: 100%;
      height: 100%;
      border-top-color: var(--color-burgundy);
      border-right-color: var(--color-burgundy);
      animation-duration: 1.5s;
    }

    .ring-2 {
      width: 75%;
      height: 75%;
      border-bottom-color: var(--color-tan);
      border-left-color: var(--color-tan);
      animation-duration: 2s;
      animation-direction: reverse;
    }

    .ring-3 {
      width: 50%;
      height: 50%;
      border-top-color: var(--color-terracotta);
      border-right-color: var(--color-terracotta);
      animation-duration: 1.2s;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* ===== Spinner Core Icon ===== */
    .spinner-core {
      position: absolute;
      width: 35px;
      height: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, var(--color-burgundy) 0%, var(--color-burgundy-light) 100%);
      border-radius: 50%;
      color: var(--color-cream);
      font-size: var(--font-size-lg);
      box-shadow: 0 4px 12px rgba(125, 25, 53, 0.3);
      animation: pulse-icon 2s ease-in-out infinite;
    }

    .compact .spinner-core {
      width: 25px;
      height: 25px;
      font-size: var(--font-size-base);
    }

    @keyframes pulse-icon {
      0%, 100% { 
        transform: scale(1);
        box-shadow: 0 4px 12px rgba(125, 25, 53, 0.3);
      }
      50% { 
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(125, 25, 53, 0.5);
      }
    }

    /* ===== Loading Message ===== */
    .loader-message {
      margin: 0;
      color: var(--text-primary);
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-base);
      text-align: center;
      line-height: 1.5;
      max-width: 300px;
    }

    .compact .loader-message {
      font-size: var(--font-size-sm);
    }

    /* ===== Progress Bar ===== */
    .progress-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
      align-items: center;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(212, 165, 116, 0.2);
      border-radius: var(--radius-full);
      overflow: hidden;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-burgundy) 0%, var(--color-tan) 100%);
      border-radius: var(--radius-full);
      transition: width var(--transition-base);
      position: relative;
      overflow: hidden;
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.3) 50%, 
        transparent 100%);
      animation: progress-shimmer 1.5s linear infinite;
    }

    @keyframes progress-shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .progress-text {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-burgundy);
    }

    /* ===== Responsive Design ===== */
    @media (max-width: 768px) {
      .loader-container {
        padding: var(--spacing-2xl);
        min-width: 240px;
      }

      .loader-container.compact {
        padding: var(--spacing-lg);
        min-width: 180px;
      }

      .spinner {
        width: 80px;
        height: 80px;
      }

      .compact .spinner {
        width: 50px;
        height: 50px;
      }

      .spinner-core {
        width: 30px;
        height: 30px;
        font-size: var(--font-size-base);
      }

      .compact .spinner-core {
        width: 20px;
        height: 20px;
        font-size: var(--font-size-sm);
      }

      .loader-message {
        font-size: var(--font-size-sm);
      }

      .compact .loader-message {
        font-size: var(--font-size-xs);
      }
    }

    @media (max-width: 480px) {
      .loader-overlay {
        padding: var(--spacing-md);
      }

      .loader-container {
        padding: var(--spacing-xl);
        min-width: 200px;
      }
    }
  `]
})
export class LoaderComponent {
  // Input signals
  fullscreen = input<boolean>(true);
  size = input<'normal' | 'small'>('normal');
  transparent = input<boolean>(false);
  showProgress = input<boolean>(false);

  // State signals
  isVisible = signal<boolean>(false);
  message = signal<string>('');
  progress = signal<number | null>(null);

  /**
   * Show loader programmatically
   */
  show(message?: string): void {
    if (message) {
      this.message.set(message);
    }
    this.isVisible.set(true);
  }

  /**
   * Hide loader programmatically
   */
  hide(): void {
    this.isVisible.set(false);
    setTimeout(() => {
      this.message.set('');
      this.progress.set(null);
    }, 300); // Wait for fade out animation
  }

  /**
   * Update loading message
   */
  setMessage(message: string): void {
    this.message.set(message);
  }

  /**
   * Update progress (0-100)
   */
  setProgress(value: number): void {
    this.progress.set(Math.min(100, Math.max(0, value)));
  }

  /**
   * Check if loader is visible
   */
  get visible(): boolean {
    return this.isVisible();
  }
}
