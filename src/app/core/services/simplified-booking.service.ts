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
  DocumentData,
  writeBatch
} from '@angular/fire/firestore';
import { 
  Storage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from '@angular/fire/storage';
import { Observable, from, throwError, of, forkJoin } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { 
  SimplifiedBooking, 
  ApartmentAvailability, 
  SimplifiedBookingStats,
  BookingFormData
} from '../interfaces/simplified-booking.interface';
import { Apartment, DateRange } from '../interfaces/apartment.interface';
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
  createBooking(formData: BookingFormData, apartmentId: string, pricePerNight?: number): Observable<SimplifiedBooking> {
    this.isLoading.set(true);
    
    // First check if apartment is available for the selected dates
    return this.checkApartmentAvailabilityForDates(apartmentId, formData.checkInDate, formData.checkOutDate).pipe(
      switchMap(isAvailable => {
        if (!isAvailable) {
          this.isLoading.set(false);
          return throwError(() => new Error('Apartment is not available for the selected dates'));
        }
        
        // Calculate pricing if provided
        const calculatedPricePerNight = pricePerNight || (formData.bookingOption === 'one-room' ? 25000 : 45000);
        const totalPrice = calculatedPricePerNight * formData.numberOfNights;
        
        const booking: SimplifiedBooking = {
          apartmentId: apartmentId,
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
   * Approve a booking and block the dates in the apartment
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
        
        // Check if dates are still available
        return this.checkApartmentAvailabilityForDates(
          booking.apartmentId, 
          booking.bookingDetails.checkInDate, 
          booking.bookingDetails.checkOutDate
        ).pipe(
          switchMap(isAvailable => {
            if (!isAvailable) {
              this.isLoading.set(false);
              return throwError(() => new Error('Apartment is no longer available for these dates'));
            }
            
            const updates = {
              status: 'approved',
              approvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...(adminNotes && { adminNotes })
            };
            
            // Update booking status and block apartment dates
            return forkJoin({
              bookingUpdate: from(updateDoc(bookingRef, updates)),
              availabilityUpdate: this.blockApartmentDates(
                booking.apartmentId,
                booking.bookingDetails.checkInDate,
                booking.bookingDetails.checkOutDate
              )
            }).pipe(
              tap(() => {
                // Send approval email to guest
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
              }),
              map(() => undefined)
            );
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
   * Reject a booking and free up the dates
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
   * Check if apartment is available for specific dates
   * Checks against approved bookings for the same apartment
   */
  checkApartmentAvailabilityForDates(
    apartmentId: string, 
    checkInDate: string, 
    checkOutDate: string
  ): Observable<boolean> {
    const apartmentRef = doc(this.firestore, 'apartments', apartmentId);
    
    return from(getDoc(apartmentRef)).pipe(
      map(docSnap => {
        if (!docSnap.exists()) {
          return false;
        }
        
        const apartment = docSnap.data() as Apartment;
        
        // Check if apartment is generally available
        if (!apartment.availability.isAvailable) {
          return false;
        }
        
        // Parse the check-in and check-out dates
        const requestedCheckIn = new Date(checkInDate);
        const requestedCheckOut = new Date(checkOutDate);
        
        // Check against booked dates
        if (apartment.availability.bookedDates && apartment.availability.bookedDates.length > 0) {
          for (const bookedRange of apartment.availability.bookedDates) {
            const bookedStart = new Date(bookedRange.start);
            const bookedEnd = new Date(bookedRange.end);
            
            // Check for date overlap
            if (this.datesOverlap(requestedCheckIn, requestedCheckOut, bookedStart, bookedEnd)) {
              return false;
            }
          }
        }
        
        // Check against blackout dates (admin-blocked dates)
        if (apartment.availability.blackoutDates && apartment.availability.blackoutDates.length > 0) {
          for (const blackoutRange of apartment.availability.blackoutDates) {
            const blackoutStart = new Date(blackoutRange.start);
            const blackoutEnd = new Date(blackoutRange.end);
            
            // Check for date overlap
            if (this.datesOverlap(requestedCheckIn, requestedCheckOut, blackoutStart, blackoutEnd)) {
              return false;
            }
          }
        }
        
        return true;
      }),
      catchError(error => {
        console.error('Error checking apartment availability:', error);
        return of(false);
      })
    );
  }
  
  /**
   * Block apartment dates when booking is approved
   */
  blockApartmentDates(
    apartmentId: string, 
    checkInDate: string, 
    checkOutDate: string
  ): Observable<void> {
    const apartmentRef = doc(this.firestore, 'apartments', apartmentId);
    
    return from(getDoc(apartmentRef)).pipe(
      switchMap(docSnap => {
        if (!docSnap.exists()) {
          throw new Error('Apartment not found');
        }
        
        const apartment = docSnap.data() as Apartment;
        
        // Add the new booking to bookedDates array
        const newBookedDate: DateRange = {
          start: new Date(checkInDate),
          end: new Date(checkOutDate)
        };
        
        const existingBookedDates = apartment.availability.bookedDates || [];
        const updatedBookedDates = [...existingBookedDates, newBookedDate];
        
        // Update apartment with new booked dates
        const updates = {
          'availability.bookedDates': updatedBookedDates,
          'availability.status': this.determineApartmentStatus(updatedBookedDates),
          updatedAt: Timestamp.now()
        };
        
        return from(updateDoc(apartmentRef, updates));
      }),
      map(() => undefined)
    );
  }
  
  /**
   * Manually manage apartment availability (for offline bookings)
   */
  manuallyBlockDates(
    apartmentId: string,
    startDate: string,
    endDate: string,
    reason?: string
  ): Observable<void> {
    const apartmentRef = doc(this.firestore, 'apartments', apartmentId);
    
    return from(getDoc(apartmentRef)).pipe(
      switchMap(docSnap => {
        if (!docSnap.exists()) {
          throw new Error('Apartment not found');
        }
        
        const apartment = docSnap.data() as Apartment;
        
        // Add to blackout dates (admin-managed blocks)
        const newBlackoutDate: DateRange = {
          start: new Date(startDate),
          end: new Date(endDate)
        };
        
        const existingBlackoutDates = apartment.availability.blackoutDates || [];
        const updatedBlackoutDates = [...existingBlackoutDates, newBlackoutDate];
        
        const updates = {
          'availability.blackoutDates': updatedBlackoutDates,
          'availability.status': this.determineApartmentStatus(
            apartment.availability.bookedDates || [],
            updatedBlackoutDates
          ),
          updatedAt: Timestamp.now()
        };
        
        return from(updateDoc(apartmentRef, updates));
      }),
      map(() => undefined)
    );
  }
  
  /**
   * Remove blocked dates (unblock)
   */
  unblockDates(
    apartmentId: string,
    startDate: string,
    endDate: string
  ): Observable<void> {
    const apartmentRef = doc(this.firestore, 'apartments', apartmentId);
    
    return from(getDoc(apartmentRef)).pipe(
      switchMap(docSnap => {
        if (!docSnap.exists()) {
          throw new Error('Apartment not found');
        }
        
        const apartment = docSnap.data() as Apartment;
        
        // Remove from blackout dates
        const updatedBlackoutDates = (apartment.availability.blackoutDates || []).filter(range => {
          const rangeStart = new Date(range.start).getTime();
          const rangeEnd = new Date(range.end).getTime();
          const targetStart = new Date(startDate).getTime();
          const targetEnd = new Date(endDate).getTime();
          
          // Keep dates that don't match the target range
          return !(rangeStart === targetStart && rangeEnd === targetEnd);
        });
        
        const updates = {
          'availability.blackoutDates': updatedBlackoutDates,
          'availability.status': this.determineApartmentStatus(
            apartment.availability.bookedDates || [],
            updatedBlackoutDates
          ),
          updatedAt: Timestamp.now()
        };
        
        return from(updateDoc(apartmentRef, updates));
      }),
      map(() => undefined)
    );
  }
  
  /**
   * Get all booked and blocked dates for an apartment
   */
  getApartmentBookedDates(apartmentId: string): Observable<{
    bookedDates: DateRange[];
    blackoutDates: DateRange[];
  }> {
    const apartmentRef = doc(this.firestore, 'apartments', apartmentId);
    
    return from(getDoc(apartmentRef)).pipe(
      map(docSnap => {
        if (!docSnap.exists()) {
          return { bookedDates: [], blackoutDates: [] };
        }
        
        const apartment = docSnap.data() as Apartment;
        return {
          bookedDates: apartment.availability.bookedDates || [],
          blackoutDates: apartment.availability.blackoutDates || []
        };
      })
    );
  }
  
  /**
   * Helper: Check if two date ranges overlap
   */
  private datesOverlap(
    start1: Date, 
    end1: Date, 
    start2: Date, 
    end2: Date
  ): boolean {
    // Two ranges overlap if one starts before the other ends
    return start1 < end2 && end1 > start2;
  }
  
  /**
   * Helper: Determine apartment status based on booked dates
   */
  private determineApartmentStatus(
    bookedDates: DateRange[] = [],
    blackoutDates: DateRange[] = []
  ): 'available' | 'booked' | 'maintenance' {
    const now = new Date();
    
    // Check if currently in a booked period
    for (const range of bookedDates) {
      const start = new Date(range.start);
      const end = new Date(range.end);
      if (now >= start && now <= end) {
        return 'booked';
      }
    }
    
    // Check if currently in a blackout period
    for (const range of blackoutDates) {
      const start = new Date(range.start);
      const end = new Date(range.end);
      if (now >= start && now <= end) {
        return 'maintenance';
      }
    }
    
    return 'available';
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
