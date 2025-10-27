import { Injectable, inject, signal } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { Apartment, BookingFilter, DateRange } from '../interfaces';
import { ApiService } from './api.service';
import { DateUtils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {
  private apiService = inject(ApiService);

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
   */
  getApartments(filters?: ApartmentFilter): Observable<Apartment[]> {
    this.isLoading.set(true);
    
    return this.apiService.get<Apartment[]>('apartments', filters).pipe(
      tap(apartments => {
        this.apartmentsSubject.next(apartments);
        this.totalApartments.set(apartments.length);
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
   * Get apartment by ID
   */
  getApartmentById(id: string): Observable<Apartment> {
    this.isLoading.set(true);

    return this.apiService.get<Apartment>(`apartments/${id}`).pipe(
      tap(apartment => {
        this.selectedApartmentSubject.next(apartment);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Check apartment availability for date range
   */
  checkAvailability(apartmentId: string, checkIn: Date, checkOut: Date): Observable<boolean> {
    const params = {
      apartmentId,
      checkIn: DateUtils.formatDate(checkIn),
      checkOut: DateUtils.formatDate(checkOut)
    };

    return this.apiService.get<{ available: boolean }>('apartments/check-availability', params).pipe(
      map(response => response.available)
    );
  }

  /**
   * Get available apartments for date range
   */
  getAvailableApartments(checkIn: Date, checkOut: Date, guests?: number): Observable<Apartment[]> {
    const params: any = {
      checkIn: DateUtils.formatDate(checkIn),
      checkOut: DateUtils.formatDate(checkOut)
    };

    if (guests) {
      params.guests = guests;
    }

    return this.apiService.get<Apartment[]>('apartments/available', params).pipe(
      tap(apartments => {
        this.apartmentsSubject.next(apartments);
        this.totalApartments.set(apartments.length);
      }),
      shareReplay(1)
    );
  }

  /**
   * Filter apartments locally (client-side filtering)
   */
  filterApartments(apartments: Apartment[], filter: ApartmentFilter): Apartment[] {
    return apartments.filter(apt => {
      // Price filter
      if (filter.minPrice !== undefined && apt.pricing.basePrice < filter.minPrice) {
        return false;
      }
      if (filter.maxPrice !== undefined && apt.pricing.basePrice > filter.maxPrice) {
        return false;
      }

      // Location filter
      if (filter.city && apt.location.city.toLowerCase() !== filter.city.toLowerCase()) {
        return false;
      }
      if (filter.state && apt.location.state.toLowerCase() !== filter.state.toLowerCase()) {
        return false;
      }

      // Guests filter
      if (filter.minGuests && apt.specifications.maxGuests < filter.minGuests) {
        return false;
      }

      // Bedrooms filter
      if (filter.bedrooms && apt.specifications.bedrooms < filter.bedrooms) {
        return false;
      }

      // Amenities filter
      if (filter.amenities && filter.amenities.length > 0) {
        const hasAllAmenities = filter.amenities.every(amenity => 
          apt.amenities.includes(amenity)
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      // Rating filter
      if (filter.minRating && (!apt.rating || apt.rating.average < filter.minRating)) {
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
        return sorted.sort((a, b) => a.pricing.basePrice - b.pricing.basePrice);
      case 'price-desc':
        return sorted.sort((a, b) => b.pricing.basePrice - a.pricing.basePrice);
      case 'rating-desc':
        return sorted.sort((a, b) => {
          const ratingA = a.rating?.average || 0;
          const ratingB = b.rating?.average || 0;
          return ratingB - ratingA;
        });
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return sorted;
    }
  }

  /**
   * Get featured apartments
   */
  getFeaturedApartments(limit: number = 6): Observable<Apartment[]> {
    return this.apiService.get<Apartment[]>('apartments/featured', { limit });
  }

  /**
   * Search apartments
   */
  searchApartments(query: string): Observable<Apartment[]> {
    return this.apiService.get<Apartment[]>('apartments/search', { q: query });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.apiService.clearCache('apartments');
    this.apiService.clearCache('apartments/available');
    this.apiService.clearCache('apartments/featured');
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
