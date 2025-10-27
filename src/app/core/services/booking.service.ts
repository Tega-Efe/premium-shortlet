import { Injectable, inject, signal } from '@angular/core';
import { Observable, BehaviorSubject, throwError, Subject } from 'rxjs';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { Booking, BookingFilter, BookingStatus } from '../interfaces';
import { ApiService } from './api.service';
import { DateUtils, PriceUtils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiService = inject(ApiService);

  // State management
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  public bookings$ = this.bookingsSubject.asObservable();

  private currentBookingSubject = new BehaviorSubject<Booking | null>(null);
  public currentBooking$ = this.currentBookingSubject.asObservable();

  // Real-time updates channel
  private bookingUpdatesSubject = new Subject<Booking>();
  public bookingUpdates$ = this.bookingUpdatesSubject.asObservable();

  // Expose subject for admin service integration
  public notifyBookingUpdate(booking: Booking): void {
    this.bookingUpdatesSubject.next(booking);
  }

  // Signals for reactive state
  public totalBookings = signal<number>(0);
  public pendingBookings = signal<number>(0);
  public isLoading = signal<boolean>(false);

  /**
   * Create new booking
   */
  createBooking(bookingData: Partial<Booking>): Observable<Booking> {
    this.isLoading.set(true);

    // Calculate pricing if not provided
    if (bookingData.bookingDetails && bookingData.pricing) {
      const { checkIn, checkOut } = bookingData.bookingDetails;
      const nights = DateUtils.calculateNights(checkIn, checkOut);
      bookingData.bookingDetails.numberOfNights = nights;
    }

    return this.apiService.post<Booking>('bookings', bookingData).pipe(
      tap(booking => {
        this.currentBookingSubject.next(booking);
        this.bookingUpdatesSubject.next(booking);
        this.isLoading.set(false);
        this.clearCache();
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all bookings with optional filters
   */
  getBookings(filter?: BookingFilter): Observable<Booking[]> {
    this.isLoading.set(true);

    return this.apiService.get<Booking[]>('bookings', filter).pipe(
      tap(bookings => {
        this.bookingsSubject.next(bookings);
        this.totalBookings.set(bookings.length);
        this.updatePendingCount(bookings);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      }),
      shareReplay(1)
    );
  }

  /**
   * Get booking by ID
   */
  getBookingById(id: string): Observable<Booking> {
    this.isLoading.set(true);

    return this.apiService.get<Booking>(`bookings/${id}`).pipe(
      tap(booking => {
        this.currentBookingSubject.next(booking);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update booking
   */
  updateBooking(id: string, updates: Partial<Booking>): Observable<Booking> {
    this.isLoading.set(true);

    return this.apiService.patch<Booking>(`bookings/${id}`, updates).pipe(
      tap(booking => {
        this.currentBookingSubject.next(booking);
        this.bookingUpdatesSubject.next(booking);
        this.isLoading.set(false);
        this.clearCache();
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update booking status
   */
  updateBookingStatus(id: string, status: BookingStatus): Observable<Booking> {
    return this.updateBooking(id, { status });
  }

  /**
   * Cancel booking
   */
  cancelBooking(id: string, reason?: string): Observable<Booking> {
    this.isLoading.set(true);

    return this.apiService.post<Booking>(`bookings/${id}/cancel`, { reason }).pipe(
      tap(booking => {
        this.bookingUpdatesSubject.next(booking);
        this.isLoading.set(false);
        this.clearCache();
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get bookings by status
   */
  getBookingsByStatus(status: BookingStatus): Observable<Booking[]> {
    return this.getBookings({ status: [status] });
  }

  /**
   * Get pending bookings
   */
  getPendingBookings(): Observable<Booking[]> {
    return this.getBookingsByStatus('pending');
  }

  /**
   * Get confirmed bookings
   */
  getConfirmedBookings(): Observable<Booking[]> {
    return this.getBookingsByStatus('confirmed');
  }

  /**
   * Get user bookings by email
   */
  getUserBookings(email: string): Observable<Booking[]> {
    return this.getBookings({ guestEmail: email });
  }

  /**
   * Get apartment bookings
   */
  getApartmentBookings(apartmentId: string): Observable<Booking[]> {
    return this.getBookings({ apartmentId });
  }

  /**
   * Calculate booking summary
   */
  calculateBookingSummary(bookings: Booking[]): BookingSummary {
    const summary: BookingSummary = {
      total: bookings.length,
      pending: 0,
      confirmed: 0,
      approved: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0,
      totalRevenue: 0,
      averageBookingValue: 0
    };

    bookings.forEach(booking => {
      summary[booking.status]++;
      summary.totalRevenue += booking.pricing.totalPrice;
    });

    summary.averageBookingValue = summary.total > 0 
      ? summary.totalRevenue / summary.total 
      : 0;

    return summary;
  }

  /**
   * Filter bookings locally
   */
  filterBookings(bookings: Booking[], filter: BookingFilter): Booking[] {
    return bookings.filter(booking => {
      // Status filter
      if (filter.status && filter.status.length > 0) {
        if (!filter.status.includes(booking.status)) {
          return false;
        }
      }

      // Date range filter
      if (filter.dateRange) {
        const checkIn = new Date(booking.bookingDetails.checkIn);
        if (!DateUtils.isDateInRange(
          checkIn,
          filter.dateRange.start,
          filter.dateRange.end
        )) {
          return false;
        }
      }

      // Apartment filter
      if (filter.apartmentId && booking.apartmentId !== filter.apartmentId) {
        return false;
      }

      // Guest email filter
      if (filter.guestEmail && 
          booking.guestInfo.email.toLowerCase() !== filter.guestEmail.toLowerCase()) {
        return false;
      }

      // Price range filter
      if (filter.minPrice !== undefined && booking.pricing.totalPrice < filter.minPrice) {
        return false;
      }
      if (filter.maxPrice !== undefined && booking.pricing.totalPrice > filter.maxPrice) {
        return false;
      }

      return true;
    });
  }

  /**
   * Sort bookings
   */
  sortBookings(bookings: Booking[], sortBy: BookingSortOption): Booking[] {
    const sorted = [...bookings];

    switch (sortBy) {
      case 'date-asc':
        return sorted.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'date-desc':
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'price-asc':
        return sorted.sort((a, b) => a.pricing.totalPrice - b.pricing.totalPrice);
      case 'price-desc':
        return sorted.sort((a, b) => b.pricing.totalPrice - a.pricing.totalPrice);
      case 'checkin-asc':
        return sorted.sort((a, b) => 
          new Date(a.bookingDetails.checkIn).getTime() - 
          new Date(b.bookingDetails.checkIn).getTime()
        );
      default:
        return sorted;
    }
  }

  /**
   * Update pending count
   */
  private updatePendingCount(bookings: Booking[]): void {
    const pending = bookings.filter(b => b.status === 'pending').length;
    this.pendingBookings.set(pending);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.apiService.clearCache('bookings');
  }
}

export interface BookingSummary {
  total: number;
  pending: number;
  confirmed: number;
  approved: number;
  completed: number;
  cancelled: number;
  rejected: number;
  totalRevenue: number;
  averageBookingValue: number;
}

export type BookingSortOption = 
  | 'date-asc' 
  | 'date-desc' 
  | 'price-asc' 
  | 'price-desc' 
  | 'checkin-asc';
