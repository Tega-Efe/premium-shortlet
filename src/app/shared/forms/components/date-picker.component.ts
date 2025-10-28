import { Component, Input, forwardRef, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="date-picker-container">
      <button
        type="button"
        class="date-trigger"
        [class.open]="isOpen()"
        [class.disabled]="disabled"
        [class.has-value]="displayValue()"
        (click)="toggleCalendar()"
        [disabled]="disabled"
      >
        <i class="fas fa-calendar-alt date-icon"></i>
        <span [class.placeholder]="!displayValue()">
          {{ displayValue() || placeholder }}
        </span>
        <i class="fas fa-chevron-down date-arrow" [class.rotate]="isOpen()"></i>
      </button>

      @if (isOpen()) {
        <div class="calendar-dropdown">
          <div class="calendar-header">
            <button type="button" class="nav-btn" (click)="previousMonth()">
              <i class="fas fa-chevron-left"></i>
            </button>
            <span class="current-month">{{ currentMonthLabel() }}</span>
            <button type="button" class="nav-btn" (click)="nextMonth()">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>

          <div class="calendar-grid">
            <div class="weekday-header">
              @for (day of weekDays; track day) {
                <div class="weekday">{{ day }}</div>
              }
            </div>

            <div class="days-grid">
              @for (day of calendarDays(); track day.date) {
                <button
                  type="button"
                  class="day-cell"
                  [class.other-month]="!day.isCurrentMonth"
                  [class.today]="day.isToday"
                  [class.selected]="day.isSelected"
                  [class.disabled]="day.isDisabled"
                  (click)="selectDate(day)"
                  [disabled]="day.isDisabled"
                >
                  {{ day.day }}
                </button>
              }
            </div>
          </div>

          <div class="calendar-footer">
            <button type="button" class="btn-today" (click)="selectToday()">
              Today
            </button>
            <button type="button" class="btn-clear" (click)="clearDate()">
              Clear
            </button>
          </div>
        </div>
      }
    </div>

    @if (isOpen()) {
      <div class="calendar-backdrop" (click)="closeCalendar()"></div>
    }
  `,
  styles: [`
    .date-picker-container {
      position: relative;
      width: 100%;
    }

    .date-trigger {
      width: 100%;
      padding: 0.75rem;
      background: var(--bg-primary, white);
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1rem;
      text-align: left;
      position: relative;
      z-index: 10;
    }

    .date-trigger:hover:not(.disabled) {
      border-color: var(--color-burgundy, #7D1935);
      background: rgba(125, 25, 53, 0.02);
    }

    .date-trigger.open,
    .date-trigger.has-value {
      border-color: var(--color-burgundy, #7D1935);
    }

    .date-trigger.open {
      box-shadow: 0 0 0 3px rgba(125, 25, 53, 0.1);
    }

    .date-trigger.disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .date-icon {
      color: var(--color-burgundy, #7D1935);
      font-size: 1.125rem;
    }

    .date-trigger span {
      flex: 1;
      color: var(--text-primary, #374151);
      font-weight: 500;
    }

    .date-trigger .placeholder {
      color: var(--text-secondary, #9ca3af);
      font-weight: 400;
    }

    .date-arrow {
      font-size: 0.875rem;
      color: var(--text-secondary, #6b7280);
      transition: transform 0.2s ease;
    }

    .date-arrow.rotate {
      transform: rotate(180deg);
    }

    .calendar-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      background: var(--bg-primary, white);
      border: 2px solid var(--color-burgundy, #7D1935);
      border-radius: 0.75rem;
      box-shadow: 0 10px 25px rgba(125, 25, 53, 0.15);
      z-index: 50;
      padding: 1rem;
      min-width: 320px;
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

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .nav-btn {
      width: 32px;
      height: 32px;
      background: transparent;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-burgundy, #7D1935);
      transition: all 0.2s ease;
    }

    .nav-btn:hover {
      background: rgba(125, 25, 53, 0.1);
    }

    .current-month {
      font-weight: 700;
      color: var(--text-primary, #374151);
      font-size: 1rem;
    }

    .calendar-grid {
      margin-bottom: 0.75rem;
    }

    .weekday-header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .weekday {
      text-align: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary, #6b7280);
      padding: 0.25rem;
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.25rem;
    }

    .day-cell {
      aspect-ratio: 1;
      background: transparent;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary, #374151);
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .day-cell:hover:not(.disabled):not(.other-month) {
      background: rgba(125, 25, 53, 0.1);
      color: var(--color-burgundy, #7D1935);
      transform: scale(1.05);
    }

    .day-cell.other-month {
      color: #d1d5db;
      cursor: default;
    }

    .day-cell.today {
      border: 2px solid var(--color-burgundy, #7D1935);
      font-weight: 700;
    }

    .day-cell.selected {
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, #9B2447 100%);
      color: white;
      font-weight: 700;
    }

    .day-cell.selected:hover {
      background: #9B2447;
      transform: scale(1.05);
    }

    .day-cell.disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .calendar-footer {
      display: flex;
      gap: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn-today,
    .btn-clear {
      flex: 1;
      padding: 0.5rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-today {
      background: var(--color-burgundy, #7D1935);
      color: white;
    }

    .btn-today:hover {
      background: #9B2447;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(125, 25, 53, 0.3);
    }

    .btn-clear {
      background: transparent;
      color: var(--text-secondary, #6b7280);
      border: 1px solid #d1d5db;
    }

    .btn-clear:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .calendar-backdrop {
      position: fixed;
      inset: 0;
      z-index: 5;
      background: transparent;
    }

    @media (max-width: 640px) {
      .calendar-dropdown {
        left: 50%;
        transform: translateX(-50%);
        min-width: 300px;
        padding: 0.75rem;
      }

      .date-trigger {
        padding: 0.625rem 0.75rem;
        font-size: 0.9375rem;
      }

      .date-icon {
        font-size: 1rem;
      }

      .date-arrow {
        font-size: 0.75rem;
      }

      .calendar-header {
        margin-bottom: 0.75rem;
        padding-bottom: 0.625rem;
      }

      .current-month {
        font-size: 0.9375rem;
      }

      .nav-btn {
        width: 28px;
        height: 28px;
        font-size: 0.875rem;
      }

      .weekday {
        font-size: 0.6875rem;
        padding: 0.1875rem;
      }

      .day-cell {
        font-size: 0.8125rem;
      }

      .calendar-footer {
        padding-top: 0.625rem;
      }

      .btn-today,
      .btn-clear {
        padding: 0.4375rem;
        font-size: 0.8125rem;
      }
    }
  `]
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() placeholder = 'Select date';
  @Input() minDate?: string; // ISO date string
  @Input() maxDate?: string; // ISO date string
  
  isOpen = signal(false);
  selectedDate = signal<Date | null>(null);
  currentMonth = signal(new Date());
  disabled = false;

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  displayValue = computed(() => {
    const date = this.selectedDate();
    if (!date) return '';
    return this.formatDate(date);
  });

  currentMonthLabel = computed(() => {
    const date = this.currentMonth();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  calendarDays = computed(() => {
    const current = this.currentMonth();
    const year = current.getFullYear();
    const month = current.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const days: any[] = [];
    const selected = this.selectedDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Previous month days
    const firstDayWeek = firstDay.getDay();
    for (let i = firstDayWeek - 1; i >= 0; i--) {
      const day = prevLastDay.getDate() - i;
      const date = new Date(year, month - 1, day);
      days.push({
        day,
        date: date.toISOString(),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isDisabled: this.isDateDisabled(date)
      });
    }

    // Current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      
      days.push({
        day,
        date: date.toISOString(),
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        isSelected: selected && date.getTime() === selected.getTime(),
        isDisabled: this.isDateDisabled(date)
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        day,
        date: date.toISOString(),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isDisabled: this.isDateDisabled(date)
      });
    }

    return days;
  });

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    if (value) {
      const date = new Date(value);
      this.selectedDate.set(date);
      this.currentMonth.set(new Date(date.getFullYear(), date.getMonth(), 1));
    } else {
      this.selectedDate.set(null);
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

  toggleCalendar(): void {
    if (this.disabled) return;
    this.isOpen.update(open => !open);
    if (!this.isOpen()) {
      this.onTouched();
    }
  }

  closeCalendar(): void {
    this.isOpen.set(false);
    this.onTouched();
  }

  previousMonth(): void {
    this.currentMonth.update(date => {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }

  nextMonth(): void {
    this.currentMonth.update(date => {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }

  selectDate(day: any): void {
    if (day.isDisabled || !day.isCurrentMonth) return;
    
    const date = new Date(day.date);
    this.selectedDate.set(date);
    this.onChange(date.toISOString().split('T')[0]);
    this.closeCalendar();
  }

  selectToday(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!this.isDateDisabled(today)) {
      this.selectedDate.set(today);
      this.currentMonth.set(new Date(today.getFullYear(), today.getMonth(), 1));
      this.onChange(today.toISOString().split('T')[0]);
      this.closeCalendar();
    }
  }

  clearDate(): void {
    this.selectedDate.set(null);
    this.onChange('');
    this.closeCalendar();
  }

  private isDateDisabled(date: Date): boolean {
    if (this.minDate) {
      const min = new Date(this.minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return true;
    }

    if (this.maxDate) {
      const max = new Date(this.maxDate);
      max.setHours(0, 0, 0, 0);
      if (date > max) return true;
    }

    return false;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
