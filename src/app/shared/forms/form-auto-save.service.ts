import { Injectable } from '@angular/core';

/**
 * Form Auto-Save Service
 * Saves form data to localStorage to prevent data loss on page refresh
 */
@Injectable({
  providedIn: 'root'
})
export class FormAutoSaveService {
  private readonly STORAGE_PREFIX = 'form_autosave_';
  private readonly EXPIRY_HOURS = 24; // Auto-saved data expires after 24 hours

  /**
   * Save form data to localStorage
   */
  saveFormData(formId: string, data: Record<string, any>): void {
    try {
      const storageData = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + (this.EXPIRY_HOURS * 60 * 60 * 1000)
      };

      localStorage.setItem(
        `${this.STORAGE_PREFIX}${formId}`,
        JSON.stringify(storageData)
      );
    } catch (error) {
      console.warn('Failed to auto-save form data:', error);
    }
  }

  /**
   * Load form data from localStorage
   */
  loadFormData(formId: string): Record<string, any> | null {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_PREFIX}${formId}`);
      
      if (!stored) {
        return null;
      }

      const storageData = JSON.parse(stored);

      // Check if data has expired
      if (Date.now() > storageData.expiresAt) {
        this.clearFormData(formId);
        return null;
      }

      return storageData.data;
    } catch (error) {
      console.warn('Failed to load auto-saved form data:', error);
      return null;
    }
  }

  /**
   * Clear saved form data
   */
  clearFormData(formId: string): void {
    try {
      localStorage.removeItem(`${this.STORAGE_PREFIX}${formId}`);
    } catch (error) {
      console.warn('Failed to clear auto-saved form data:', error);
    }
  }

  /**
   * Check if form has saved data
   */
  hasSavedData(formId: string): boolean {
    const data = this.loadFormData(formId);
    return data !== null && Object.keys(data).length > 0;
  }

  /**
   * Get the timestamp of when data was saved
   */
  getSaveTimestamp(formId: string): number | null {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_PREFIX}${formId}`);
      
      if (!stored) {
        return null;
      }

      const storageData = JSON.parse(stored);
      return storageData.timestamp;
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear all expired form data
   */
  clearExpiredData(): void {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();

      keys.forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const storageData = JSON.parse(stored);
              if (now > storageData.expiresAt) {
                localStorage.removeItem(key);
              }
            } catch {
              // Invalid data, remove it
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.warn('Failed to clear expired form data:', error);
    }
  }
}
