import { Injectable, inject, signal } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  Timestamp,
  writeBatch
} from '@angular/fire/firestore';
import { Observable, from, map, catchError, of } from 'rxjs';
import { Apartment } from '../interfaces';

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
    return this.updateApartment(apartmentId, {
      availability: {
        isAvailable,
        status: isAvailable ? 'available' : 'maintenance'
      }
    });
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
}
