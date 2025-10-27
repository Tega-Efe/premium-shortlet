# Scale-Down Documentation: Multi-Apartment → Single-Apartment Platform

**Date:** October 27, 2025  
**Version:** 1.0.0  
**Status:** Single-Apartment Mode Active

---

## Table of Contents

1. [Overview](#overview)
2. [What Changed](#what-changed)
3. [New Files Created](#new-files-created)
4. [Modified Files](#modified-files)
5. [Commented-Out Features](#commented-out-features)
6. [Firebase Configuration](#firebase-configuration)
7. [Django Email API Integration](#django-email-api-integration)
8. [Testing Checklist](#testing-checklist)
9. [Re-activation Guide](#re-activation-guide)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This application has been temporarily scaled down from a **multi-apartment booking platform** to a **single two-bedroom apartment booking system**. All original code has been **preserved** through comments and parallel implementations, allowing for easy reactivation when scaling back up.

### Scale-Down Objectives

- ✅ Display and manage only ONE two-bedroom apartment
- ✅ Collect enhanced booking information (ID upload, address, booking option)
- ✅ Integrate email notifications via Django API
- ✅ Admin control over apartment availability
- ✅ Preserve all existing infrastructure for future expansion

---

## What Changed

### New Booking Flow

**Before (Multi-Apartment):**
- Browse multiple apartments
- Filter by city, bedrooms, guests, amenities
- Paginated results
- Basic booking form (name, email, phone, dates, guests, purpose)

**After (Single-Apartment):**
- Single apartment display
- No filters or pagination
- Enhanced booking form with:
  - Guest Name, Email, Phone
  - **ID Photo Upload** (JPG/PNG, max 5MB)
  - **Guest Address** (textarea)
  - **Booking Option** (one room vs entire apartment)
  - Check-in/Check-out Dates
  - Number of Nights

### Admin Dashboard Enhancements

- **New Feature:** Apartment Availability Toggle
  - Mark apartment as available/unavailable
  - Hides booking form when unavailable
  - Shows unavailability message to guests
- **Focused View:** Booking approvals and management only
- **Stats Dashboard:** Total bookings, pending approvals, daily activity

---

## New Files Created

### 1. `src/app/core/interfaces/simplified-booking.interface.ts`

Defines TypeScript interfaces for single-apartment operations.

**Interfaces:**
```typescript
SimplifiedBooking          // Booking data with ID photo, address, booking option
ApartmentAvailability      // Availability toggle state
EmailNotificationPayload   // Django API email data
BookingFormData            // Form submission data
SimplifiedBookingStats     // Admin dashboard statistics
```

**Key Fields:**
- `idPhotoUrl` / `idPhotoPath`: Firebase Storage references for uploaded ID
- `bookingOption`: `'one-room'` or `'entire-apartment'`
- `address`: Guest's full address
- `status`: `'pending'` | `'approved'` | `'rejected'`

---

### 2. `src/app/core/services/email-notification.service.ts`

Django REST API integration for automated email notifications.

**Configuration Required:**
```typescript
private readonly DJANGO_API_URL = 'https://your-django-api.com/api/notifications';
private readonly API_KEY = 'your-api-key-here';
```

**Methods:**
- `sendBookingReceivedNotification()` - Notifies admin when guest submits booking
- `sendBookingApprovedNotification()` - Notifies guest when booking is approved
- `sendBookingRejectedNotification()` - Notifies guest when booking is rejected

**Email Triggers:**
1. **Guest submits booking** → Admin receives email with booking details
2. **Admin approves booking** → Guest receives confirmation email
3. **Admin rejects booking** → Guest receives rejection email with reason

**Error Handling:**
- Silent failures (email errors don't break booking flow)
- Console logging for debugging
- Returns Observable for reactive handling

---

### 3. `src/app/core/services/simplified-booking.service.ts`

Firestore operations for single-apartment booking management.

**Firestore Collections:**
- `simplified-bookings/` - All booking records
- `apartment-availability/main-apartment` - Single availability document

**Firebase Storage:**
- Path: `booking-ids/{email}_{timestamp}.{ext}`
- Sanitized email addresses (replace @ and . with _)
- Automatic cleanup on failed uploads

**Methods:**

| Method | Purpose | Returns |
|--------|---------|---------|
| `createBooking()` | Submit new booking with ID upload | `Observable<SimplifiedBooking>` |
| `uploadIdPhoto()` | Upload ID to Firebase Storage | `Observable<{url: string, path: string}>` |
| `getAllBookings()` | Fetch all bookings | `Observable<SimplifiedBooking[]>` |
| `getPendingBookings()` | Fetch pending approvals | `Observable<SimplifiedBooking[]>` |
| `approveBooking()` | Approve booking + send email | `Observable<void>` |
| `rejectBooking()` | Reject booking + send email | `Observable<void>` |
| `toggleApartmentAvailability()` | Toggle booking form visibility | `Observable<void>` |
| `loadApartmentAvailability()` | Load availability status | `void` |

**Reactive Signals:**
- `isLoading` - Loading state
- `isApartmentAvailable` - Booking form visibility
- `bookingStats` - Admin dashboard statistics

---

### 4. `src/app/shared/forms/simplified-form-configs.ts`

Enhanced booking form configuration with file upload support.

**Form Fields (9 total):**

```typescript
1. guestName       - text, required
2. guestEmail      - email, required, email validation
3. guestPhone      - tel, required, phone validation
4. guestAddress    - textarea, required, min 10 chars
5. idPhoto         - file, required, JPG/PNG only, 5MB max
6. bookingOption   - select, required, ['one-room', 'entire-apartment']
7. checkInDate     - date, required, future dates only
8. checkOutDate    - date, required, after check-in
9. numberOfNights  - number, required, 1-90 nights
```

**File Upload Validation:**
- Accepted types: `image/jpeg`, `image/png`, `image/jpg`
- Max file size: 5MB (5,242,880 bytes)
- Error messages for invalid files

**Custom Validators:**
- `futureDate()` - Ensures check-in/check-out are in the future
- `phoneValidator()` - Validates phone number format
- `emailValidator()` - Validates email format

---

## Modified Files

### 1. Home Component (`src/app/pages/home/`)

**TypeScript Changes (`home.component.ts`):**

```typescript
// BEFORE
import { BookingService } from '../../core/services/booking.service';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { bookingFormConfig } from '../../shared/forms/form-configs';

// AFTER
// import { BookingService } from '../../core/services/booking.service'; // COMMENTED OUT
// import { FilterComponent } from '../../shared/components/filter/filter.component'; // COMMENTED OUT
import { SimplifiedBookingService } from '../../core/services/simplified-booking.service';
import { simplifiedBookingFormConfig } from '../../shared/forms/simplified-form-configs';
```

**Key Logic Changes:**
- `loadApartments()` - Filters to first apartment only: `apartments[0]`
- `onBookingSubmit()` - Completely rewritten to use `SimplifiedBookingService`
- Form configuration switched to `simplifiedBookingFormConfig`

**HTML Changes (`home.component.html`):**

| Section | Change | Line Marker |
|---------|--------|-------------|
| Page Title | "Browse Apartments" → "Our Two-Bedroom Apartment" | Line ~12 |
| Filter Sidebar | Wrapped in `<!-- COMMENTED OUT -->` | Lines ~30-80 |
| Sort Dropdown | Wrapped in `<!-- COMMENTED OUT -->` | Lines ~90-110 |
| Pagination | Wrapped in `<!-- COMMENTED OUT -->` | Lines ~150-180 |

**CSS Changes:**
- Grid layout: `320px 1fr` → `1fr` (single column)
- Sidebar: `display: none` added

---

### 2. Admin Component (`src/app/pages/admin/`)

**New Features Added:**

**1. Availability Toggle Section (`admin.component.html`):**
```html
<!-- NEW: Apartment Availability Control -->
<div class="availability-control-card">
  <button (click)="toggleApartmentAvailability()">
    {{ isApartmentAvailable() ? 'Mark as Unavailable' : 'Mark as Available' }}
  </button>
</div>
```

**2. Service Integration (`admin.component.ts`):**
```typescript
private simplifiedBookingService = inject(SimplifiedBookingService);
isApartmentAvailable = this.simplifiedBookingService.isApartmentAvailable;

async toggleApartmentAvailability(): Promise<void> {
  const newStatus = !this.isApartmentAvailable();
  await this.simplifiedBookingService.toggleApartmentAvailability(
    newStatus,
    newStatus ? undefined : 'Apartment is currently unavailable for booking',
    this.adminName
  ).toPromise();
}
```

**Visual Indicators:**
- Green badge: "Available" (guests can book)
- Red badge: "Unavailable" (booking form hidden)
- Pulsing status indicator
- Real-time updates via signals

---

### 3. Navigation Component (`src/app/shared/components/navbar/`)

**Changes:**

| Element | Before | After |
|---------|--------|-------|
| Browse Link | "Browse" with search icon | "Our Apartment" with home icon |
| Desktop CTA | "List Property" button | COMMENTED OUT |
| Mobile CTA | "List Your Property" button | COMMENTED OUT |

**Reason:** "List Property" is for multi-apartment mode where owners can add listings.

---

## Commented-Out Features

All features marked with clear preservation comments for easy reactivation.

### Home Page (`home.component.html`)

**1. Filter Sidebar (Lines ~30-80):**
```html
<!-- COMMENTED OUT FOR SINGLE-APARTMENT OPERATION
     To re-enable: Uncomment when scaling back up -->
<!-- 
<aside class="sidebar">
  <app-filter ...>
  </app-filter>
</aside>
-->
```

**2. Sort Dropdown (Lines ~90-110):**
```html
<!-- COMMENTED OUT: Sort options not needed for single apartment -->
<!--
<div class="results-header">
  <select class="sort-select" ...>
    <option value="price-asc">Price: Low to High</option>
    ...
  </select>
</div>
-->
```

**3. Pagination (Lines ~150-180):**
```html
<!-- COMMENTED OUT: Pagination not needed for single apartment -->
<!--
@if (filteredApartments().length > 0) {
  <div class="pagination">
    ...pagination controls...
  </div>
}
-->
```

### Navigation (`navbar.component.html`)

**"List Property" CTA Buttons:**
```html
<!-- CTA Button - COMMENTED OUT: Not needed for single-apartment mode -->
<!-- To re-enable: Uncomment when scaling back to multi-apartment platform
<a routerLink="/home" class="btn-cta">
  <i class="fas fa-plus-circle"></i>
  <span>List Property</span>
</a>
-->
```

---

## Firebase Configuration

### Firestore Collections

#### 1. `simplified-bookings/`

**Document Structure:**
```javascript
{
  id: "auto-generated-id",
  guestName: "John Doe",
  guestEmail: "john@example.com",
  guestPhone: "+1234567890",
  address: "123 Main St, City, State, ZIP",
  idPhotoUrl: "https://firebasestorage.googleapis.com/...",
  idPhotoPath: "booking-ids/john_example_com_1730000000000.jpg",
  bookingOption: "entire-apartment",  // or "one-room"
  checkInDate: "2025-11-01",
  checkOutDate: "2025-11-05",
  numberOfNights: 4,
  status: "pending",  // "approved" | "rejected"
  createdAt: "2025-10-27T10:30:00Z",
  updatedAt: "2025-10-27T10:30:00Z",
  approvedBy: null,
  rejectedBy: null,
  rejectionReason: null
}
```

**Indexes Required:**
```javascript
// Query: Get pending bookings sorted by date
status (Ascending) + createdAt (Descending)

// Query: Get all bookings sorted by date
createdAt (Descending)
```

**Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /simplified-bookings/{bookingId} {
      // Anyone can create bookings
      allow create: if true;
      
      // Only authenticated admins can read/update/delete
      allow read, update, delete: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

---

#### 2. `apartment-availability/`

**Document ID:** `main-apartment` (single document)

**Document Structure:**
```javascript
{
  isAvailable: true,  // boolean
  unavailableMessage: null,  // string or null
  lastUpdated: "2025-10-27T10:30:00Z",
  updatedBy: "Admin User"
}
```

**Security Rules:**
```javascript
match /apartment-availability/{docId} {
  // Anyone can read availability
  allow read: if true;
  
  // Only authenticated admins can update
  allow write: if request.auth != null && 
    request.auth.token.admin == true;
}
```

---

### Firebase Storage

**Path Structure:**
```
gs://your-bucket/booking-ids/
  ├── john_example_com_1730000000000.jpg
  ├── jane_doe_email_com_1730000100000.png
  └── ...
```

**Naming Convention:**
```typescript
// Email sanitization
email.replace('@', '_').replace(/\./g, '_')

// Full path
`booking-ids/${sanitizedEmail}_${timestamp}.${extension}`
```

**Security Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /booking-ids/{fileName} {
      // Allow uploads up to 5MB
      allow create: if request.resource.size < 5 * 1024 * 1024
                    && request.resource.contentType.matches('image/(jpeg|png|jpg)');
      
      // Only admins can read/delete
      allow read, delete: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

---

## Django Email API Integration

### Required Django Endpoint

**URL:** `https://your-django-api.com/api/notifications/send`

**Method:** `POST`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer your-api-key-here"
}
```

### Request Payload Structure

#### 1. Booking Received (to Admin)

```json
{
  "type": "booking_received",
  "to": "admin@yoursite.com",
  "subject": "New Booking Request Received",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+1234567890",
  "address": "123 Main St, City, State",
  "bookingOption": "Entire Apartment",
  "checkInDate": "November 1, 2025",
  "checkOutDate": "November 5, 2025",
  "numberOfNights": 4
}
```

#### 2. Booking Approved (to Guest)

```json
{
  "type": "booking_approved",
  "to": "john@example.com",
  "subject": "Your Booking Has Been Approved",
  "guestName": "John Doe",
  "checkInDate": "November 1, 2025",
  "checkOutDate": "November 5, 2025"
}
```

#### 3. Booking Rejected (to Guest)

```json
{
  "type": "booking_rejected",
  "to": "john@example.com",
  "subject": "Your Booking Request Update",
  "guestName": "John Doe",
  "rejectionReason": "Dates not available",
  "checkInDate": "November 1, 2025",
  "checkOutDate": "November 5, 2025"
}
```

### Django Implementation Example

```python
# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings

@api_view(['POST'])
@permission_classes([AllowAny])  # Or use API key authentication
def send_notification(request):
    data = request.data
    email_type = data.get('type')
    
    if email_type == 'booking_received':
        send_mail(
            subject=data.get('subject'),
            message=f"""
            New booking request from {data.get('guestName')}
            Email: {data.get('guestEmail')}
            Phone: {data.get('guestPhone')}
            Address: {data.get('address')}
            
            Booking Details:
            - Option: {data.get('bookingOption')}
            - Check-in: {data.get('checkInDate')}
            - Check-out: {data.get('checkOutDate')}
            - Nights: {data.get('numberOfNights')}
            
            Login to admin dashboard to approve or reject.
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[data.get('to')],
            fail_silently=False,
        )
    
    # Similar implementations for 'booking_approved' and 'booking_rejected'
    
    return Response({'success': True})
```

### Configuration Steps

1. **Update API URL in Angular:**
   ```typescript
   // src/app/core/services/email-notification.service.ts
   private readonly DJANGO_API_URL = 'https://your-django-api.com/api/notifications/send';
   private readonly API_KEY = 'your-secure-api-key';
   ```

2. **Set up Django endpoint:**
   - Create `/api/notifications/send` endpoint
   - Implement email sending logic
   - Add API key authentication
   - Configure email backend (SMTP, SendGrid, etc.)

3. **Test email flow:**
   - Submit test booking
   - Verify admin receives notification
   - Approve/reject booking
   - Verify guest receives notification

---

## Testing Checklist

### Frontend Testing

- [ ] **Home Page**
  - [ ] Single apartment displays correctly
  - [ ] No filters/sort/pagination visible
  - [ ] Page title shows "Our Two-Bedroom Apartment"
  - [ ] Booking button visible when available
  - [ ] Unavailability message shows when toggled off

- [ ] **Booking Form**
  - [ ] All 9 fields display correctly
  - [ ] ID photo upload works (JPG/PNG, max 5MB)
  - [ ] File validation shows errors for invalid files
  - [ ] Address textarea expands properly
  - [ ] Booking option dropdown shows both options
  - [ ] Date pickers enforce future dates only
  - [ ] Form submission creates Firestore document
  - [ ] ID photo uploads to Firebase Storage

- [ ] **Admin Dashboard**
  - [ ] Availability toggle button displays
  - [ ] Toggle updates Firestore successfully
  - [ ] Status badge changes color (green/red)
  - [ ] Pending bookings load correctly
  - [ ] Approve/reject actions work
  - [ ] Stats update after actions

- [ ] **Navigation**
  - [ ] "Our Apartment" link works
  - [ ] "List Property" buttons hidden
  - [ ] Mobile menu displays correctly
  - [ ] Theme toggle works

### Backend Testing

- [ ] **Firestore**
  - [ ] `simplified-bookings` collection created
  - [ ] Documents have correct structure
  - [ ] Indexes created for queries
  - [ ] Security rules enforced

- [ ] **Firebase Storage**
  - [ ] `booking-ids/` folder exists
  - [ ] ID photos upload successfully
  - [ ] File names sanitized correctly
  - [ ] Security rules enforced (5MB, images only)

- [ ] **Email Notifications**
  - [ ] Admin receives email on booking submission
  - [ ] Guest receives email on approval
  - [ ] Guest receives email on rejection
  - [ ] Email content formatted correctly
  - [ ] Errors logged but don't break flow

### Integration Testing

- [ ] **End-to-End Booking Flow**
  1. Guest views apartment (available)
  2. Guest fills form + uploads ID
  3. Guest submits booking
  4. Admin receives email
  5. Admin sees pending booking in dashboard
  6. Admin approves booking
  7. Guest receives approval email
  8. Booking status updates to "approved"

- [ ] **Availability Toggle Flow**
  1. Admin toggles availability to "unavailable"
  2. Home page hides booking form
  3. Home page shows unavailability message
  4. Admin toggles back to "available"
  5. Booking form reappears

---

## Re-activation Guide

### Step 1: Uncomment Home Page Features

**File:** `src/app/pages/home/home.component.html`

1. **Restore Filter Sidebar:**
   ```html
   <!-- Remove opening comment marker -->
   <aside class="sidebar">
     <app-filter ...>
     </app-filter>
   </aside>
   <!-- Remove closing comment marker -->
   ```

2. **Restore Sort Dropdown:**
   ```html
   <!-- Uncomment sort section (~lines 90-110) -->
   ```

3. **Restore Pagination:**
   ```html
   <!-- Uncomment pagination block (~lines 150-180) -->
   ```

**File:** `src/app/pages/home/home.component.ts`

4. **Restore FilterComponent:**
   ```typescript
   import { FilterComponent } from '../../shared/components/filter/filter.component';
   
   @Component({
     imports: [
       FilterComponent,  // Uncomment
       // ... other imports
     ]
   })
   ```

5. **Restore CSS Grid:**
   ```css
   .content-grid {
     grid-template-columns: 320px 1fr;  // Change from 1fr
   }
   
   .sidebar {
     display: block;  // Remove display: none
   }
   ```

6. **Restore Original Services:**
   ```typescript
   import { BookingService } from '../../core/services/booking.service';
   import { bookingFormConfig } from '../../shared/forms/form-configs';
   
   // Replace SimplifiedBookingService with BookingService
   // Replace simplifiedBookingFormConfig with bookingFormConfig
   ```

7. **Restore loadApartments() Logic:**
   ```typescript
   loadApartments(): void {
     // Remove: const main = apartments[0];
     // Restore: this.allApartments.set(apartments);
     this.applyFiltersAndSort();  // Re-enable
   }
   ```

---

### Step 2: Restore Navigation Links

**File:** `src/app/shared/components/navbar/navbar.component.html`

1. **Restore "Browse" Link:**
   ```html
   <a routerLink="/home" class="nav-link">
     <i class="fas fa-search"></i>  <!-- Change from fa-home -->
     <span>Browse</span>  <!-- Change from "Our Apartment" -->
   </a>
   ```

2. **Restore "List Property" Buttons:**
   ```html
   <!-- Desktop -->
   <a routerLink="/home" class="btn-cta">
     <i class="fas fa-plus-circle"></i>
     <span>List Property</span>
   </a>
   
   <!-- Mobile -->
   <a routerLink="/home" class="btn-cta mobile" (click)="closeMobileMenu()">
     <i class="fas fa-plus-circle"></i>
     <span>List Your Property</span>
   </a>
   ```

---

### Step 3: Admin Dashboard Adjustments

**File:** `src/app/pages/admin/admin.component.html`

1. **Keep or Remove Availability Toggle:**
   - **Option A:** Keep for manual availability control
   - **Option B:** Comment out availability section if not needed

2. **Add Multi-Apartment Management:**
   - Restore apartment listings tab
   - Add city management section
   - Add property owner management

---

### Step 4: Data Migration (if needed)

**Migrate from `simplified-bookings` to `bookings`:**

```typescript
// Migration script
async function migrateBookings() {
  const simplifiedBookings = await getDocs(collection(firestore, 'simplified-bookings'));
  
  for (const doc of simplifiedBookings.docs) {
    const data = doc.data();
    
    // Map simplified booking to full booking structure
    await addDoc(collection(firestore, 'bookings'), {
      ...data,
      apartmentId: 'main-apartment-id',  // Add apartment reference
      // ... map other fields
    });
  }
}
```

---

### Step 5: Update Routing (if needed)

**File:** `src/app/app.routes.ts`

Add routes for multi-apartment features:
```typescript
{
  path: 'apartments/:id',
  loadComponent: () => import('./pages/apartment-detail/apartment-detail.component')
},
{
  path: 'owner-dashboard',
  loadComponent: () => import('./pages/owner-dashboard/owner-dashboard.component')
}
```

---

### Step 6: Update Page Titles and Branding

1. **Home Page Title:**
   - "Our Two-Bedroom Apartment" → "Browse Apartments"

2. **Meta Tags:**
   ```typescript
   this.title.setTitle('Browse Apartments - Shortlet Connect');
   this.meta.updateTag({ 
     name: 'description', 
     content: 'Find your perfect short-term rental from our collection of verified apartments.'
   });
   ```

---

## Troubleshooting

### Issue: Booking Form Not Showing

**Possible Causes:**
1. Apartment marked as unavailable in admin
2. No apartment data loaded
3. `isApartmentAvailable` signal not initialized

**Solution:**
```typescript
// Check admin dashboard
console.log(this.simplifiedBookingService.isApartmentAvailable());

// Force availability check
this.simplifiedBookingService.loadApartmentAvailability();
```

---

### Issue: ID Photo Upload Fails

**Possible Causes:**
1. File exceeds 5MB limit
2. Invalid file type (not JPG/PNG)
3. Firebase Storage rules too restrictive
4. Network error

**Solution:**
```typescript
// Check file size
if (file.size > 5 * 1024 * 1024) {
  console.error('File too large');
}

// Check file type
if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
  console.error('Invalid file type');
}

// Check Firebase Storage rules
// Ensure anonymous uploads allowed for booking-ids/
```

---

### Issue: Email Notifications Not Sending

**Possible Causes:**
1. Django API URL not configured
2. API key invalid
3. Django endpoint not running
4. CORS issues

**Solution:**
```typescript
// 1. Verify API URL
console.log(this.emailService['DJANGO_API_URL']);

// 2. Test endpoint manually
fetch('https://your-django-api.com/api/notifications/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-api-key'
  },
  body: JSON.stringify({
    type: 'booking_received',
    to: 'test@example.com',
    // ... test data
  })
});

// 3. Check Django logs for errors
```

---

### Issue: Firestore Permission Denied

**Possible Causes:**
1. Security rules too restrictive
2. Not authenticated as admin
3. Trying to access from wrong collection

**Solution:**
```javascript
// Check Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /simplified-bookings/{bookingId} {
      allow create: if true;  // Allow anonymous creates
      allow read: if true;    // Or restrict to admins only
    }
  }
}
```

---

### Issue: Admin Dashboard Stats Not Updating

**Possible Causes:**
1. Bookings not loading
2. Stats calculation error
3. Signal not reactive

**Solution:**
```typescript
// Force reload
this.loadData();

// Check signal updates
effect(() => {
  console.log('Stats updated:', this.stats());
});

// Verify Firestore connection
this.simplifiedBookingService.getAllBookings().subscribe(bookings => {
  console.log('Loaded bookings:', bookings.length);
});
```

---

## Support and Maintenance

### Key Contacts

- **Frontend Developer:** [Your Name]
- **Backend Developer:** [Django Team]
- **Firebase Admin:** [Admin Email]

### Useful Commands

```bash
# Build for production
ng build --configuration production

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules

# Run development server
ng serve --port 4200
```

### Important Files Reference

| File | Purpose |
|------|---------|
| `simplified-booking.interface.ts` | Type definitions |
| `simplified-booking.service.ts` | Firestore operations |
| `email-notification.service.ts` | Django API integration |
| `simplified-form-configs.ts` | Booking form configuration |
| `home.component.ts/html` | Single apartment display |
| `admin.component.ts/html` | Admin dashboard |
| `navbar.component.html` | Navigation |

---

**Last Updated:** October 27, 2025  
**Documentation Version:** 1.0.0  
**Platform Status:** ✅ Single-Apartment Mode Active
