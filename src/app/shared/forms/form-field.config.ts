import { ValidatorFn } from '@angular/forms';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  value?: any;
  validators?: ValidatorFn[];
  options?: FormFieldOption[];
  rows?: number; // For textarea
  min?: number | string; // For number/date
  max?: number | string; // For number/date
  step?: number; // For number
  multiple?: boolean; // For select
  disabled?: boolean;
  readonly?: boolean;
  hint?: string;
  errorMessages?: Record<string, string>;
  cssClass?: string;
  containerClass?: string;
  conditionalDisplay?: FormCondition;
  accept?: string; // For file input - accepted file types
}

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'date'
  | 'checkbox'
  | 'radio'
  | 'file';

export interface FormFieldOption {
  label: string;
  value: any;
  disabled?: boolean;
  icon?: string; // Font Awesome icon class
}

export interface FormCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value: any;
}

export interface FormConfig {
  fields: FormFieldConfig[];
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  layout?: 'vertical' | 'horizontal' | 'inline';
  cssClass?: string;
}

export interface FormSubmitEvent {
  value: any;
  valid: boolean;
  form: any;
}
