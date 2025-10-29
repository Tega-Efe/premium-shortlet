import { Injectable, inject, signal } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { Apartment, DateRange } from '../interfaces';
import { DateUtils } from '../utils';
import { Firestore, collection, collectionData, doc, docData, query, where, orderBy, limit as firestoreLimit } from '@angular/fire/firestore';

/**
 * Apartment Browsing Service
 * 
 * PUBLIC-FACING SERVICE for apartment browsing, filtering, and searching.
 * This service provides READ-ONLY operations for public users.
 * 
 * Use Cases:
 * - Browsing apartments on home page
 * - Filtering by location, price, amenities
 * - Searching apartments
 * - Sorting apartment listings
 * - Viewing featured apartments
 * 
 * For ADMIN operations (CRUD, availability management), use ApartmentManagementService instead.
 * 
 * @see ApartmentManagementService for admin operations
 */
@Injectable({
  providedIn: 'root'
})
export class ApartmentBrowsingService {
  private firestore = inject(Firestore);

  // State management
  private apartmentsSubject = new BehaviorSubject<Apartment[]>([]);
  public apartments$ = this.apartmentsSubject.asObservable();

  private selectedApartmentSubject = new BehaviorSubject<Apartment | null>(null);
  public selectedApartment$ = this.selectedApartmentSubject.asObservable();

  // Signals for reactive state
  public totalApartments = signal<number>(0);
  public isLoading = signal<boolean>(false);

  /**
   * Get all apartments with optional filters
   * PUBLIC METHOD - For browsing and filtering
   */
  getApartments(filters?: ApartmentFilter): Observable<Apartment[]> {
    this.isLoading.set(true);
    
    try {
      const apartmentsRef = collection(this.firestore, 'apartments');
      
      // Build query - Note: Firestore has limitations on complex queries
      // For complex filtering, we'll fetch all and filter client-side
      let q = query(apartmentsRef);

      return collectionData(q, { idField: 'id' }).pipe(
        map(apartments => {
          let filtered = apartments as Apartment[];
          
          // Client-side filtering for complex queries
          if (filters) {
            filtered = this.filterApartments(filtered, filters);
          }
          
          return filtered;
        }),
        tap(apartments => {
          this.apartmentsSubject.next(apartments);
          this.totalApartments.set(apartments.length);
          this.isLoading.set(false);
        }),
        catchError(error => {
          console.error('❌ Error fetching apartments from Firestore:', error);
          this.isLoading.set(false);
          // Return empty array instead of throwing to prevent app crash
          return throwError(() => error);
        }),
        shareReplay(1)
      );
    } catch (error) {
      console.error('❌ Error setting up Firestore query:', error);
      this.isLoading.set(false);
      return throwError(() => error);
    }
  }

