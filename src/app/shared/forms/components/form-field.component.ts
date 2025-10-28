import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldConfig } from '../form-field.config';
import { PhoneInputComponent } from './phone-input.component';
import { FileUploadComponent } from './file-upload.component';
import { CustomSelectComponent } from './custom-select.component';
import { DatePickerComponent } from './date-picker.component';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PhoneInputComponent, FileUploadComponent, CustomSelectComponent, DatePickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="'form-field ' + (config.containerClass || '')" 
         [class.has-error]="control.invalid && control.touched">
      
      <label [for]="config.name" class="form-label">
        {{ config.label }}
        @if (isRequired) {
          <span class="required">*</span>
        }
      </label>

      @switch (config.type) {
        @case ('tel') {
          <app-phone-input
            [formControl]="control"
            [placeholder]="config.placeholder || '800 123 4567'"
          />
        }
        @case ('file') {
          <app-file-upload
            [formControl]="control"
            [accept]="config.accept || 'image/jpeg,image/png,image/jpg'"
            [placeholder]="config.placeholder || 'Click to upload'"
            [hint]="config.hint || 'JPG, PNG up to 5MB'"
          />
        }
        @case ('date') {
          <app-date-picker
            [formControl]="control"
            [placeholder]="config.placeholder || 'Select date'"
            [minDate]="config.min?.toString()"
            [maxDate]="config.max?.toString()"
          />
        }
        @case ('select') {
          <app-custom-select
            [formControl]="control"
            [options]="config.options || []"
            [placeholder]="config.placeholder || 'Select...'"
          />
        }
        @case ('textarea') {
          <textarea
            [id]="config.name"
            [formControl]="control"
            [placeholder]="config.placeholder || ''"
            [rows]="config.rows || 3"
            [readonly]="config.readonly || false"
            [class]="'form-control ' + (config.cssClass || '')"
          ></textarea>
        }
        @case ('select') {
          <select
            [id]="config.name"
            [formControl]="control"
            [multiple]="config.multiple || false"
            [class]="'form-control ' + (config.cssClass || '')"
          >
            <option value="">{{ config.placeholder || 'Select...' }}</option>
            @for (option of config.options; track option.value) {
              <option 
                [value]="option.value"
                [disabled]="option.disabled || false"
              >
                {{ option.label }}
              </option>
            }
          </select>
        }
        @case ('checkbox') {
          <div class="form-check">
            <input
              type="checkbox"
              [id]="config.name"
              [formControl]="control"
              [class]="'form-check-input ' + (config.cssClass || '')"
            />
            <label [for]="config.name" class="form-check-label">
              {{ config.placeholder }}
            </label>
          </div>
        }
        @case ('radio') {
          <div class="form-radio-group">
            @for (option of config.options; track option.value) {
              <div class="form-check">
                <input
                  type="radio"
                  [id]="config.name + '_' + option.value"
                  [formControl]="control"
                  [value]="option.value"
                  [disabled]="option.disabled || false"
                  [class]="'form-check-input ' + (config.cssClass || '')"
                />
                <label 
                  [for]="config.name + '_' + option.value" 
                  class="form-check-label"
                >
                  {{ option.label }}
                </label>
              </div>
            }
          </div>
        }
        @default {
          <input
            [type]="config.type"
            [id]="config.name"
            [formControl]="control"
            [placeholder]="config.placeholder || ''"
            [min]="config.min"
            [max]="config.max"
            [step]="config.step"
            [readonly]="config.readonly || false"
            [class]="'form-control ' + (config.cssClass || '')"
          />
        }
      }

      @if (config.hint && !hasError) {
        <small class="form-hint">{{ config.hint }}</small>
      }

      @if (hasError) {
        <div class="form-error">
          @for (error of errorMessages; track error) {
            <small>{{ error }}</small>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .form-field {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .required {
      color: var(--error, #ef4444);
      margin-left: 0.25rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-light, #d1d5db);
      border-radius: 0.375rem;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .form-control:focus {
      outline: none;
      border-color: var(--color-burgundy, #7D1935);
      box-shadow: 0 0 0 3px rgba(125, 25, 53, 0.1);
    }

    .form-control:disabled,
    .form-control:read-only {
      background-color: var(--bg-secondary);
      cursor: not-allowed;
      opacity: 0.7;
    }

    .has-error .form-control {
      border-color: var(--error, #ef4444);
    }

    .has-error .form-control:focus {
      border-color: var(--error, #ef4444);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .form-hint {
      display: block;
      margin-top: 0.25rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .form-error {
      margin-top: 0.25rem;
    }

    .form-error small {
      display: block;
      color: var(--error, #ef4444);
      font-size: 0.875rem;
    }

    .form-check {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .form-check-input {
      margin-right: 0.5rem;
    }

    .form-check-label {
      margin-bottom: 0;
      font-weight: normal;
    }

    .form-radio-group {
      display: flex;
      flex-direction: column;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }

    @media (max-width: 640px) {
      .form-field {
        margin-bottom: 1rem;
      }

      .form-label {
        margin-bottom: 0.375rem;
        font-size: 0.9375rem;
      }

      .form-control {
        padding: 0.625rem;
        font-size: 0.9375rem;
      }

      textarea.form-control {
        padding: 0.625rem;
        min-height: 70px;
      }

      .form-hint {
        margin-top: 0.1875rem;
        font-size: 0.8125rem;
      }

      .form-error small {
        font-size: 0.8125rem;
      }

      .form-check {
        margin-bottom: 0.375rem;
      }
    }
  `]
})
export class FormFieldComponent {
  @Input({ required: true }) config!: FormFieldConfig;
  @Input({ required: true }) control!: FormControl;

  get isRequired(): boolean {
    return this.control.hasValidator(Validators.required);
  }

  get hasError(): boolean {
    return this.control.invalid && this.control.touched;
  }

  get errorMessages(): string[] {
    if (!this.hasError || !this.control.errors) {
      return [];
    }

    const messages: string[] = [];
    const errors = this.control.errors;

    Object.keys(errors).forEach(key => {
      const customMessage = this.config.errorMessages?.[key];
      if (customMessage) {
        messages.push(customMessage);
      } else {
        messages.push(this.getDefaultErrorMessage(key, errors[key]));
      }
    });

    return messages;
  }

  private getDefaultErrorMessage(errorKey: string, errorValue: any): string {
    const label = this.config.label;

    switch (errorKey) {
      case 'required':
        return `${label} is required`;
      case 'email':
        return `Please enter a valid email address`;
      case 'min':
        return `${label} must be at least ${errorValue.min}`;
      case 'max':
        return `${label} must not exceed ${errorValue.max}`;
      case 'minlength':
        return `${label} must be at least ${errorValue.requiredLength} characters`;
      case 'maxlength':
        return `${label} must not exceed ${errorValue.requiredLength} characters`;
      case 'pattern':
        return `${label} format is invalid`;
      case 'phone':
        return `Please enter a valid phone number`;
      case 'futureDate':
        return `${label} must be in the future`;
      case 'minGuests':
        return `Minimum ${errorValue.min} guest${errorValue.min > 1 ? 's' : ''} required`;
      default:
        return `${label} is invalid`;
    }
  }
}
