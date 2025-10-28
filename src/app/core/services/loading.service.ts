import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Global loading state
  isLoading = signal<boolean>(false);
  loadingMessage = signal<string>('Loading...');
  loadingProgress = signal<number | null>(null);
  showProgress = signal<boolean>(false);

  /**
   * Show global loading overlay
   */
  show(message: string = 'Loading...', showProgress: boolean = false): void {
    this.loadingMessage.set(message);
    this.showProgress.set(showProgress);
    this.isLoading.set(true);
  }

  /**
   * Hide global loading overlay
   */
  hide(): void {
    this.isLoading.set(false);
    setTimeout(() => {
      this.loadingMessage.set('Loading...');
      this.loadingProgress.set(null);
      this.showProgress.set(false);
    }, 300); // Wait for fade animation
  }

  /**
   * Update loading message
   */
  setMessage(message: string): void {
    this.loadingMessage.set(message);
  }

  /**
   * Update progress (0-100)
   */
  setProgress(value: number): void {
    this.loadingProgress.set(Math.min(100, Math.max(0, value)));
  }

  /**
   * Execute async operation with loading overlay
   */
  async withLoading<T>(
    operation: () => Promise<T>,
    message: string = 'Processing...'
  ): Promise<T> {
    this.show(message);
    try {
      const result = await operation();
      return result;
    } finally {
      this.hide();
    }
  }
}
