import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EmailNotificationPayload } from '../interfaces/simplified-booking.interface';
import { environment } from '../../../environments/environment';

/**
 * Email Notification Service
 * Integrates with external Django API for sending booking-related emails
 * 
 * This service is independent of Firestore and sends notifications to:
 * - Admin when a new booking is submitted
 * - Guest when booking is approved or rejected
 *
 * CONFIG: url/apiKey/useMock now come from environment.ts / environment.prod.ts
 * (see emailApi below) instead of being hardcoded here, so per-environment
 * values aren't committed to source and dev/prod can differ without a code
 * change. Add this to both environment files:
 *
 *   emailApi: {
 *     useMock: true,                 // false once the backend is live
 *     url: 'https://your-django-api.com/api/notifications/send',
 *     apiKey: ''                     // see the security note below
 *   }
 *
 * SECURITY: an API key read here still ships inside the compiled browser
 * bundle — anyone can read it from dev tools. That's fine for a low-value
 * "notify" webhook behind rate limiting, but if this key can do anything
 * sensitive on the Django side, don't put it here at all: front this
 * endpoint with a Firebase Cloud Function (e.g. triggered on a new
 * `simplified-bookings` doc, or a callable function) that holds the real
 * key server-side, and point `url` at that function instead.
 */
@Injectable({
  providedIn: 'root'
})
export class EmailNotificationService {
  private http = inject(HttpClient);

  private readonly USE_MOCK_EMAIL = environment.emailApi?.useMock ?? true;
  private readonly DJANGO_API_URL = environment.emailApi?.url ?? '';
  private readonly API_KEY = environment.emailApi?.apiKey ?? '';
  
  /**
   * Send booking received notification to admin
   */
  sendBookingReceivedNotification(
    adminEmail: string,
    guestName: string,
    bookingOption: string,
    checkInDate: string,
    checkOutDate: string,
    numberOfNights: number,
    numberOfGuests: number,
    guestAddress: string
  ): Observable<any> {
    const payload: EmailNotificationPayload = {
      to: adminEmail,
      subject: '🏠 New Booking Request Received',
      templateType: 'booking-received',
      data: {
        guestName,
        bookingOption: this.formatBookingOption(bookingOption),
        checkInDate: this.formatDate(checkInDate),
        checkOutDate: this.formatDate(checkOutDate),
        numberOfNights,
        numberOfGuests,
        address: guestAddress
      }
    };

    return this.sendEmail(payload).pipe(
      tap(() => console.log('✅ Booking received email sent to admin')),
      catchError(error => {
        console.error('❌ Failed to send booking received email:', error);
        // Don't throw error - email failure shouldn't break booking flow
        return of(null);
      })
    );
  }

  /**
   * Send booking approved notification to guest
   */
  sendBookingApprovedNotification(
    guestEmail: string,
    guestName: string,
    bookingOption: string,
    checkInDate: string,
    checkOutDate: string,
    numberOfNights: number,
    numberOfGuests: number,
    adminNotes?: string
  ): Observable<any> {
    const payload: EmailNotificationPayload = {
      to: guestEmail,
      subject: '✅ Your Booking Has Been Approved!',
      templateType: 'booking-approved',
      data: {
        guestName,
        bookingOption: this.formatBookingOption(bookingOption),
        checkInDate: this.formatDate(checkInDate),
        checkOutDate: this.formatDate(checkOutDate),
        numberOfNights,
        numberOfGuests,
        adminNotes
      }
    };

    return this.sendEmail(payload).pipe(
      tap(() => console.log('✅ Booking approved email sent to guest')),
      catchError(error => {
        console.error('❌ Failed to send booking approved email:', error);
        return of(null);
      })
    );
  }

  /**
   * Send booking rejected notification to guest
   */
  sendBookingRejectedNotification(
    guestEmail: string,
    guestName: string,
    bookingOption: string,
    checkInDate: string,
    checkOutDate: string,
    numberOfGuests: number,
    adminNotes?: string
  ): Observable<any> {
    const payload: EmailNotificationPayload = {
      to: guestEmail,
      subject: '❌ Booking Request Update',
      templateType: 'booking-rejected',
      data: {
        guestName,
        bookingOption: this.formatBookingOption(bookingOption),
        checkInDate: this.formatDate(checkInDate),
        checkOutDate: this.formatDate(checkOutDate),
        numberOfNights: 0,
        numberOfGuests,
        adminNotes
      }
    };

    return this.sendEmail(payload).pipe(
      tap(() => console.log('✅ Booking rejected email sent to guest')),
      catchError(error => {
        console.error('❌ Failed to send booking rejected email:', error);
        return of(null);
      })
    );
  }

  /**
   * Core email sending method
   * Calls the Django API endpoint (or mocks it in development mode)
   */
  private sendEmail(payload: EmailNotificationPayload): Observable<any> {
    // DEVELOPMENT MODE: Just log the notification instead of making HTTP call
    if (this.USE_MOCK_EMAIL) {
      console.log('📧 [MOCK EMAIL] Would send email:', {
        to: payload.to,
        subject: payload.subject,
        template: payload.templateType,
        data: payload.data
      });
      // Return successful mock response
      return of({ success: true, message: 'Mock email logged' });
    }

    // PRODUCTION MODE: Make actual HTTP call to Django API
    if (!this.DJANGO_API_URL) {
      console.warn('⚠️ emailApi.useMock is false but no emailApi.url is configured — logging instead of sending.');
      return of({ success: false, message: 'Email API URL not configured' });
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.API_KEY}`  // If your Django API requires auth
    });

    return this.http.post(this.DJANGO_API_URL, payload, { headers }).pipe(
      catchError(error => {
        console.error('Django API Error:', error);
        return throwError(() => new Error('Email service unavailable'));
      })
    );
  }

  /**
   * Format booking option for display
   */
  private formatBookingOption(option: string): string {
    if (option === 'one-room') {
      return 'One Room';
    } else if (option === 'entire-apartment') {
      return 'Entire Apartment (2 Bedrooms)';
    }
    return option;
  }

  /**
   * Format date to human-readable format
   */
  private formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}