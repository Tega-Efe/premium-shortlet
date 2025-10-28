import { Component, Input, forwardRef, signal, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="custom-select-container">
      <button
        type="button"
        class="select-trigger"
        [class.open]="isOpen()"
        [class.disabled]="disabled"
        [class.has-value]="selectedOption()"
        (click)="toggleDropdown()"
        [disabled]="disabled"
      >
        <div class="selected-content">
          @if (selectedOption()) {
            <div class="option-content">
              @if (selectedOption()?.icon) {
                <i [class]="selectedOption()!.icon"></i>
              }
              <span class="option-label">{{ selectedOption()!.label }}</span>
            </div>
          } @else {
            <span class="placeholder">{{ placeholder }}</span>
          }
        </div>
        <i class="fas fa-chevron-down select-arrow" [class.rotate]="isOpen()"></i>
      </button>

      @if (isOpen()) {
        <div class="select-dropdown">
          <div class="dropdown-list">
            @for (option of options; track option.value) {
              <button
                type="button"
                class="dropdown-option"
                [class.selected]="option.value === value()"
                [class.disabled]="option.disabled"
                (click)="selectOption(option)"
                [disabled]="option.disabled"
              >
                <div class="option-content">
                  @if (option.icon) {
                    <i [class]="option.icon"></i>
                  }
                  <span class="option-label">{{ option.label }}</span>
                </div>
                @if (option.value === value()) {
                  <i class="fas fa-check option-check"></i>
                }
              </button>
            }
          </div>
        </div>
      }
    </div>

    <!-- Backdrop to close dropdown when clicking outside -->
    @if (isOpen()) {
      <div class="select-backdrop" (click)="closeDropdown()"></div>
    }
  `,
  styles: [`
    .custom-select-container {
      position: relative;
      width: 100%;
    }

    .select-trigger {
      width: 100%;
      padding: 0.875rem 1rem;
      background: var(--bg-primary, white);
      border: 2px solid var(--border-color, #d1d5db);
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1rem;
      text-align: left;
      position: relative;
      z-index: 10;
    }

    .select-trigger:hover:not(.disabled) {
      border-color: var(--color-burgundy, #7D1935);
      background: rgba(125, 25, 53, 0.02);
    }

    .select-trigger.open {
      border-color: var(--color-burgundy, #7D1935);
      box-shadow: 0 0 0 3px rgba(125, 25, 53, 0.1);
    }

    .select-trigger.disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .select-trigger.has-value {
      border-color: var(--color-burgundy, #7D1935);
      background: linear-gradient(to right, rgba(125, 25, 53, 0.03) 0%, rgba(212, 165, 116, 0.03) 100%);
    }

    .selected-content {
      flex: 1;
      min-width: 0;
    }

    .option-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .option-content i {
      font-size: 1.25rem;
      color: var(--color-burgundy, #7D1935);
      flex-shrink: 0;
    }

    .option-label {
      font-weight: 500;
      color: var(--text-primary, #374151);
    }

    .placeholder {
      color: var(--text-secondary, #9ca3af);
      font-weight: 400;
    }

    .select-arrow {
      font-size: 0.875rem;
      color: var(--text-secondary, #6b7280);
      transition: transform 0.2s ease;
      flex-shrink: 0;
    }

    .select-arrow.rotate {
      transform: rotate(180deg);
    }

    .select-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      right: 0;
      background: var(--bg-primary, white);
      border: 2px solid var(--color-burgundy, #7D1935);
      border-radius: 0.5rem;
      box-shadow: 0 10px 25px rgba(125, 25, 53, 0.15);
      z-index: 50;
      overflow: hidden;
      max-height: 300px;
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-list {
      max-height: 300px;
      overflow-y: auto;
      padding: 0.5rem;
    }

    .dropdown-list::-webkit-scrollbar {
      width: 8px;
    }

    .dropdown-list::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .dropdown-list::-webkit-scrollbar-thumb {
      background: var(--color-burgundy, #7D1935);
      border-radius: 4px;
    }

    .dropdown-list::-webkit-scrollbar-thumb:hover {
      background: #9B2447;
    }

    .dropdown-option {
      width: 100%;
      padding: 1rem;
      background: transparent;
      border: none;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: left;
      margin-bottom: 0.375rem;
      position: relative;
    }

    .dropdown-option::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 0;
      background: var(--color-burgundy, #7D1935);
      border-radius: 0 2px 2px 0;
      transition: height 0.2s ease;
    }

    .dropdown-option:hover:not(.disabled) {
      background: linear-gradient(135deg, rgba(125, 25, 53, 0.06) 0%, rgba(212, 165, 116, 0.06) 100%);
      transform: translateX(6px);
      box-shadow: 0 2px 8px rgba(125, 25, 53, 0.08);
    }

    .dropdown-option:hover:not(.disabled)::before {
      height: 60%;
    }

    .dropdown-option.selected {
      background: linear-gradient(135deg, rgba(125, 25, 53, 0.1) 0%, rgba(212, 165, 116, 0.1) 100%);
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(125, 25, 53, 0.12);
    }

    .dropdown-option.selected::before {
      height: 80%;
    }

    .dropdown-option.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .option-check {
      font-size: 1rem;
      color: var(--color-burgundy, #7D1935);
      flex-shrink: 0;
    }

    .select-backdrop {
      position: fixed;
      inset: 0;
      z-index: 5;
      background: transparent;
    }

    @media (max-width: 640px) {
      .select-trigger {
        padding: 0.625rem 0.75rem;
        font-size: 0.9375rem;
      }

      .select-trigger i {
        font-size: 1rem;
      }

      .select-arrow {
        font-size: 0.75rem;
      }

      .select-dropdown {
        max-height: 280px;
      }

      .option-content {
        gap: 0.625rem;
        font-size: 0.9375rem;
      }

      .option-content i {
        font-size: 1.0625rem;
      }

      .dropdown-option {
        padding: 0.625rem 0.75rem;
      }

      .option-check {
        font-size: 0.9375rem;
      }
    }
  `]
})
export class CustomSelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Select an option...';
  
  isOpen = signal(false);
  value = signal<string>('');
  selectedOption = signal<SelectOption | null>(null);
  disabled = false;

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  // Close dropdown when clicking outside
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDropdown();
  }

  writeValue(value: string): void {
    this.value.set(value || '');
    this.updateSelectedOption(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen.update(open => !open);
    if (!this.isOpen()) {
      this.onTouched();
    }
  }

  closeDropdown(): void {
    this.isOpen.set(false);
    this.onTouched();
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;
    
    this.value.set(option.value);
    this.selectedOption.set(option);
    this.onChange(option.value);
    this.closeDropdown();
  }

  private updateSelectedOption(value: string): void {
    const option = this.options.find(opt => opt.value === value);
    this.selectedOption.set(option || null);
  }
}
