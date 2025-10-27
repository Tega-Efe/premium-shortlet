import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  CollectionReference,
  DocumentData,
  onSnapshot,
  Unsubscribe
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);

  // Get a document by ID
  async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    try {
      const docRef = doc(this.firestore, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  // Get all documents from a collection
  async getCollection<T>(collectionName: string, ...queryConstraints: QueryConstraint[]): Promise<T[]> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error('Error getting collection:', error);
      throw error;
    }
  }

  // Add a document to a collection (auto-generated ID)
  async addDocument<T>(collectionName: string, data: T): Promise<string> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const docRef = await addDoc(collectionRef, data as DocumentData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  // Set a document with a specific ID (creates or overwrites)
  async setDocument<T>(collectionName: string, docId: string, data: T, merge = false): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, docId);
      await setDoc(docRef, data as DocumentData, { merge });
    } catch (error) {
      console.error('Error setting document:', error);
      throw error;
    }
  }

  // Update a document
  async updateDocument<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, docId);
      await updateDoc(docRef, data as DocumentData);
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  // Delete a document
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  // Real-time listener for a document
  listenToDocument<T>(
    collectionName: string,
    docId: string,
    callback: (data: T | null) => void
  ): Unsubscribe {
    const docRef = doc(this.firestore, collectionName, docId);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as T);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error listening to document:', error);
    });
  }

  // Real-time listener for a collection
  listenToCollection<T>(
    collectionName: string,
    callback: (data: T[]) => void,
    ...queryConstraints: QueryConstraint[]
  ): Unsubscribe {
    const collectionRef = collection(this.firestore, collectionName);
    const q = query(collectionRef, ...queryConstraints);
    
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      callback(data);
    }, (error) => {
      console.error('Error listening to collection:', error);
    });
  }

  // Query helpers (re-export for convenience)
  where = where;
  orderBy = orderBy;
  limit = limit;
}
