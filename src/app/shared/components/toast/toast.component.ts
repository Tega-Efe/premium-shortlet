import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ToastNotification } from '../../../core/services';
import { fadeInOut, slideInRight } from '../../../core/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut, slideInRight],
  templateUrl: './toast.component.html',
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 10001;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
      pointer-events: none;
    }

    .toast {
      background: var(--bg-secondary);
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                  0 4px 6px -2px rgba(0, 0, 0, 0.05);
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      min-width: 300px;
      border-left: 4px solid;
      pointer-events: auto;
    }

    .toast-success {
      border-left-color: var(--color-sage, #A8B4A5);
    }

    .toast-error {
      border-left-color: var(--color-terracotta, #C17D5C);
    }

    .toast-warning {
      border-left-color: var(--color-gold, #D4AF37);
    }

    .toast-info {
      border-left-color: var(--color-tan, #D4A574);
    }

    .toast-loading {
      border-left-color: var(--color-burgundy, #7D1935);
    }

    .toast-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .toast-message {
      margin: 0;
      color: var(--text-primary);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .toast-action {
      align-self: flex-start;
      background: none;
      border: none;
      color: var(--color-burgundy, #7D1935);
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
    }

    .toast-action:hover {
      color: var(--color-tan, #D4A574);
    }

    .toast-close {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0;
      font-size: 1.25rem;
      line-height: 1;
      flex-shrink: 0;
      transition: color 0.2s;
    }

    .toast-close:hover {
      color: #1f2937;
    }

    @media (max-width: 768px) {
      .toast-container {
        top: auto;
        bottom: 1rem;
        left: 1rem;
        right: 1rem;
        max-width: none;
      }

      .toast {
        min-width: auto;
        width: 100%;
      }
    }
  `]
})
export class ToastComponent implements OnInit {
  private notificationService = inject(NotificationService);
  
  notifications = signal<ToastNotification[]>([]);

  ngOnInit(): void {
    // Subscribe to toast notifications
    this.notificationService.toast$.subscribe(notification => {
      const current = this.notifications();
      this.notifications.set([...current, notification]);
    });

    // Subscribe to active notifications from service
    this.notificationService.activeNotifications.set = (notifications) => {
      this.notifications.set(notifications);
    };
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'loading':
        return '⏳';
      default:
        return 'ℹ';
    }
  }

  dismiss(id: string): void {
    this.notificationService.dismissToast(id);
  }

  handleAction(notification: ToastNotification): void {
    if (notification.action) {
      notification.action.handler();
      if (notification.id) {
        this.dismiss(notification.id);
      }
    }
  }
}
