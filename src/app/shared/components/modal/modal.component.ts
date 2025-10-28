import { Component, input, output, signal, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fadeInOut, scaleIn } from '../../../core/animations';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut, scaleIn],
  templateUrl: './modal.component.html',
  styles: [`
    /* ===== Modal Overlay ===== */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: linear-gradient(135deg, rgba(31, 28, 24, 0.6) 0%, rgba(62, 56, 50, 0.7) 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: var(--z-modal);
      backdrop-filter: blur(4px);
      padding: var(--spacing-lg);
    }

    .modal-overlay.blur-backdrop {
      backdrop-filter: blur(12px);
    }

    /* ===== Modal Container ===== */
    .modal-container {
      background: var(--bg-secondary);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl), 0 0 0 1px var(--border-color);
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    .modal-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--color-burgundy) 0%, var(--color-tan) 50%, var(--color-burgundy) 100%);
    }

    .modal-sm {
      max-width: 400px;
    }

    .modal-lg {
      max-width: 800px;
    }

    .modal-xl {
      max-width: 1200px;
    }

    /* ===== Modal Types with Color Accents ===== */
    .modal-type-success::before {
      background: linear-gradient(90deg, var(--success) 0%, var(--color-sage) 100%);
    }

    .modal-type-warning::before {
      background: linear-gradient(90deg, var(--warning) 0%, var(--color-gold) 100%);
    }

    .modal-type-error::before {
      background: linear-gradient(90deg, var(--error) 0%, var(--color-burgundy) 100%);
    }

    .modal-type-info::before {
      background: linear-gradient(90deg, var(--info) 0%, var(--color-tan) 100%);
    }

    /* ===== Modal Header ===== */
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-xl) var(--spacing-2xl);
      border-bottom: 1px solid var(--border-light);
      gap: var(--spacing-md);
    }

    .modal-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-2xl);
      flex-shrink: 0;
    }

    .modal-type-success .modal-icon {
      background: var(--success-light);
      color: var(--success);
    }

    .modal-type-warning .modal-icon {
      background: var(--warning-light);
      color: var(--warning);
    }

    .modal-type-error .modal-icon {
      background: var(--error-light);
      color: var(--error);
    }

    .modal-type-info .modal-icon {
      background: var(--info-light);
      color: var(--info);
    }

    .modal-title {
      margin: 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      flex: 1;
    }

    .modal-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: var(--bg-primary);
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-lg);
      cursor: pointer;
      color: var(--text-secondary);
      padding: 0;
      transition: all var(--transition-fast);
      flex-shrink: 0;
    }

    .modal-close:hover {
      background: linear-gradient(135deg, var(--color-burgundy) 0%, var(--color-burgundy-light) 100%);
      color: var(--color-cream);
      transform: rotate(90deg);
    }

    /* ===== Modal Body ===== */
    .modal-body {
      padding: var(--spacing-2xl);
      overflow-y: auto;
      flex: 1;
      color: var(--text-secondary);
      line-height: 1.75;
    }

    .modal-body.no-header {
      padding-top: var(--spacing-3xl);
    }

    /* Custom scrollbar for modal body */
    .modal-body::-webkit-scrollbar {
      width: 8px;
    }

    .modal-body::-webkit-scrollbar-track {
      background: var(--color-beige);
    }

    .modal-body::-webkit-scrollbar-thumb {
      background: var(--color-tan);
      border-radius: var(--radius-full);
    }

    .modal-body::-webkit-scrollbar-thumb:hover {
      background: var(--color-burgundy);
    }

    /* ===== Modal Footer ===== */
    .modal-footer {
      padding: var(--spacing-xl) var(--spacing-2xl);
      border-top: 1px solid var(--border-light);
      background: var(--bg-primary);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }

    /* ===== Buttons ===== */
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-xl);
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all var(--transition-base);
      min-width: 120px;
    }

    .btn i {
      font-size: var(--font-size-sm);
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--color-burgundy) 0%, var(--color-burgundy-light) 100%);
      color: var(--text-inverse);
      box-shadow: 0 4px 12px rgba(125, 25, 53, 0.2);
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--color-burgundy-dark) 0%, var(--color-burgundy) 100%);
      box-shadow: 0 6px 16px rgba(125, 25, 53, 0.3);
      transform: translateY(-2px);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(125, 25, 53, 0.2);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: linear-gradient(135deg, var(--color-warm-gray) 0%, var(--color-charcoal) 100%);
      color: var(--text-inverse);
      box-shadow: 0 4px 12px rgba(62, 56, 50, 0.2);
    }

    .btn-secondary:hover {
      background: linear-gradient(135deg, var(--color-charcoal) 0%, var(--color-almost-black) 100%);
      box-shadow: 0 6px 16px rgba(62, 56, 50, 0.3);
      transform: translateY(-2px);
    }

    .btn-secondary:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(62, 56, 50, 0.2);
    }

    /* ===== Responsive Design ===== */
    @media (max-width: 768px) {
      .modal-overlay {
        padding: var(--spacing-md);
      }

      .modal-container {
        max-width: 100%;
        border-radius: var(--radius-xl);
      }

      .modal-header {
        padding: var(--spacing-lg) var(--spacing-xl);
      }

      .modal-body {
        padding: var(--spacing-xl);
      }

      .modal-footer {
        padding: var(--spacing-lg) var(--spacing-xl);
      }

      .modal-title {
        font-size: var(--font-size-xl);
      }

      .modal-icon {
        width: 40px;
        height: 40px;
        font-size: var(--font-size-xl);
      }

      .modal-actions {
        flex-direction: column-reverse;
      }

      .btn {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .modal-overlay {
        padding: 0.5rem;
      }

      .modal-header {
        padding: 0.75rem 1rem;
      }

      .modal-body {
        padding: 0.75rem;
      }

      .modal-footer {
        padding: 0.75rem 1rem;
      }

      .modal-title {
        font-size: 1.125rem;
      }

      .modal-icon {
        width: 36px;
        height: 36px;
      }
    }
  `]
})
export class ModalComponent {
  // Input signals
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  type = input<'default' | 'success' | 'warning' | 'error' | 'info'>('default');
  showCloseButton = input<boolean>(true);
  showFooter = input<boolean>(false);
  showDefaultButtons = input<boolean>(false);
  showCancelButton = input<boolean>(true);
  showConfirmButton = input<boolean>(true);
  cancelText = input<string>('Cancel');
  confirmText = input<string>('Confirm');
  closeOnOverlayClick = input<boolean>(true);
  closeOnEscape = input<boolean>(true);
  blurBackdrop = input<boolean>(true);
  confirmDisabled = input<boolean>(false);

  // Output signals
  modalClose = output<void>();
  modalCancel = output<void>();
  modalConfirm = output<void>();

  // State signals
  isOpen = signal<boolean>(false);
  title = signal<string>('');

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.closeOnEscape() && this.isOpen()) {
      this.close();
    }
  }

  openModal(title?: string): void {
    if (title) {
      this.title.set(title);
    }
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.modalClose.emit();
  }

  cancel(): void {
    this.modalCancel.emit();
    this.close();
  }

  confirm(): void {
    this.modalConfirm.emit();
  }

  onOverlayClick(): void {
    if (this.closeOnOverlayClick()) {
      this.close();
    }
  }

  setTitle(title: string): void {
    this.title.set(title);
  }

  get visible(): boolean {
    return this.isOpen();
  }
}
