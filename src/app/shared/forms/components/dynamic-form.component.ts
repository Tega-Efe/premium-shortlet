import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormConfig, FormSubmitEvent } from '../form-field.config';
import { DynamicFormService } from '../dynamic-form.service';
import { FormFieldComponent } from './form-field.component';
import { FormAutoSaveService } from '../form-auto-save.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';

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
      @if (showRestoreNotice()) {
        <div class="restore-notice">
          <div class="restore-content">
            <i class="fas fa-info-circle"></i>
            <span>We found your previously filled form data. Would you like to restore it?</span>
          </div>
          <div class="restore-actions">
            <button type="button" class="btn-restore" (click)="restoreSavedData()">
              <i class="fas fa-undo"></i> Restore
            </button>
            <button type="button" class="btn-dismiss" (click)="dismissRestoreNotice()">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      }

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
        
        @if (lastSaved()) {
          <small class="auto-save-indicator">
            <i class="fas fa-check-circle"></i> Auto-saved {{ lastSaved() }}
          </small>
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

    .restore-notice {
      background: linear-gradient(135deg, rgba(125, 25, 53, 0.05) 0%, rgba(212, 165, 116, 0.05) 100%);
      border: 1px solid var(--color-burgundy, #7D1935);
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      animation: slideDown 0.3s ease-out;
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

    .restore-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--text-primary);
    }

    .restore-content i {
      color: var(--color-burgundy, #7D1935);
      font-size: 1.25rem;
    }

    .restore-actions {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .btn-restore,
    .btn-dismiss {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-restore {
      background: var(--color-burgundy, #7D1935);
      color: white;
    }

    .btn-restore:hover {
      background: #9B2447;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(125, 25, 53, 0.3);
    }

    .btn-dismiss {
      background: transparent;
      color: var(--text-secondary);
      padding: 0.5rem;
    }

    .btn-dismiss:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .auto-save-indicator {
      color: #10b981;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.375rem;
      margin-left: auto;
    }

    .auto-save-indicator i {
      font-size: 1rem;
    }

    @media (max-width: 640px) {
      .form-fields {
        margin-bottom: 1rem;
      }

      .restore-notice {
        flex-direction: column;
        align-items: flex-start;
        padding: 0.75rem;
        margin-bottom: 1rem;
      }

      .restore-content {
        gap: 0.5rem;
        font-size: 0.9375rem;
      }

      .restore-content i {
        font-size: 1.125rem;
      }

      .restore-actions {
        width: 100%;
      }

      .btn-restore {
        flex: 1;
        padding: 0.625rem 0.875rem;
        font-size: 0.8125rem;
      }

      .btn-dismiss {
        padding: 0.625rem;
      }

      .form-actions {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
      }

      .btn {
        padding: 0.625rem 1rem;
        font-size: 0.9375rem;
      }

      .auto-save-indicator {
        text-align: center;
        margin-left: 0;
        font-size: 0.8125rem;
      }

      .auto-save-indicator {
        margin-left: 0;
        justify-content: center;
      }
    }
  `]
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @Input({ required: true }) config!: FormConfig;
  @Input() initialData?: Record<string, any>;
  @Input() formId = 'default-form'; // Unique identifier for auto-save
  @Input() enableAutoSave = true; // Enable/disable auto-save
  @Output() formSubmit = new EventEmitter<FormSubmitEvent>();
  @Output() formReset = new EventEmitter<void>();

  private formService = inject(DynamicFormService);
  private autoSaveService = inject(FormAutoSaveService);
  private destroy$ = new Subject<void>();

  form!: FormGroup;
  isSubmitting = signal<boolean>(false);
  visibleFields = signal(this.config?.fields || []);
  showRestoreNotice = signal<boolean>(false);
  lastSaved = signal<string>('');

  ngOnInit(): void {
    this.form = this.formService.createFormGroup(this.config);

    // Check for auto-saved data
    if (this.enableAutoSave && !this.initialData) {
      const savedData = this.autoSaveService.loadFormData(this.formId);
      if (savedData && Object.keys(savedData).length > 0) {
        this.showRestoreNotice.set(true);
      }
    }

    if (this.initialData) {
      this.formService.populateForm(this.form, this.initialData);
    }

    // Set up auto-save on form value changes
    if (this.enableAutoSave) {
      this.form.valueChanges
        .pipe(
          debounceTime(1000), // Wait 1 second after user stops typing
          takeUntil(this.destroy$)
        )
        .subscribe(value => {
          this.saveFormData(value);
        });
    }

    // Update visible fields when form values change
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.updateVisibleFields(value);
        this.calculateNumberOfNights(value);
      });

    // Initial visibility check
    this.updateVisibleFields(this.form.value);

    // Clean up expired data on init
    this.autoSaveService.clearExpiredData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  restoreSavedData(): void {
    const savedData = this.autoSaveService.loadFormData(this.formId);
    if (savedData) {
      this.formService.populateForm(this.form, savedData);
      this.showRestoreNotice.set(false);
    }
  }

  dismissRestoreNotice(): void {
    this.autoSaveService.clearFormData(this.formId);
    this.showRestoreNotice.set(false);
  }

  private saveFormData(value: Record<string, any>): void {
    // Filter out file objects as they can't be serialized
    const serializableData: Record<string, any> = {};
    
    Object.keys(value).forEach(key => {
      if (!(value[key] instanceof File)) {
        serializableData[key] = value[key];
      }
    });

    this.autoSaveService.saveFormData(this.formId, serializableData);
    this.updateLastSaved();
  }

  private updateLastSaved(): void {
    const timestamp = this.autoSaveService.getSaveTimestamp(this.formId);
    if (timestamp) {
      const now = Date.now();
      const diff = now - timestamp;
      
      if (diff < 60000) {
        this.lastSaved.set('just now');
      } else if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        this.lastSaved.set(`${minutes} min ago`);
      } else {
        this.lastSaved.set(new Date(timestamp).toLocaleTimeString());
      }
    }
  }

  /**
   * Automatically calculate number of nights based on check-in and check-out dates
   */
  private calculateNumberOfNights(value: Record<string, any>): void {
    const checkInDate = value['checkInDate'];
    const checkOutDate = value['checkOutDate'];
    const numberOfNightsControl = this.form.get('numberOfNights');

    if (checkInDate && checkOutDate && numberOfNightsControl) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      // Calculate difference in days
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Only update if the calculated value is valid (positive)
      if (nights > 0 && nights !== numberOfNightsControl.value) {
        numberOfNightsControl.setValue(nights, { emitEvent: false });
      }
    }
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

    // Clear auto-saved data on successful submit
    if (this.enableAutoSave) {
      this.autoSaveService.clearFormData(this.formId);
      this.lastSaved.set('');
    }

    // Reset submitting state after a short delay
    // The parent component should handle this properly
    setTimeout(() => {
      this.isSubmitting.set(false);
    }, 500);
  }

  onReset(): void {
    this.formService.resetForm(this.form, this.config);
    
    // Clear auto-saved data on reset
    if (this.enableAutoSave) {
      this.autoSaveService.clearFormData(this.formId);
      this.lastSaved.set('');
    }
    
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
