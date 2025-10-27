import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormFieldConfig, FormConfig } from './form-field.config';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor(private fb: FormBuilder) {}

  /**
   * Create form group from configuration
   */
  createFormGroup(config: FormConfig): FormGroup {
    const group: Record<string, FormControl> = {};

    config.fields.forEach(field => {
      const validators = field.validators || [];
      const value = field.value || this.getDefaultValue(field.type);
      
      group[field.name] = new FormControl(
        { value, disabled: field.disabled || false },
        validators
      );
    });

    return this.fb.group(group);
  }

  /**
   * Get default value based on field type
   */
  private getDefaultValue(type: string): any {
    switch (type) {
      case 'number':
        return 0;
      case 'checkbox':
        return false;
      case 'select':
        return null;
      case 'date':
        return '';
      default:
        return '';
    }
  }

  /**
   * Populate form with data
   */
  populateForm(form: FormGroup, data: Record<string, any>): void {
    Object.keys(data).forEach(key => {
      if (form.controls[key]) {
        form.controls[key].setValue(data[key]);
      }
    });
  }

  /**
   * Reset form to initial values
   */
  resetForm(form: FormGroup, config: FormConfig): void {
    config.fields.forEach(field => {
      const control = form.get(field.name);
      if (control) {
        control.setValue(field.value || this.getDefaultValue(field.type));
        control.markAsUntouched();
        control.markAsPristine();
      }
    });
  }

  /**
   * Validate all fields
   */
  validateAllFields(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  /**
   * Get form errors
   */
  getFormErrors(form: FormGroup): Record<string, any> {
    const errors: Record<string, any> = {};

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });

    return errors;
  }

  /**
   * Check if field should be displayed based on conditions
   */
  shouldDisplayField(
    field: FormFieldConfig,
    formValue: Record<string, any>
  ): boolean {
    if (!field.conditionalDisplay) {
      return true;
    }

    const condition = field.conditionalDisplay;
    const fieldValue = formValue[condition.field];

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'notEquals':
        return fieldValue !== condition.value;
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'greaterThan':
        return Number(fieldValue) > Number(condition.value);
      case 'lessThan':
        return Number(fieldValue) < Number(condition.value);
      default:
        return true;
    }
  }
}
