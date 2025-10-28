import { Injectable, inject, signal } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  CollectionReference,
  DocumentData
} from '@angular/fire/firestore';
import { Observable, from, throwError, of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { 
  SimplifiedBooking, 
  ApartmentAvailability, 
  SimplifiedBookingStats,
  BookingFormData
} from '../interfaces/simplified-booking.interface';
import { EmailNotificationService } from './email-notification.service';

/**
 * TEMPORARY Simplified Booking Service (No File Upload)
 * Use this version if Firebase Storage is not yet set up
 * 
 * TO USE THIS VERSION:
 * 1. In home.component.ts, change the import from:
 *    import { SimplifiedBookingService } from './simplified-booking.service';
 *    to:
 *    import { SimplifiedBookingService } from './simplified-booking-no-storage.service';
 * 
 * Note: This version saves booking data WITHOUT ID photo upload
 * Once Firebase Storage is set up, switch back to the original service
 */
@Injectable({
  providedIn: 'root'
})
export class SimplifiedBookingServiceNoStorage {
  private firestore = inject(Firestore);
  private emailService = inject(EmailNotificationService);
  
  private bookingsCollection: CollectionReference<DocumentData>;
  private availabilityCollection: CollectionReference<DocumentData>;
  
  public isLoading = signal<boolean>(false);
  public isApartmentAvailable = signal<boolean>(true);
  public bookingStats = signal<SimplifiedBookingStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    isApartmentAvailable: true
  });
  
  private readonly ADMIN_EMAIL = 'admin@shortletconnect.com';
  
  constructor() {
    this.bookingsCollection = collection(this.firestore, 'simplified-bookings');
    this.availabilityCollection = collection(this.firestore, 'apartment-availability');
    this.loadApartmentAvailability().subscribe();
  }
  
  /**
   * Create a new booking WITHOUT file upload
   * This is a temporary solution until Firebase Storage is configured
   */
  createBooking(formData: BookingFormData, apartmentId: string, pricePerNight?: number): Observable<SimplifiedBooking> {
    this.isLoading.set(true);
    
    // Calculate pricing
    const calculatedPricePerNight = pricePerNight || 
      (formData.bookingOption === 'one-room' ? 25000 : 45000);
    const totalPrice = calculatedPricePerNight * formData.numberOfNights;
    
    const booking: SimplifiedBooking = {
      apartmentId: apartmentId,  // Link to specific apartment
      guestInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        // Note: ID photo is NOT uploaded in this version
        // idPhotoUrl will be empty
      },
      bookingDetails: {
        bookingOption: formData.bookingOption,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfNights: formData.numberOfNights,
        numberOfGuests: formData.numberOfGuests
      },
      pricing: {
        pricePerNight: calculatedPricePerNight,
        totalPrice: totalPrice
      },
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Add a note that ID photo wasn't uploaded
    if (formData.idPhoto) {
      console.warn('⚠️ ID photo provided but not uploaded. Firebase Storage not configured.');
      console.warn('📝 File name:', formData.idPhoto.name);
      console.warn('📏 File size:', (formData.idPhoto.size / 1024 / 1024).toFixed(2), 'MB');
    }
    
    return this.saveBookingToFirestore(booking).pipe(
      tap(savedBooking => {
        console.log('✅ Booking saved to Firestore (without ID photo)');
        this.sendAdminNotification(savedBooking);
        this.isLoading.set(false);
      }),
      catchError(error => {
        console.error('❌ Error saving booking:', error);
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Get all bookings (for admin)
   */
  getAllBookings(): Observable<SimplifiedBooking[]> {
    this.isLoading.set(true);
    
    const q = query(
      this.bookingsCollection,
      orderBy('createdAt', 'desc')
    );
    
    return from(getDocs(q)).pipe(
      map(snapshot => {
        const bookings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as SimplifiedBooking));
        
        this.updateBookingStats(bookings);
        this.isLoading.set(false);
        return bookings;
      }),
      catchError(error => {
        this.isLoading.set(false);
        console.error('Error fetching bookings:', error);
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Get pending bookings
   */
  getPendingBookings(): Observable<SimplifiedBooking[]> {
    const q = query(
      this.bookingsCollection,
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SimplifiedBooking)))
    );
  }
  
  /**
   * Approve a booking
   */
  approveBooking(bookingId: string, adminNotes?: string): Observable<void> {
    this.isLoading.set(true);
    
    const bookingRef = doc(this.firestore, 'simplified-bookings', bookingId);
    
    return from(getDoc(bookingRef)).pipe(
      switchMap(docSnap => {
        if (!docSnap.exists()) {
          throw new Error('Booking not found');
        }
        
        const booking = { id: docSnap.id, ...docSnap.data() } as SimplifiedBooking;
        
        const updates = {
          status: 'approved',
          approvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...(adminNotes && { adminNotes })
        };
        
        return from(updateDoc(bookingRef, updates)).pipe(
          tap(() => {
            this.emailService.sendBookingApprovedNotification(
              booking.guestInfo.email,
              booking.guestInfo.name,
              booking.bookingDetails.bookingOption,
              booking.bookingDetails.checkInDate,
              booking.bookingDetails.checkOutDate,
              booking.bookingDetails.numberOfNights,
              booking.bookingDetails.numberOfGuests,
              adminNotes
            ).subscribe();
            
            this.isLoading.set(false);
          })
        );
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Reject a booking
   */
  rejectBooking(bookingId: string, adminNotes?: string): Observable<void> {
    this.isLoading.set(true);
    
    const bookingRef = doc(this.firestore, 'simplified-bookings', bookingId);
    
    return from(getDoc(bookingRef)).pipe(
      switchMap(docSnap => {
        if (!docSnap.exists()) {
          throw new Error('Booking not found');
        }
        
        const booking = { id: docSnap.id, ...docSnap.data() } as SimplifiedBooking;
        
        const updates = {
          status: 'rejected',
          rejectedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...(adminNotes && { adminNotes })
        };
        
        return from(updateDoc(bookingRef, updates)).pipe(
          tap(() => {
            this.emailService.sendBookingRejectedNotification(
              booking.guestInfo.email,
              booking.guestInfo.name,
              booking.bookingDetails.bookingOption,
              booking.bookingDetails.checkInDate,
              booking.bookingDetails.checkOutDate,
              booking.bookingDetails.numberOfGuests,
              adminNotes
            ).subscribe();
            
            this.isLoading.set(false);
          })
        );
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Toggle apartment availability
   */
  toggleApartmentAvailability(
    isAvailable: boolean,
    message?: string,
    updatedBy?: string
  ): Observable<void> {
    const availabilityRef = doc(this.firestore, 'apartment-availability', 'main-apartment');
    
    const data: Partial<ApartmentAvailability> = {
      isAvailable,
      unavailableMessage: message,
      lastUpdated: new Date().toISOString(),
      updatedBy
    };
    
    return from(updateDoc(availabilityRef, data as any)).pipe(
      map(() => undefined),
      tap(() => {
        this.isApartmentAvailable.set(isAvailable);
      }),
      catchError(error => {
        const fullData: ApartmentAvailability = {
          id: 'main-apartment',
          isAvailable,
          unavailableMessage: message,
          lastUpdated: new Date().toISOString(),
          updatedBy
        };
        return from(addDoc(this.availabilityCollection, fullData as any)).pipe(
          map(() => undefined),
          tap(() => this.isApartmentAvailable.set(isAvailable))
        );
      })
    );
  }
  
  /**
   * Load apartment availability status
   */
  loadApartmentAvailability(): Observable<boolean> {
    const availabilityRef = doc(this.firestore, 'apartment-availability', 'main-apartment');
    
    return from(getDoc(availabilityRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data() as ApartmentAvailability;
          this.isApartmentAvailable.set(data.isAvailable);
          return data.isAvailable;
        } else {
          this.isApartmentAvailable.set(true);
          return true;
        }
      }),
      catchError(error => {
        console.error('Error loading availability:', error);
        this.isApartmentAvailable.set(true);
        return of(true);
      })
    );
  }
  
  /**
   * Save booking to Firestore
   */
  private saveBookingToFirestore(booking: SimplifiedBooking): Observable<SimplifiedBooking> {
    return from(addDoc(this.bookingsCollection, booking)).pipe(
      map(docRef => ({
        ...booking,
        id: docRef.id
      }))
    );
  }
  
  /**
   * Send notification to admin
   */
  private sendAdminNotification(booking: SimplifiedBooking): void {
    this.emailService.sendBookingReceivedNotification(
      this.ADMIN_EMAIL,
      booking.guestInfo.name,
      booking.bookingDetails.bookingOption,
      booking.bookingDetails.checkInDate,
      booking.bookingDetails.checkOutDate,
      booking.bookingDetails.numberOfNights,
      booking.bookingDetails.numberOfGuests,
      booking.guestInfo.address
    ).subscribe();
  }
  
  /**
   * Update booking statistics
   */
  private updateBookingStats(bookings: SimplifiedBooking[]): void {
    const stats: SimplifiedBookingStats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      approved: bookings.filter(b => b.status === 'approved').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
      isApartmentAvailable: this.isApartmentAvailable()
    };
    
    this.bookingStats.set(stats);
  }
}
