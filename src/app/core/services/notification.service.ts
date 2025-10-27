import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Notification streams
  private toastSubject = new Subject<ToastNotification>();
  public toast$ = this.toastSubject.asObservable();

  private errorSubject = new Subject<ErrorNotification>();
  public error$ = this.errorSubject.asObservable();

  // Signals for UI state
  public activeNotifications = signal<ToastNotification[]>([]);
  public hasErrors = signal<boolean>(false);

  /**
   * Show success toast
   */
  success(message: string, duration: number = 3000): void {
    this.showToast({
      type: 'success',
      message,
      duration,
      timestamp: new Date()
    });
  }

  /**
   * Show error toast
   */
  error(message: string, duration: number = 5000): void {
    this.showToast({
      type: 'error',
      message,
      duration,
      timestamp: new Date()
    });
    this.hasErrors.set(true);
  }

  /**
   * Show warning toast
   */
  warning(message: string, duration: number = 4000): void {
    this.showToast({
      type: 'warning',
      message,
      duration,
      timestamp: new Date()
    });
  }

  /**
   * Show info toast
   */
  info(message: string, duration: number = 3000): void {
    this.showToast({
      type: 'info',
      message,
      duration,
      timestamp: new Date()
    });
  }

  /**
   * Show toast notification
   */
  private showToast(notification: ToastNotification): void {
    const id = this.generateId();
    const toastWithId = { ...notification, id };
    
    this.toastSubject.next(toastWithId);
    
    // Add to active notifications
    const current = this.activeNotifications();
    this.activeNotifications.set([...current, toastWithId]);

    // Auto-dismiss after duration
    if (notification.duration > 0) {
      setTimeout(() => {
        this.dismissToast(id);
      }, notification.duration);
    }
  }

  /**
   * Dismiss toast by ID
   */
  dismissToast(id: string): void {
    const current = this.activeNotifications();
    this.activeNotifications.set(current.filter(n => n.id !== id));
  }

  /**
   * Clear all toasts
   */
  clearAll(): void {
    this.activeNotifications.set([]);
    this.hasErrors.set(false);
  }

  /**
   * Handle HTTP errors
   */
  handleError(error: any, customMessage?: string): void {
    const errorNotification: ErrorNotification = {
      message: customMessage || this.extractErrorMessage(error),
      statusCode: error.status,
      originalError: error,
      timestamp: new Date()
    };

    this.errorSubject.next(errorNotification);
    this.error(errorNotification.message);
  }

  /**
   * Extract error message from HTTP error
   */
  private extractErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error.error?.message) {
      return error.error.message;
    }

    if (error.message) {
      return error.message;
    }

    if (error.status === 0) {
      return 'Unable to connect to server. Please check your internet connection.';
    }

    if (error.status === 404) {
      return 'The requested resource was not found.';
    }

    if (error.status === 500) {
      return 'An internal server error occurred. Please try again later.';
    }

    if (error.status === 401 || error.status === 403) {
      return 'You are not authorized to perform this action.';
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Show loading notification
   */
  showLoading(message: string = 'Loading...'): string {
    const id = this.generateId();
    this.showToast({
      type: 'loading',
      message,
      duration: 0, // Don't auto-dismiss loading
      timestamp: new Date(),
      id
    });
    return id;
  }

  /**
   * Hide loading notification
   */
  hideLoading(id: string): void {
    this.dismissToast(id);
  }

  /**
   * Show confirmation dialog (returns observable for user response)
   */
  confirm(message: string, title?: string): Observable<boolean> {
    return new Observable(observer => {
      // This would integrate with a modal component
      // For now, using browser confirm
      const result = confirm(`${title ? title + '\n\n' : ''}${message}`);
      observer.next(result);
      observer.complete();
    });
  }

  /**
   * Generate unique ID for notifications
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export interface ToastNotification {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  message: string;
  duration: number;
  timestamp: Date;
  action?: ToastAction;
}

export interface ToastAction {
  label: string;
  handler: () => void;
}

export interface ErrorNotification {
  message: string;
  statusCode?: number;
  originalError?: any;
  timestamp: Date;
}
