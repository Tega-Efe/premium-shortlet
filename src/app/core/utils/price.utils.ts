/**
 * Price calculation utilities for bookings
 */

import { Pricing, Discount } from '../interfaces';

// Note: Complex booking pricing types (BookingPricing, PriceBreakdown) removed
// These were part of the unused booking.interface.ts
// The methods below are preserved but typed differently

// Temporary interfaces for complex pricing (not implemented yet)
interface BookingPricing {
  basePrice: number;
  totalPrice: number;
  currency: string;
  breakdown?: PriceBreakdown;
}

interface PriceBreakdown {
  accommodationCost: number;
  serviceFee: number;
  cleaningFee: number;
  tax: number;
  discount?: number;
}

export class PriceUtils {
  private static readonly SERVICE_FEE_PERCENTAGE = 0.10; // 10%
  private static readonly CLEANING_FEE = 50;
  private static readonly TAX_PERCENTAGE = 0.075; // 7.5%

  /**
   * Calculate total booking price
   */
  static calculateBookingPrice(
    basePrice: number,
    numberOfNights: number,
    discounts?: Discount[]
  ): BookingPricing {
    const accommodationCost = basePrice * numberOfNights;
    let discount = 0;

    // Apply discounts
    if (discounts && discounts.length > 0) {
      discount = this.calculateDiscount(accommodationCost, numberOfNights, discounts);
    }

    const serviceFee = Math.round(accommodationCost * this.SERVICE_FEE_PERCENTAGE);
    const cleaningFee = this.CLEANING_FEE;
    const subtotal = accommodationCost - discount + serviceFee + cleaningFee;
    const tax = Math.round(subtotal * this.TAX_PERCENTAGE);
    const totalPrice = subtotal + tax;

    const breakdown: PriceBreakdown = {
      accommodationCost,
      serviceFee,
      cleaningFee,
      tax,
      discount: discount > 0 ? discount : undefined
    };

    return {
      basePrice,
      totalPrice,
      currency: 'NGN',
      breakdown
    };
  }

  /**
   * Calculate applicable discount
   */
  private static calculateDiscount(
    amount: number,
    numberOfNights: number,
    discounts: Discount[]
  ): number {
    let maxDiscount = 0;

    for (const discount of discounts) {
      if (this.isDiscountApplicable(numberOfNights, discount)) {
        const discountAmount = Math.round(amount * (discount.percentage / 100));
        maxDiscount = Math.max(maxDiscount, discountAmount);
      }
    }

    return maxDiscount;
  }

  /**
   * Check if discount is applicable
   */
  private static isDiscountApplicable(numberOfNights: number, discount: Discount): boolean {
    if (discount.minDays && numberOfNights < discount.minDays) {
      return false;
    }

    const now = new Date();
    if (discount.validFrom && now < discount.validFrom) {
      return false;
    }

    if (discount.validTo && now > discount.validTo) {
      return false;
    }

    return true;
  }

  /**
   * Format price with currency
   */
  static formatPrice(amount: number, currency: string = 'NGN'): string {
    // Convert ₦ symbol to proper ISO currency code
    const currencyCode = currency === '₦' ? 'NGN' : currency;
    
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  }

  /**
   * Calculate price per night from total
   */
  static calculatePricePerNight(totalPrice: number, numberOfNights: number): number {
    return Math.round(totalPrice / numberOfNights);
  }
}
