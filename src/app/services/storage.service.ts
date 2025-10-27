import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTask,
  UploadTaskSnapshot
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = inject(Storage);

  // Upload a file
  async uploadFile(path: string, file: File): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Upload file with progress tracking
  uploadFileWithProgress(path: string, file: File): UploadTask {
    const storageRef = ref(this.storage, path);
    return uploadBytesResumable(storageRef, file);
  }

  // Get download URL for a file
  async getDownloadURL(path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  // Delete a file
  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // List all files in a directory
  async listFiles(path: string): Promise<string[]> {
    try {
      const storageRef = ref(this.storage, path);
      const result = await listAll(storageRef);
      
      const urlPromises = result.items.map(itemRef => getDownloadURL(itemRef));
      return await Promise.all(urlPromises);
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(basePath: string, files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => {
        const filePath = `${basePath}/${file.name}`;
        return this.uploadFile(filePath, file);
      });
      
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  }
}
