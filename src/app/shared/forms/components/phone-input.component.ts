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
    <div class="phone-input-wrapper gradient-border-field">
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
    /* Border/fill/focus look comes from .gradient-border-field (styles.css) */
    .phone-input-wrapper {
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    .phone-prefix {
      /* same vertical metrics as .form-control so heights line up */
      padding: var(--spacing-sm) 0 var(--spacing-sm) var(--spacing-md);
      line-height: 1.5;
      color: var(--text-primary);
      font-weight: var(--font-semibold, 600);
      font-size: 1rem;
      
      user-select: none;
    }

    /* The wrapper owns border, fill and focus ring; the inner input is a bare
       text box and must not inherit the global field look. */
    .phone-input {
      flex: 1;
      min-width: 0;
      width: auto;
      padding: var(--spacing-sm) var(--spacing-md);
      line-height: 1.5;
      border: none;
      border-radius: 0;
      font-size: 1rem;
      outline: none;
      background: transparent;
      box-shadow: none;
      color: var(--text-primary);
      caret-color: var(--text-primary);
    }

    .phone-input:focus {
      background: transparent;
      box-shadow: none;
    }

    .phone-input::placeholder {
      color: var(--text-tertiary);
      opacity: 0.7;
    }

    .phone-input:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .phone-input-wrapper:has(.phone-input:disabled) {
      opacity: 0.6;
      cursor: not-allowed;
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
