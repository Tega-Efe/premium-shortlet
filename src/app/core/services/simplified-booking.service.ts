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
// FIREBASE STORAGE - Currently commented out
// Uncomment these imports when ready to enable ID photo upload functionality
// import { 
//   Storage, 
//   ref, 
//   uploadBytes, 
//   getDownloadURL, 
//   deleteObject 
// } from '@angular/fire/storage';
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
 * - Create bookings (with optional ID photo upload - currently disabled)
 * - Check apartment availability
 * - Approve/reject bookings with automatic date blocking
 * - Send email notifications via Django API
 * - Toggle apartment availability (admin)
 * - Track booked dates per apartment
 * 
 * FIREBASE STORAGE STATUS: DISABLED
 * To enable ID photo upload:
 * 1. Uncomment Storage imports at the top of this file
 * 2. Uncomment the 'private storage' injection in constructor
 * 3. Uncomment the uploadIdPhoto() method
 * 4. Uncomment the ID photo upload logic in createBooking()
 */
@Injectable({
  providedIn: 'root'
})
export class SimplifiedBookingService {
  private firestore = inject(Firestore);
  // FIREBASE STORAGE - Uncomment when ready
  // private storage = inject(Storage);
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
   * Create a new booking with optional ID photo upload
   * 
   * STORAGE STATUS: Currently disabled
   * ID photos are NOT uploaded until Firebase Storage is configured
   * The formData.idPhoto file is logged but not saved
   */
  createBooking(formData: BookingFormData, apartmentId: string, pricePerNight?: number): Observable<SimplifiedBooking> {
    this.isLoading.set(true);
    
    // First, fetch the apartment to get its title and verify it exists
    const apartmentRef = doc(this.firestore, 'apartments', apartmentId);
    
    return from(getDoc(apartmentRef)).pipe(
      switchMap(apartmentDoc => {
        if (!apartmentDoc.exists()) {
          this.isLoading.set(false);
          return throwError(() => new Error('Apartment not found'));
        }
        
        const apartment = apartmentDoc.data() as Apartment;
        const apartmentTitle = apartment.title;
        
        // Check if apartment is available for the selected dates
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
              apartmentTitle: apartmentTitle,
              guestInfo: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address
                // ID photo fields will be added when storage is enabled
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
            
            // ============================================================
            // FIREBASE STORAGE - ID PHOTO UPLOAD (CURRENTLY DISABLED)
            // ============================================================
            // When ready to enable storage, uncomment this block and comment out the else block
            
            /* ENABLE STORAGE - UNCOMMENT THIS BLOCK
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
            END ENABLE STORAGE */
            
            // ============================================================
            // NO STORAGE VERSION (CURRENTLY ACTIVE)
            // ============================================================
            // Log ID photo info if provided, but don't upload
            if (formData.idPhoto) {
              console.warn('⚠️ ID photo provided but not uploaded. Firebase Storage not configured.');
              console.warn('📝 File name:', formData.idPhoto.name);
              console.warn('📏 File size:', (formData.idPhoto.size / 1024 / 1024).toFixed(2), 'MB');
              console.warn('💡 To enable uploads, uncomment the Storage section in simplified-booking.service.ts');
            }
            
            // Save booking without ID photo
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
            // ============================================================
            // END NO STORAGE VERSION
            // ============================================================
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
   * Approve a booking and send confirmation email
   * Note: Dates are already blocked when the booking was created (not on approval)
   * This method only updates the status and triggers the confirmation email
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
        
        console.log('✅ Approving booking:', bookingId);
        console.log('📧 Sending confirmation email to:', booking.guestInfo.email);
        
        const updates = {
          status: 'approved',
          approvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...(adminNotes && { adminNotes })
        };
        
        // Update booking status and send confirmation email
        // Dates were already blocked when booking was created
        return from(updateDoc(bookingRef, updates)).pipe(
          switchMap(() => {
            // Send confirmation email to guest
            return this.emailService.sendBookingApprovedNotification(
              booking.guestInfo.email,
              booking.guestInfo.name,
              booking.bookingDetails.bookingOption,
              booking.bookingDetails.checkInDate,
              booking.bookingDetails.checkOutDate,
              booking.bookingDetails.numberOfNights,
              booking.bookingDetails.numberOfGuests,
              adminNotes
            ).pipe(
              tap(() => {
                console.log('✅ Booking approved and confirmation email sent');
                this.isLoading.set(false);
              }),
              catchError(emailError => {
                console.error('⚠️ Booking approved but email failed:', emailError);
                this.isLoading.set(false);
                // Don't fail the approval if email fails
                return of(null);
              })
            );
          }),
          map(() => undefined)
        );
      }),
      catchError(error => {
        console.error('❌ Failed to approve booking:', error);
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Reject a booking, unblock the dates, and send rejection email
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
        
        console.log('❌ Rejecting booking:', bookingId);
        console.log('🔓 Unblocking dates for apartment:', booking.apartmentId);
        console.log('📧 Sending rejection email to:', booking.guestInfo.email);
        
        const updates = {
          status: 'rejected',
          rejectedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...(adminNotes && { adminNotes })
        };
        
        // Update booking status, unblock dates, and send rejection email
        return from(updateDoc(bookingRef, updates)).pipe(
          switchMap(() => {
            // Unblock the dates since booking is rejected
            return this.unblockApartmentDates(
              booking.apartmentId,
              booking.bookingDetails.checkInDate,
              booking.bookingDetails.checkOutDate
            );
          }),
          switchMap(() => {
            // Send rejection email to guest
            return this.emailService.sendBookingRejectedNotification(
              booking.guestInfo.email,
              booking.guestInfo.name,
              booking.bookingDetails.bookingOption,
              booking.bookingDetails.checkInDate,
              booking.bookingDetails.checkOutDate,
              booking.bookingDetails.numberOfGuests,
              adminNotes
            ).pipe(
              tap(() => {
                console.log('✅ Booking rejected, dates unblocked, and rejection email sent');
                this.isLoading.set(false);
              }),
              catchError(emailError => {
                console.error('⚠️ Booking rejected and dates unblocked, but email failed:', emailError);
                this.isLoading.set(false);
                // Don't fail the rejection if email fails
                return of(null);
              })
            );
          }),
          map(() => undefined)
        );
      }),
      catchError(error => {
        console.error('❌ Failed to reject booking:', error);
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
          console.log('❌ Apartment not found:', apartmentId);
          return false;
        }
        
        const apartment = docSnap.data() as Apartment;
        
        // Check if apartment is generally available
        if (!apartment.availability.isAvailable) {
          console.log('❌ Apartment is not available (isAvailable=false)');
          return false;
        }
        
        // Parse the check-in and check-out dates (handle timezone properly)
        const requestedCheckIn = new Date(checkInDate);
        const requestedCheckOut = new Date(checkOutDate);
        
        // Validate dates
        if (isNaN(requestedCheckIn.getTime()) || isNaN(requestedCheckOut.getTime())) {
          console.error('❌ Invalid dates provided:', { checkInDate, checkOutDate });
          return false;
        }
        
        console.log('🔍 Checking availability:', {
          apartmentId,
          requestedCheckIn: requestedCheckIn.toISOString(),
          requestedCheckOut: requestedCheckOut.toISOString(),
          bookedDatesCount: apartment.availability.bookedDates?.length || 0,
          blackoutDatesCount: apartment.availability.blackoutDates?.length || 0
        });
        
        // Check against booked dates
        if (apartment.availability.bookedDates && apartment.availability.bookedDates.length > 0) {
          for (const bookedRange of apartment.availability.bookedDates) {
            // Handle both string and Date types
            const bookedStart = typeof bookedRange.start === 'string' 
              ? new Date(bookedRange.start) 
              : bookedRange.start;
            const bookedEnd = typeof bookedRange.end === 'string' 
              ? new Date(bookedRange.end) 
              : bookedRange.end;
            
            // Skip invalid date ranges
            if (isNaN(bookedStart.getTime()) || isNaN(bookedEnd.getTime())) {
              console.warn('  ⚠️ Skipping invalid booked date range:', bookedRange);
              continue;
            }
            
            console.log('  📅 Checking against booked range:', {
              bookedStart: bookedStart.toISOString().split('T')[0],
              bookedEnd: bookedEnd.toISOString().split('T')[0]
            });
            
            // Check for date overlap
            if (this.datesOverlap(requestedCheckIn, requestedCheckOut, bookedStart, bookedEnd)) {
              console.log('  ❌ OVERLAP DETECTED with booked dates!');
              return false;
            }
          }
        }
        
        // Check against blackout dates (admin-blocked dates)
        if (apartment.availability.blackoutDates && apartment.availability.blackoutDates.length > 0) {
          for (const blackoutRange of apartment.availability.blackoutDates) {
            // Handle both string and Date types
            const blackoutStart = typeof blackoutRange.start === 'string' 
              ? new Date(blackoutRange.start) 
              : blackoutRange.start;
            const blackoutEnd = typeof blackoutRange.end === 'string' 
              ? new Date(blackoutRange.end) 
              : blackoutRange.end;
            
            // Skip invalid date ranges
            if (isNaN(blackoutStart.getTime()) || isNaN(blackoutEnd.getTime())) {
              console.warn('  ⚠️ Skipping invalid blackout date range:', blackoutRange);
              continue;
            }
            
            console.log('  🚫 Checking against blackout range:', {
              blackoutStart: blackoutStart.toISOString().split('T')[0],
              blackoutEnd: blackoutEnd.toISOString().split('T')[0]
            });
            
            // Check for date overlap
            if (this.datesOverlap(requestedCheckIn, requestedCheckOut, blackoutStart, blackoutEnd)) {
              console.log('  ❌ OVERLAP DETECTED with blackout dates!');
              return false;
            }
          }
        }
        
        console.log('✅ Apartment is available for requested dates');
        return true;
      }),
      catchError(error => {
        console.error('❌ Error checking apartment availability:', error);
        return of(false);
      })
    );
  }
  
  /**
   * Block apartment dates when booking is created (immediately, not waiting for approval)
   */
  blockApartmentDates(
    apartmentId: string, 
    checkInDate: string, 
    checkOutDate: string
  ): Observable<void> {
    console.log('🔒 Blocking apartment dates:', { apartmentId, checkInDate, checkOutDate });
    
    const apartmentRef = doc(this.firestore, 'apartments', apartmentId);
    
    return from(getDoc(apartmentRef)).pipe(
      switchMap(docSnap => {
        if (!docSnap.exists()) {
          console.error('❌ Apartment not found for blocking');
          throw new Error('Apartment not found');
        }
        
        const apartment = docSnap.data() as Apartment;
        
        // Store dates as ISO strings to ensure consistency
        const newBookedDate: DateRange = {
          start: checkInDate,  // Store as string, not Date object
          end: checkOutDate
        };
        
        const existingBookedDates = apartment.availability.bookedDates || [];
        const updatedBookedDates = [...existingBookedDates, newBookedDate];
        
        console.log('📅 Updating booked dates:', {
          existingCount: existingBookedDates.length,
          newCount: updatedBookedDates.length,
          newBooking: {
            start: newBookedDate.start,
            end: newBookedDate.end
          }
        });
        
        // Update apartment with new booked dates
        const updates = {
          'availability.bookedDates': updatedBookedDates,
          'availability.status': this.determineApartmentStatus(updatedBookedDates),
          updatedAt: Timestamp.now()
        };
        
        return from(updateDoc(apartmentRef, updates)).pipe(
          tap(() => console.log('✅ Apartment dates blocked successfully'))
        );
      }),
      map(() => undefined),
      catchError(error => {
        console.error('❌ Error blocking apartment dates:', error);
        throw error;
      })
    );
  }
  
  /**
   * Unblock apartment dates when a booking is cancelled or rejected
   */
  private unblockApartmentDates(
    apartmentId: string,
    checkInDate: string,
    checkOutDate: string
  ): Observable<void> {
    console.log('🔓 Unblocking apartment dates:', { apartmentId, checkInDate, checkOutDate });
    
    const apartmentRef = doc(this.firestore, 'apartments', apartmentId);
    
    return from(getDoc(apartmentRef)).pipe(
      switchMap(docSnap => {
        if (!docSnap.exists()) {
          console.error('❌ Apartment not found for unblocking');
          throw new Error('Apartment not found');
        }
        
        const apartment = docSnap.data() as Apartment;
        const existingBookedDates = apartment.availability.bookedDates || [];
        
        // Remove the matching date range
        const updatedBookedDates = existingBookedDates.filter(bookedDate => {
          const bookedStart = typeof bookedDate.start === 'string' ? bookedDate.start : bookedDate.start.toISOString?.() || '';
          const bookedEnd = typeof bookedDate.end === 'string' ? bookedDate.end : bookedDate.end.toISOString?.() || '';
          
          // Check if this is the date range to remove
          const isMatchingRange = bookedStart === checkInDate && bookedEnd === checkOutDate;
          
          if (isMatchingRange) {
            console.log('🗑️ Removing booked date range:', { start: bookedStart, end: bookedEnd });
          }
          
          return !isMatchingRange;
        });
        
        console.log('📅 Updating after unblocking:', {
          previousCount: existingBookedDates.length,
          newCount: updatedBookedDates.length,
          removed: existingBookedDates.length - updatedBookedDates.length
        });
        
        // Update apartment with filtered booked dates
        const updates = {
          'availability.bookedDates': updatedBookedDates,
          'availability.status': this.determineApartmentStatus(updatedBookedDates),
          updatedAt: Timestamp.now()
        };
        
        return from(updateDoc(apartmentRef, updates)).pipe(
          tap(() => console.log('✅ Apartment dates unblocked successfully'))
        );
      }),
      map(() => undefined),
      catchError(error => {
        console.error('❌ Error unblocking apartment dates:', error);
        throw error;
      })
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
   * Booking dates are inclusive of check-in and exclusive of checkout
   * e.g., Dec 5-8 booking means Dec 5, 6, 7 (checkout morning of Dec 8)
   * So Dec 4-7 would overlap because both include Dec 6 and Dec 7
   */
  private datesOverlap(
    start1: Date, 
    end1: Date, 
    start2: Date, 
    end2: Date
  ): boolean {
    // Normalize dates to midnight to avoid time component issues
    const normalizeDate = (date: Date): number => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized.getTime();
    };
    
    const s1 = normalizeDate(start1);
    const e1 = normalizeDate(end1);
    const s2 = normalizeDate(start2);
    const e2 = normalizeDate(end2);
    
    // Two ranges overlap if one starts before the other ends
    // For hotel bookings: check-in is inclusive, checkout is exclusive
    // So we use < for end comparison (not <=)
    const overlaps = s1 < e2 && e1 > s2;
    
    console.log('    🔍 Overlap check:', {
      range1: { start: new Date(s1).toISOString().split('T')[0], end: new Date(e1).toISOString().split('T')[0] },
      range2: { start: new Date(s2).toISOString().split('T')[0], end: new Date(e2).toISOString().split('T')[0] },
      overlaps,
      logic: `${s1} < ${e2} && ${e1} > ${s2} = ${s1 < e2} && ${e1 > s2}`
    });
    
    return overlaps;
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
   * 
   * CURRENTLY DISABLED - Uncomment when Firebase Storage is configured
   * 
   * To enable:
   * 1. Uncomment Storage imports at the top of this file
   * 2. Uncomment 'private storage = inject(Storage);' in constructor
   * 3. Uncomment this method
   * 4. Uncomment the storage upload logic in createBooking()
   */
  /*
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
  */
  
  /**
   * Save booking to Firestore and IMMEDIATELY block the dates
   */
  private saveBookingToFirestore(booking: SimplifiedBooking): Observable<SimplifiedBooking> {
    return from(addDoc(this.bookingsCollection, booking)).pipe(
      switchMap(docRef => {
        const savedBooking = {
          ...booking,
          id: docRef.id
        };
        
        // IMMEDIATELY block dates when booking is created (don't wait for approval)
        console.log('🔒 Immediately blocking dates for new booking:', {
          apartmentId: booking.apartmentId,
          checkIn: booking.bookingDetails.checkInDate,
          checkOut: booking.bookingDetails.checkOutDate
        });
        
        return this.blockApartmentDates(
          booking.apartmentId,
          booking.bookingDetails.checkInDate,
          booking.bookingDetails.checkOutDate
        ).pipe(
          map(() => savedBooking),
          catchError(error => {
            console.error('❌ Failed to block dates, but booking was saved:', error);
            // Return the booking even if date blocking fails
            // Admin will need to manually manage availability
            return of(savedBooking);
          })
        );
      })
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
