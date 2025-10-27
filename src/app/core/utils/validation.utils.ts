/**
 * Form validation utilities
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateUtils } from './date.utils';

export class ValidationUtils {
  /**
   * Email validation pattern
   */
  static readonly EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  /**
   * Phone validation pattern (international format)
   */
  static readonly PHONE_PATTERN = /^\+?[1-9]\d{1,14}$/;

  /**
   * Validate future date
   */
  static futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const date = new Date(control.value);
      const today = DateUtils.getToday();

      return date >= today ? null : { futureDate: { value: control.value } };
    };
  }

  /**
   * Validate check-out date is after check-in
   */
  static checkOutAfterCheckInValidator(checkInControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }

      const checkInControl = control.parent.get(checkInControlName);
      if (!checkInControl || !checkInControl.value || !control.value) {
        return null;
      }

      const checkIn = new Date(checkInControl.value);
      const checkOut = new Date(control.value);

      return checkOut > checkIn ? null : { checkOutBeforeCheckIn: true };
    };
  }

  /**
   * Validate minimum nights
   */
  static minimumNightsValidator(minNights: number, checkInControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }

      const checkInControl = control.parent.get(checkInControlName);
      if (!checkInControl || !checkInControl.value || !control.value) {
        return null;
      }

      const checkIn = new Date(checkInControl.value);
      const checkOut = new Date(control.value);
      const nights = DateUtils.calculateNights(checkIn, checkOut);

      return nights >= minNights 
        ? null 
        : { minimumNights: { required: minNights, actual: nights } };
    };
  }

  /**
   * Validate phone number
   */
  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const valid = this.PHONE_PATTERN.test(control.value);
      return valid ? null : { invalidPhone: { value: control.value } };
    };
  }

  /**
   * Validate minimum guests
   */
  static minimumGuestsValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = Number(control.value);
      return value >= min ? null : { minimumGuests: { required: min, actual: value } };
    };
  }

  /**
   * Validate maximum guests
   */
  static maximumGuestsValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = Number(control.value);
      return value <= max ? null : { maximumGuests: { allowed: max, actual: value } };
    };
  }
}
