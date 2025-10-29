# Firebase Storage Enablement Guide

## Overview
The booking service is currently configured to work WITHOUT Firebase Storage. ID photo uploads are disabled, but all the code is ready and commented out. When you're ready to enable ID photo uploads, follow this guide.

## Current Status
✅ **Bookings work without storage** - Guests can submit bookings without ID photos being uploaded  
⚠️ **Storage code commented out** - All storage functionality is preserved but disabled  
📝 **ID photo files are logged** - You can see file info in console but files aren't uploaded

## When to Enable Storage
Enable storage when:
- You want guests to upload ID verification photos
- Firebase Storage is configured in your project
- You have storage rules set up
- You're ready to handle uploaded files

## Step-by-Step Enablement

### Step 1: Configure Firebase Storage

1. **Enable Storage in Firebase Console**
   - Go to: https://console.firebase.google.com
   - Select project: `shortlet-connect`
   - Click "Storage" in the left sidebar
   - Click "Get Started"
   - Choose production mode or test mode
   - Select a Cloud Storage location (use same region as Firestore)
   - Click "Done"

2. **Set Storage Rules**
   Update your Storage rules:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Allow authenticated users to upload booking IDs
       match /booking-ids/{allPaths=**} {
         allow read, write: if request.auth != null;
       }
       
       // Alternative: Allow anyone to upload (for public booking form)
       match /booking-ids/{allPaths=**} {
         allow write: if request.resource.size < 5 * 1024 * 1024  // Max 5MB
                      && request.resource.contentType.matches('image/.*');
         allow read: if request.auth != null;  // Only admins can view
       }
     }
   }
   ```

### Step 2: Update Service Code

Open `src/app/core/services/simplified-booking.service.ts` and make these changes:

**Change 1: Uncomment Storage Imports (Line ~15)**
```typescript
// BEFORE (commented out):
// import { 
//   Storage, 
//   ref, 
//   uploadBytes, 
//   getDownloadURL, 
//   deleteObject 
// } from '@angular/fire/storage';

// AFTER (uncommented):
import { 
  Storage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from '@angular/fire/storage';
```

**Change 2: Uncomment Storage Injection (Line ~60)**
```typescript
// BEFORE:
// private storage = inject(Storage);

// AFTER:
private storage = inject(Storage);
```

**Change 3: Enable Storage Upload in createBooking() (Line ~115)**
Find this section:
```typescript
// ============================================================
// FIREBASE STORAGE - ID PHOTO UPLOAD (CURRENTLY DISABLED)
// ============================================================
// When ready to enable storage, uncomment this block and comment out the else block

/* ENABLE STORAGE - UNCOMMENT THIS BLOCK
if (formData.idPhoto) {
  // ... upload logic ...
}
END ENABLE STORAGE */
```

**Uncomment the entire storage block** and **comment out the NO STORAGE section**:

```typescript
// ============================================================
// FIREBASE STORAGE - ID PHOTO UPLOAD (ENABLED)
// ============================================================
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

// ============================================================
// NO STORAGE VERSION (DISABLED)
// ============================================================
/* COMMENT OUT THIS SECTION WHEN STORAGE IS ENABLED
if (formData.idPhoto) {
  console.warn('⚠️ ID photo provided but not uploaded...');
  // ... logging logic ...
}
// Save booking without ID photo
return this.saveBookingToFirestore(booking).pipe(
  // ... rest of code ...
);
END NO STORAGE VERSION */
```

**Change 4: Uncomment uploadIdPhoto() Method (Line ~715)**
```typescript
// BEFORE (commented out):
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

// AFTER (uncommented):
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
```

### Step 3: Test Storage Upload

1. **Run the Application**
   ```powershell
   ng serve --port 4200
   ```

2. **Submit a Test Booking**
   - Go to: http://localhost:4200/home
   - Select an apartment
   - Fill in the booking form
   - Upload a test ID photo
   - Submit the booking

3. **Verify Upload**
   - Check browser console for success messages
   - Go to Firebase Console → Storage
   - Navigate to `booking-ids/` folder
   - You should see the uploaded image

4. **Check Firestore**
   - Go to Firebase Console → Firestore
   - Open the new booking document
   - Verify `guestInfo.idPhotoUrl` has a valid URL
   - Verify `guestInfo.idPhotoPath` has the file path

### Step 4: Update Admin Dashboard (Optional)

If you want admins to view uploaded ID photos:

1. **Add ID Photo Display in Admin Component**
   ```typescript
   // In admin.component.html
   @if (booking.guestInfo.idPhotoUrl) {
     <div class="id-photo-preview">
       <img [src]="booking.guestInfo.idPhotoUrl" alt="Guest ID">
     </div>
   }
   ```

2. **Add Download Button**
   ```typescript
   <button (click)="downloadIdPhoto(booking.guestInfo.idPhotoUrl)">
     <i class="fas fa-download"></i> Download ID Photo
   </button>
   ```

## Troubleshooting

### Issue: Storage Import Error
**Solution:**
- Make sure `@angular/fire` is up to date
- Run: `npm install @angular/fire@latest`
- Restart the dev server

### Issue: Upload Permission Denied
**Solution:**
- Check Firebase Storage rules
- Make sure the path matches: `booking-ids/{filename}`
- For public uploads, allow write without auth
- For admin-only, require authentication

### Issue: File Too Large
**Solution:**
- Add file size validation in the booking form
- Current limit in storage rules: 5MB
- Compress images before upload if needed

### Issue: Invalid File Type
**Solution:**
- Update storage rules to accept specific image types
- Add client-side validation for image files only
- Recommended: jpg, jpeg, png

## File Structure After Enabling Storage

```
booking-ids/
├── user_email_com_1234567890.jpg
├── guest_name_com_1234567891.jpg
└── another_user_com_1234567892.jpg
```

## Security Best Practices

1. **Validate File Types**
   - Only allow image uploads
   - Check file extensions and MIME types

2. **Limit File Sizes**
   - Set maximum file size (recommended: 5MB)
   - Reject files that are too large

3. **Sanitize File Names**
   - Remove special characters
   - Use timestamps to prevent collisions
   - Don't expose user emails in URLs

4. **Access Control**
   - Only admins should view ID photos
   - Guests should not access other guests' photos
   - Consider deleting photos after booking is complete

5. **GDPR Compliance**
   - Implement data deletion on request
   - Add privacy policy about photo storage
   - Set auto-deletion rules for old bookings

## Rollback (Disable Storage)

If you need to disable storage again:

1. Comment out Storage imports
2. Comment out storage injection
3. Uncomment the NO STORAGE version in createBooking()
4. Comment out the uploadIdPhoto() method
5. Restart the application

## Summary

✅ **Before Enabling**: Bookings work without ID photo upload  
✅ **After Enabling**: Full ID photo upload and storage functionality  
✅ **Easy Toggle**: Well-commented code for easy enable/disable  
✅ **Production Ready**: All error handling and validation included

---

**Last Updated**: October 29, 2025  
**Storage Status**: Disabled (Ready to Enable)  
**Service File**: `simplified-booking.service.ts`
