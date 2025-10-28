import { Component, Input, forwardRef, signal, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="phone-input-wrapper">
      <div class="phone-prefix">+234</div>
      <input
        type="tel"
        class="phone-input"
        [placeholder]="placeholder"
        [value]="displayValue()"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [disabled]="disabled"
        maxlength="12"
      />
    </div>
  `,
  styles: [`
    .phone-input-wrapper {
      display: flex;
      align-items: center;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
      background: var(--bg-primary, white);
    }

    .phone-input-wrapper:focus-within {
      border-color: var(--color-burgundy, #7D1935);
      box-shadow: 0 0 0 3px rgba(125, 25, 53, 0.1);
    }

    .phone-prefix {
      padding: 0.75rem 0 0.75rem 0.75rem;
      background: var(--bg-primary, white);
      color: var(--text-primary, #374151);
      font-weight: 600;
      font-size: 1rem;
      border-right: 1px solid #e5e7eb;
      user-select: none;
    }

    .phone-input {
      flex: 1;
      padding: 0.75rem;
      border: none;
      font-size: 1rem;
      outline: none;
      background: var(--bg-primary, white);
    }

    .phone-input::placeholder {
      color: #9ca3af;
    }

    .phone-input:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
      color: #6b7280;
    }

    .phone-input-wrapper:has(.phone-input:disabled) {
      background-color: #f3f4f6;
    }

    @media (max-width: 640px) {
      .phone-prefix {
        padding: 0.625rem 0 0.625rem 0.625rem;
        font-size: 0.9375rem;
      }

      .phone-input {
        padding: 0.625rem;
        font-size: 0.9375rem;
      }
    }
  `]
})
export class PhoneInputComponent implements ControlValueAccessor {
  @Input() placeholder = '800 123 4567';
  
  displayValue = signal('');
  disabled = false;

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    if (value) {
      // Remove +234 prefix if it exists
      const cleaned = this.cleanPhoneNumber(value);
      this.displayValue.set(this.formatForDisplay(cleaned));
    } else {
      this.displayValue.set('');
    }
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

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove all non-numeric characters
    value = value.replace(/\D/g, '');

    // Remove leading zero if present
    if (value.startsWith('0')) {
      value = value.substring(1);
    }

    // Limit to 10 digits
    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    // Update display value with formatting
    this.displayValue.set(this.formatForDisplay(value));

    // Emit the full phone number with +234 prefix
    const fullNumber = value ? `+234${value}` : '';
    this.onChange(fullNumber);
  }

  private cleanPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Remove country code if present
    if (cleaned.startsWith('234')) {
      cleaned = cleaned.substring(3);
    }
    
    // Remove leading zero
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    return cleaned;
  }

  private formatForDisplay(value: string): string {
    if (!value) return '';
    
    // Format as: 800 123 4567
    const parts: string[] = [];
    
    if (value.length > 0) {
      parts.push(value.substring(0, Math.min(3, value.length)));
    }
    if (value.length > 3) {
      parts.push(value.substring(3, Math.min(6, value.length)));
    }
    if (value.length > 6) {
      parts.push(value.substring(6, Math.min(10, value.length)));
    }
    
    return parts.join(' ');
  }
}
