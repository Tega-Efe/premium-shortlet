/**
 * Date utility functions for booking calculations
 */

export class DateUtils {
  /**
   * Calculate number of nights between two dates
   */
  static calculateNights(checkIn: Date, checkOut: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffTime / oneDay);
  }

  /**
   * Check if a date is within a range
   */
  static isDateInRange(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
  }

  /**
   * Check if two date ranges overlap
   */
  static doRangesOverlap(
    range1Start: Date,
    range1End: Date,
    range2Start: Date,
    range2End: Date
  ): boolean {
    return range1Start <= range2End && range2Start <= range1End;
  }

  /**
   * Format date to YYYY-MM-DD
   */
  static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Parse date string to Date object
   */
  static parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Get today's date at midnight
   */
  static getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  /**
   * Add days to a date
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Check if date is in the past
   */
  static isPast(date: Date): boolean {
    return date < this.getToday();
  }

  /**
   * Check if date is in the future
   */
  static isFuture(date: Date): boolean {
    return date > this.getToday();
  }
}
