import { Component, Input, Output, EventEmitter, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormConfig, FormSubmitEvent } from '../form-field.config';
import { DynamicFormService } from '../dynamic-form.service';
import { FormFieldComponent } from './form-field.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form 
      [formGroup]="form"
      [class]="'dynamic-form ' + (config.cssClass || '')"
      [class.layout-horizontal]="config.layout === 'horizontal'"
      [class.layout-inline]="config.layout === 'inline'"
      (ngSubmit)="onSubmit()"
    >
      <div class="form-fields">
        @for (field of visibleFields(); track field.name) {
          <app-form-field
            [config]="field"
            [control]="getFormControl(field.name)"
          />
        }
      </div>

      <div class="form-actions">
        <button 
          type="submit" 
          class="btn btn-primary"
          [disabled]="form.invalid || isSubmitting()"
        >
          {{ isSubmitting() ? 'Submitting...' : (config.submitLabel || 'Submit') }}
        </button>

        @if (config.showReset !== false) {
          <button 
            type="button" 
            class="btn btn-secondary"
            (click)="onReset()"
            [disabled]="isSubmitting()"
          >
            {{ config.resetLabel || 'Reset' }}
          </button>
        }
      </div>
    </form>
  `,
  styles: [`
    .dynamic-form {
      width: 100%;
    }

    .form-fields {
      margin-bottom: 1.5rem;
    }

    .layout-horizontal .form-fields {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .layout-inline .form-fields {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .layout-inline .form-fields > * {
      flex: 1;
      min-width: 200px;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, #9B2447 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(125, 25, 53, 0.4);
    }

    .btn-secondary {
      background-color: var(--bg-primary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: var(--bg-secondary);
    }
  `]
})
export class DynamicFormComponent implements OnInit {
  @Input({ required: true }) config!: FormConfig;
  @Input() initialData?: Record<string, any>;
  @Output() formSubmit = new EventEmitter<FormSubmitEvent>();
  @Output() formReset = new EventEmitter<void>();

  private formService = inject(DynamicFormService);

  form!: FormGroup;
  isSubmitting = signal<boolean>(false);
  visibleFields = signal(this.config?.fields || []);

  ngOnInit(): void {
    this.form = this.formService.createFormGroup(this.config);

    if (this.initialData) {
      this.formService.populateForm(this.form, this.initialData);
    }

    // Update visible fields when form values change
    this.form.valueChanges.subscribe(value => {
      this.updateVisibleFields(value);
    });

    // Initial visibility check
    this.updateVisibleFields(this.form.value);
  }

  getFormControl(name: string) {
    return this.form.get(name) as any;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.formService.validateAllFields(this.form);
      return;
    }

    this.isSubmitting.set(true);

    const submitEvent: FormSubmitEvent = {
      value: this.form.value,
      valid: this.form.valid,
      form: this.form
    };

    this.formSubmit.emit(submitEvent);

    // Reset submitting state after a short delay
    // The parent component should handle this properly
    setTimeout(() => {
      this.isSubmitting.set(false);
    }, 500);
  }

  onReset(): void {
    this.formService.resetForm(this.form, this.config);
    this.formReset.emit();
  }

  /**
   * Update visible fields based on conditional display logic
   */
  private updateVisibleFields(formValue: Record<string, any>): void {
    const visible = this.config.fields.filter(field =>
      this.formService.shouldDisplayField(field, formValue)
    );
    this.visibleFields.set(visible);
  }

  /**
   * Public method to populate form externally
   */
  populateForm(data: Record<string, any>): void {
    this.formService.populateForm(this.form, data);
  }

  /**
   * Public method to reset form externally
   */
  resetForm(): void {
    this.onReset();
  }

  /**
   * Public method to get form errors
   */
  getErrors(): Record<string, any> {
    return this.formService.getFormErrors(this.form);
  }
}