  /**
   * Get apartment by ID
   * FIRESTORE VERSION
   */
  getApartmentById(id: string): Observable<Apartment> {
    this.isLoading.set(true);

    try {
      const apartmentRef = doc(this.firestore, 'apartments', id);
      
      return docData(apartmentRef, { idField: 'id' }).pipe(
        map(apartment => {
          if (!apartment) {
            throw new Error(`Apartment with ID ${id} not found`);
          }
          return apartment as Apartment;
        }),
        tap(apartment => {
          this.selectedApartmentSubject.next(apartment);
          this.isLoading.set(false);
        }),
        catchError(error => {
          console.error('❌ Error fetching apartment from Firestore:', error);
          this.isLoading.set(false);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('❌ Error setting up Firestore document query:', error);
      this.isLoading.set(false);
      return throwError(() => error);
    }
  }

  /**
   * Check apartment availability for date range
   * SIMPLIFIED for single-apartment mode
   */
  checkAvailability(apartmentId: string, checkIn: Date, checkOut: Date): Observable<boolean> {
    try {
      const availabilityRef = doc(this.firestore, 'apartment-availability', 'main-apartment');
      
      return docData(availabilityRef).pipe(
        map((data: any) => data?.isAvailable || false),
        catchError(error => {
          console.error('❌ Error checking availability from Firestore:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('❌ Error setting up availability query:', error);
      return throwError(() => error);
    }
  }

  /**
   * Get available apartments for date range
   * FIRESTORE VERSION
   */
  getAvailableApartments(checkIn: Date, checkOut: Date, guests?: number): Observable<Apartment[]> {
    try {
      const apartmentsRef = collection(this.firestore, 'apartments');
      let q = query(apartmentsRef, where('availability.isAvailable', '==', true));

      return collectionData(q, { idField: 'id' }).pipe(
        map(apartments => {
          let filtered = apartments as Apartment[];
          
          // Client-side guest filtering - use maxGuestsOneRoom or legacy maxGuests
          if (guests) {
            filtered = filtered.filter(apt => {
              const maxGuests = apt.specifications?.maxGuestsOneRoom || apt.specifications?.maxGuests || 0;
              return maxGuests >= guests;
            });
          }
          
          return filtered;
        }),
        tap(apartments => {
          this.apartmentsSubject.next(apartments);
          this.totalApartments.set(apartments.length);
        }),
        catchError(error => {
          console.error('❌ Error fetching available apartments from Firestore:', error);
          return throwError(() => error);
        }),
        shareReplay(1)
      );
    } catch (error) {
      console.error('❌ Error setting up available apartments query:', error);
      return throwError(() => error);
    }
  }

  /**
   * Filter apartments locally (client-side filtering)
   */
  filterApartments(apartments: Apartment[], filter: ApartmentFilter): Apartment[] {
    return apartments.filter(apt => {
      // Price filter - use oneRoomPrice as base price
      const price = apt.pricing?.oneRoomPrice || apt.pricing?.basePrice || 0;
      if (filter.minPrice !== undefined && price < filter.minPrice) {
        return false;
      }
      if (filter.maxPrice !== undefined && price > filter.maxPrice) {
        return false;
      }

      // Location filter
      const city = apt.location?.city || '';
      const state = apt.location?.state || '';
      
      if (filter.city && city.toLowerCase() !== filter.city.toLowerCase()) {
        return false;
      }
      if (filter.state && state.toLowerCase() !== filter.state.toLowerCase()) {
        return false;
      }

      // Guests filter - use maxGuestsOneRoom or legacy maxGuests
      const maxGuests = apt.specifications?.maxGuestsOneRoom || apt.specifications?.maxGuests || 0;
      if (filter.minGuests && maxGuests < filter.minGuests) {
        return false;
      }

      // Bedrooms filter
      const bedrooms = apt.specifications?.bedrooms || 0;
      if (filter.bedrooms && bedrooms < filter.bedrooms) {
        return false;
      }

      // Amenities filter
      if (filter.amenities && filter.amenities.length > 0) {
        const aptAmenities = apt.amenities || [];
        const hasAllAmenities = filter.amenities.every(amenity => 
          aptAmenities.includes(amenity)
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      // Rating filter
      const rating = apt.rating?.average || 0;
      if (filter.minRating && rating < filter.minRating) {
        return false;
      }

      return true;
    });
  }

  /**
   * Sort apartments
   */
  sortApartments(apartments: Apartment[], sortBy: SortOption): Apartment[] {
    const sorted = [...apartments];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => {
          const priceA = a.pricing?.oneRoomPrice || a.pricing?.basePrice || 0;
          const priceB = b.pricing?.oneRoomPrice || b.pricing?.basePrice || 0;
          return priceA - priceB;
        });
        
      case 'price-desc':
        return sorted.sort((a, b) => {
          const priceA = a.pricing?.oneRoomPrice || a.pricing?.basePrice || 0;
          const priceB = b.pricing?.oneRoomPrice || b.pricing?.basePrice || 0;
          return priceB - priceA;
        });
        
      case 'rating-desc':
        return sorted.sort((a, b) => {
          const ratingA = a.rating?.average || 0;
          const ratingB = b.rating?.average || 0;
          return ratingB - ratingA;
        });
        
      case 'newest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        
      default:
        return sorted;
    }
  }

  /**
   * Get featured apartments
   */
  getFeaturedApartments(limitCount: number = 6): Observable<Apartment[]> {
    try {
      const apartmentsRef = collection(this.firestore, 'apartments');
      const q = query(
        apartmentsRef,
        where('featured', '==', true),
        firestoreLimit(limitCount)
      );

      return collectionData(q, { idField: 'id' }).pipe(
        map(apartments => apartments as Apartment[]),
        catchError(error => {
          console.error('❌ Error fetching featured apartments:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('❌ Error setting up featured apartments query:', error);
      return throwError(() => error);
    }
  }

  /**
   * Search apartments (client-side search)
   */
  searchApartments(searchQuery: string): Observable<Apartment[]> {
    return this.getApartments().pipe(
      map(apartments => {
        const query = searchQuery.toLowerCase();
        return apartments.filter(apt => 
          (apt.title || '').toLowerCase().includes(query) ||
          (apt.description || '').toLowerCase().includes(query) ||
          (apt.location?.city || '').toLowerCase().includes(query) ||
          (apt.location?.address || '').toLowerCase().includes(query)
        );
      })
    );
  }

  /**
   * Clear cache (no-op for Firestore since it's real-time)
   */
  clearCache(): void {
    // Firestore handles caching internally
    console.log('ℹ️ Firestore cache cleared (handled automatically)');
  }
}

export interface ApartmentFilter {
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  state?: string;
  minGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  minRating?: number;
}

export type SortOption = 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';
