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
  Timestamp,
  CollectionReference,
  DocumentData
} from '@angular/fire/firestore';
import { 
  Storage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from '@angular/fire/storage';
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
 * Simplified Booking Service
 * Handles single apartment booking operations with Firestore
 * 
 * Features:
 * - Create bookings with ID photo upload
 * - Check apartment availability
 * - Approve/reject bookings
 * - Send email notifications via Django API
 * - Toggle apartment availability (admin)
 */
@Injectable({
  providedIn: 'root'
})
export class SimplifiedBookingService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private emailService = inject(EmailNotificationService);
  
  // Firestore collections
  private bookingsCollection: CollectionReference<DocumentData>;
  private availabilityCollection: CollectionReference<DocumentData>;
  
  // Signals for reactive state
  public isLoading = signal<boolean>(false);
  public isApartmentAvailable = signal<boolean>(true);
  public bookingStats = signal<SimplifiedBookingStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    isApartmentAvailable: true
  });
  
  // Admin email for notifications (TODO: Move to environment config)
  private readonly ADMIN_EMAIL = 'admin@shortletconnect.com';
  
  constructor() {
    this.bookingsCollection = collection(this.firestore, 'simplified-bookings');
    this.availabilityCollection = collection(this.firestore, 'apartment-availability');
    
    // Load availability on service init
    this.loadApartmentAvailability().subscribe();
  }
  
  /**
   * Create a new booking with ID photo upload
   */
  createBooking(formData: BookingFormData): Observable<SimplifiedBooking> {
    this.isLoading.set(true);
    
    const booking: SimplifiedBooking = {
      guestInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      },
      bookingDetails: {
        bookingOption: formData.bookingOption,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfNights: formData.numberOfNights
      },
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Upload ID photo first if provided
    if (formData.idPhoto) {
      return this.uploadIdPhoto(formData.idPhoto, formData.email).pipe(
        switchMap(({ url, path }) => {
          booking.guestInfo.idPhotoUrl = url;
          booking.guestInfo.idPhotoPath = path;
          return this.saveBookingToFirestore(booking);
        }),
        tap(savedBooking => {
          this.sendAdminNotification(savedBooking);
          this.isLoading.set(false);
        }),
        catchError(error => {
          this.isLoading.set(false);
          return throwError(() => error);
        })
      );
    } else {
      // No ID photo, save directly
      return this.saveBookingToFirestore(booking).pipe(
        tap(savedBooking => {
          this.sendAdminNotification(savedBooking);
          this.isLoading.set(false);
        }),
        catchError(error => {
          this.isLoading.set(false);
          return throwError(() => error);
        })
      );
    }
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
   * Get pending bookings (for admin approval view)
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
            // Send approval email to guest
            this.emailService.sendBookingApprovedNotification(
              booking.guestInfo.email,
              booking.guestInfo.name,
              booking.bookingDetails.bookingOption,
              booking.bookingDetails.checkInDate,
              booking.bookingDetails.checkOutDate,
              booking.bookingDetails.numberOfNights,
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
            // Send rejection email to guest
            this.emailService.sendBookingRejectedNotification(
              booking.guestInfo.email,
              booking.guestInfo.name,
              booking.bookingDetails.bookingOption,
              booking.bookingDetails.checkInDate,
              booking.bookingDetails.checkOutDate,
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
        console.error('Error updating availability:', error);
        // If document doesn't exist, create it
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
          // Default to available if no document exists
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
   * Upload ID photo to Firebase Storage
   */
  private uploadIdPhoto(file: File, userEmail: string): Observable<{ url: string; path: string }> {
    const timestamp = Date.now();
    const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = `booking-ids/${sanitizedEmail}_${timestamp}.jpg`;
    const storageRef = ref(this.storage, filePath);
    
    return from(uploadBytes(storageRef, file)).pipe(
      switchMap(() => from(getDownloadURL(storageRef))),
      map(url => ({ url, path: filePath }))
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
   * Send notification to admin when new booking is received
   */
  private sendAdminNotification(booking: SimplifiedBooking): void {
    this.emailService.sendBookingReceivedNotification(
      this.ADMIN_EMAIL,
      booking.guestInfo.name,
      booking.bookingDetails.bookingOption,
      booking.bookingDetails.checkInDate,
      booking.bookingDetails.checkOutDate,
      booking.bookingDetails.numberOfNights,
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
