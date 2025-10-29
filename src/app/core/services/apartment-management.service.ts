import { Injectable, inject, signal } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  getDoc, 
  query, 
  where,
  Timestamp,
  writeBatch
} from '@angular/fire/firestore';
import { Observable, from, map, catchError, of, switchMap, tap } from 'rxjs';
import { Apartment, DateRange } from '../interfaces';

/**
 * Apartment Management Service
 * Handles CRUD operations for apartment listings in Firestore
 */

// Type alias for consistency - ApartmentListing is now the same as Apartment
export type ApartmentListing = Apartment;

@Injectable({
  providedIn: 'root'
})
export class ApartmentManagementService {
  private firestore = inject(Firestore);
  private apartmentsCollection = collection(this.firestore, 'apartments');
  
  // Signals for reactive state
  apartments = signal<Apartment[]>([]);
  isLoading = signal<boolean>(false);

  /**
   * Get all apartments from Firestore
   */
  getAllApartments(): Observable<Apartment[]> {
    this.isLoading.set(true);
    return from(getDocs(this.apartmentsCollection)).pipe(
      map(snapshot => {
        const apartments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Apartment));
        this.apartments.set(apartments);
        this.isLoading.set(false);
        return apartments;
      }),
      catchError(error => {
        console.error('Error fetching apartments:', error);
        this.isLoading.set(false);
        return of([]);
      })
    );
  }

  /**
   * Get available apartments only
   */
  getAvailableApartments(): Observable<Apartment[]> {
    const availableQuery = query(
      this.apartmentsCollection,
      where('availability.isAvailable', '==', true)
    );
    
    return from(getDocs(availableQuery)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Apartment));
      }),
      catchError(error => {
        console.error('Error fetching available apartments:', error);
        return of([]);
      })
    );
  }

  /**
   * Get a single apartment by ID
   */
  getApartmentById(id: string): Observable<Apartment | null> {
    return this.getAllApartments().pipe(
      map(apartments => apartments.find(apt => apt.id === id) || null)
    );
  }

  /**
   * Create a new apartment listing
   */
  createApartment(apartmentData: Omit<Apartment, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const newApartment = {
      ...apartmentData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    return from(addDoc(this.apartmentsCollection, newApartment)).pipe(
      map(docRef => {
        // Refresh the apartments list
        this.getAllApartments().subscribe();
        return docRef.id;
      }),
      catchError(error => {
        console.error('Error creating apartment:', error);
        throw error;
      })
    );
  }

  /**
   * Update an existing apartment
   */
  updateApartment(apartmentId: string, updates: Partial<Apartment>): Observable<void> {
    const apartmentDoc = doc(this.firestore, 'apartments', apartmentId);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };

    return from(updateDoc(apartmentDoc, updateData)).pipe(
      map(() => {
        // Refresh the apartments list
        this.getAllApartments().subscribe();
      }),
      catchError(error => {
        console.error('Error updating apartment:', error);
        throw error;
      })
    );
  }

  /**
   * Delete an apartment listing
   */
  deleteApartment(apartmentId: string): Observable<void> {
    const apartmentDoc = doc(this.firestore, 'apartments', apartmentId);

    return from(deleteDoc(apartmentDoc)).pipe(
      map(() => {
        // Refresh the apartments list
        this.getAllApartments().subscribe();
      }),
      catchError(error => {
        console.error('Error deleting apartment:', error);
        throw error;
      })
    );
  }

  /**
   * Toggle apartment availability
   */
  toggleAvailability(apartmentId: string, isAvailable: boolean): Observable<void> {
    const apartmentDoc = doc(this.firestore, 'apartments', apartmentId);
    
    // Use field path updates to preserve bookedDates and blackoutDates
    const updates = {
      'availability.isAvailable': isAvailable,
      'availability.status': isAvailable ? 'available' : 'maintenance',
      'availability.hiddenUntil': null,
      'availability.hideReason': null,
      updatedAt: Timestamp.now()
    };

    return from(updateDoc(apartmentDoc, updates)).pipe(
      tap(() => {
        console.log('✅ Apartment availability toggled:', { apartmentId, isAvailable });
        // Refresh the apartments list
        this.getAllApartments().subscribe();
      }),
      map(() => undefined),
      catchError(error => {
        console.error('❌ Error toggling apartment availability:', error);
        throw error;
      })
    );
  }

  /**
   * Hide apartment for a specific duration
   */
  hideApartmentForDuration(apartmentId: string, hiddenUntil: Date, reason?: string): Observable<void> {
    const apartmentDoc = doc(this.firestore, 'apartments', apartmentId);
    
    // Use field path updates to preserve bookedDates and blackoutDates
    const updates: any = {
      'availability.isAvailable': false,
      'availability.status': 'maintenance',
      'availability.hiddenUntil': Timestamp.fromDate(hiddenUntil),
      updatedAt: Timestamp.now()
    };
    
    if (reason) {
      updates['availability.hideReason'] = reason;
    }

    return from(updateDoc(apartmentDoc, updates)).pipe(
      tap(() => {
        console.log('✅ Apartment hidden for duration:', { apartmentId, hiddenUntil, reason });
        // Refresh the apartments list
        this.getAllApartments().subscribe();
      }),
      map(() => undefined),
      catchError(error => {
        console.error('❌ Error hiding apartment for duration:', error);
        throw error;
      })
    );
  }

  /**
   * Bulk update apartments (useful for migrations)
   */
  bulkUpdateApartments(updates: { id: string; data: Partial<Apartment> }[]): Observable<void> {
    const batch = writeBatch(this.firestore);

    updates.forEach(({ id, data }) => {
      const apartmentDoc = doc(this.firestore, 'apartments', id);
      batch.update(apartmentDoc, {
        ...data,
        updatedAt: Timestamp.now()
      });
    });

    return from(batch.commit()).pipe(
      map(() => {
        this.getAllApartments().subscribe();
      }),
      catchError(error => {
        console.error('Error in bulk update:', error);
        throw error;
      })
    );
  }

  /**
   * Add blocked dates to apartment (for offline bookings or maintenance)
   */
  addBlockedDates(
    apartmentId: string,
    startDate: Date,
    endDate: Date,
    type: 'booking' | 'maintenance' = 'maintenance'
  ): Observable<void> {
    const apartmentDoc = doc(this.firestore, 'apartments', apartmentId);
    
    return from(getDoc(apartmentDoc)).pipe(
      switchMap(docSnap => {
        if (!docSnap.exists()) {
          throw new Error('Apartment not found');
        }
        
        const apartment = docSnap.data() as Apartment;
        const newDateRange: DateRange = { start: startDate, end: endDate };
        
        if (type === 'booking') {
          const bookedDates = apartment.availability.bookedDates || [];
          bookedDates.push(newDateRange);
          
          return this.updateApartment(apartmentId, {
            availability: {
              ...apartment.availability,
              bookedDates
            }
          });
        } else {
          const blackoutDates = apartment.availability.blackoutDates || [];
          blackoutDates.push(newDateRange);
          
          return this.updateApartment(apartmentId, {
            availability: {
              ...apartment.availability,
              blackoutDates
            }
          });
        }
      }),
      catchError(error => {
        console.error('Error adding blocked dates:', error);
        throw error;
      })
    );
  }

  /**
   * Remove blocked dates from apartment
   */
  removeBlockedDates(
    apartmentId: string,
    startDate: Date,
    endDate: Date,
    type: 'booking' | 'maintenance' = 'maintenance'
  ): Observable<void> {
    const apartmentDoc = doc(this.firestore, 'apartments', apartmentId);
    
    return from(getDoc(apartmentDoc)).pipe(
      switchMap(docSnap => {
        if (!docSnap.exists()) {
          throw new Error('Apartment not found');
        }
        
        const apartment = docSnap.data() as Apartment;
        const targetStart = startDate.getTime();
        const targetEnd = endDate.getTime();
        
        if (type === 'booking') {
          const bookedDates = (apartment.availability.bookedDates || []).filter(range => {
            const rangeStart = new Date(range.start).getTime();
            const rangeEnd = new Date(range.end).getTime();
            return !(rangeStart === targetStart && rangeEnd === targetEnd);
          });
          
          return this.updateApartment(apartmentId, {
            availability: {
              ...apartment.availability,
              bookedDates
            }
          });
        } else {
          const blackoutDates = (apartment.availability.blackoutDates || []).filter(range => {
            const rangeStart = new Date(range.start).getTime();
            const rangeEnd = new Date(range.end).getTime();
            return !(rangeStart === targetStart && rangeEnd === targetEnd);
          });
          
          return this.updateApartment(apartmentId, {
            availability: {
              ...apartment.availability,
              blackoutDates
            }
          });
        }
      }),
      catchError(error => {
        console.error('Error removing blocked dates:', error);
        throw error;
      })
    );
  }

  /**
   * Get all blocked dates for an apartment
   */
  getBlockedDates(apartmentId: string): Observable<{
    bookedDates: DateRange[];
    blackoutDates: DateRange[];
  }> {
    return this.getApartmentById(apartmentId).pipe(
      map(apartment => {
        if (!apartment) {
          return { bookedDates: [], blackoutDates: [] };
        }
        
        return {
          bookedDates: apartment.availability.bookedDates || [],
          blackoutDates: apartment.availability.blackoutDates || []
        };
      })
    );
  }

  /**
   * Check if apartment is available for specific dates
   */
  checkAvailability(
    apartmentId: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Observable<boolean> {
    return this.getApartmentById(apartmentId).pipe(
      map(apartment => {
        if (!apartment || !apartment.availability.isAvailable) {
          return false;
        }
        
        // Check against booked dates
        if (apartment.availability.bookedDates) {
          for (const range of apartment.availability.bookedDates) {
            if (this.datesOverlap(checkInDate, checkOutDate, new Date(range.start), new Date(range.end))) {
              return false;
            }
          }
        }
        
        // Check against blackout dates
        if (apartment.availability.blackoutDates) {
          for (const range of apartment.availability.blackoutDates) {
            if (this.datesOverlap(checkInDate, checkOutDate, new Date(range.start), new Date(range.end))) {
              return false;
            }
          }
        }
        
        return true;
      })
    );
  }

  /**
   * Helper: Check if two date ranges overlap
   */
  private datesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    return start1 < end2 && end1 > start2;
  }
}
