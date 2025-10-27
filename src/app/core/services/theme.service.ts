import { Injectable, signal, effect, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'shortlet-connect-theme';
  private isBrowser: boolean;

  // Signals for reactive theme management
  readonly selectedTheme = signal<Theme>('auto');
  readonly effectiveTheme = signal<'light' | 'dark'>('light');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Initialize theme from localStorage or browser preference
    if (this.isBrowser) {
      this.initializeTheme();
      this.setupMediaQueryListener();
    }

    // Effect to apply theme changes
    effect(() => {
      if (this.isBrowser) {
        this.applyTheme(this.effectiveTheme());
      }
    });
  }

  private initializeTheme(): void {
    // Try to get saved theme from localStorage
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      this.selectedTheme.set(savedTheme);
    }

    // Calculate effective theme
    this.updateEffectiveTheme();
  }

  private setupMediaQueryListener(): void {
    // Listen for browser theme preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      if (this.selectedTheme() === 'auto') {
        this.effectiveTheme.set(e.matches ? 'dark' : 'light');
      }
    });
  }

  private updateEffectiveTheme(): void {
    const selected = this.selectedTheme();
    
    if (selected === 'auto') {
      // Use browser preference
      const prefersDark = this.isBrowser && 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.effectiveTheme.set(prefersDark ? 'dark' : 'light');
    } else {
      this.effectiveTheme.set(selected);
    }
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (!this.isBrowser) return;

    const html = document.documentElement;
    
    // Remove both theme classes first
    html.classList.remove('light-theme', 'dark-theme');
    
    // Add the appropriate theme class
    html.classList.add(`${theme}-theme`);
    
    // Set data attribute for CSS targeting
    html.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);
  }

  private updateMetaThemeColor(theme: 'light' | 'dark'): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const color = theme === 'dark' ? '#1F1C18' : '#FAF7F2';
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color);
    }
  }

  /**
   * Set the theme preference
   */
  setTheme(theme: Theme): void {
    this.selectedTheme.set(theme);
    
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
    
    this.updateEffectiveTheme();
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    const current = this.effectiveTheme();
    const newTheme: Theme = current === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Get the current effective theme
   */
  getCurrentTheme(): 'light' | 'dark' {
    return this.effectiveTheme();
  }

  /**
   * Check if dark mode is active
   */
  isDarkMode(): boolean {
    return this.effectiveTheme() === 'dark';
  }
}
