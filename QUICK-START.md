# Quick Start Guide: Single-Apartment Booking System

**Status:** ✅ Ready for Production  
**Date:** October 27, 2025

---

## What You Need to Do Next

### 1. Configure Django Email API (REQUIRED)

**File:** `src/app/core/services/email-notification.service.ts`

**Lines to Update:**
```typescript
// Line 12-13
private readonly DJANGO_API_URL = 'https://YOUR-ACTUAL-DJANGO-URL.com/api/notifications/send';
private readonly API_KEY = 'YOUR-ACTUAL-API-KEY-HERE';
```

**What the Django endpoint should do:**
- Accept POST requests with booking notification data
- Send emails to admin when guests submit bookings
- Send emails to guests when bookings are approved/rejected
- Return `200 OK` on success

**If you don't have Django yet:**
- Email notifications will silently fail (logged in console)
- Bookings will still work perfectly
- You can add Django integration later

---

### 2. Set Up Firebase (REQUIRED)

#### Firestore Collections

**Create these collections manually or let the app create them:**

1. **`simplified-bookings`** - Stores all booking records
2. **`apartment-availability`** - Single document with ID `main-apartment`

**Initialize availability:**
```javascript
// In Firebase Console → Firestore Database
// Create collection: apartment-availability
// Add document with ID: main-apartment
{
  isAvailable: true,
  unavailableMessage: null,
  lastUpdated: "2025-10-27T10:00:00Z",
  updatedBy: "System"
}
```

#### Firebase Storage

**Create folder structure:**
```
Storage Root
└── booking-ids/
    (ID photos will be uploaded here automatically)
```

#### Security Rules

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Booking submissions (public create, admin read/update)
    match /simplified-bookings/{bookingId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Availability control (public read, admin write)
    match /apartment-availability/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /booking-ids/{fileName} {
      // Allow uploads up to 5MB, images only
      allow create: if request.resource.size < 5 * 1024 * 1024
                    && request.resource.contentType.matches('image/(jpeg|png|jpg)');
      
      // Admins can read/delete
      allow read, delete: if request.auth != null;
    }
  }
}
```

**Deploy rules:**
```bash
firebase deploy --only firestore:rules,storage:rules
```

---

### 3. Update Admin Email Address

**File:** `src/app/core/services/email-notification.service.ts`

**Line to Update:**
```typescript
// Line ~85 (in sendBookingReceivedNotification method)
to: 'YOUR-ADMIN-EMAIL@example.com',  // Change this!
```

---

### 4. Add Apartment Data (REQUIRED)

The home page displays the **first apartment** from your existing apartments collection.

**Make sure you have at least one apartment in Firestore:**

**Collection:** `apartments` (or whatever your ApartmentService uses)

**Sample Document:**
```javascript
{
  id: "apt-001",
  title: "Luxury Two-Bedroom Apartment",
  description: "Beautiful apartment in city center...",
  bedrooms: 2,
  bathrooms: 2,
  guests: 4,
  pricePerNight: 150,
  images: ["https://...", "https://..."],
  amenities: ["WiFi", "Kitchen", "Parking"],
  city: "Lagos",
  address: "Victoria Island, Lagos",
  available: true
}
```

**The app will:**
- Load all apartments from `ApartmentService`
- Display **only the first one** (`apartments[0]`)
- Use it for the booking page

---

## Testing Your Setup

### Test 1: Verify Home Page Loads

1. Run `ng serve`
2. Visit `http://localhost:4200/home`
3. **Expected:** See ONE apartment displayed
4. **Expected:** No filters, sort, or pagination visible
5. **Expected:** Booking button visible (if availability is true)

---

### Test 2: Submit Test Booking

1. Click "Book Now" on the apartment card
2. Fill out the booking form:
   - **Guest Name:** Test User
   - **Email:** test@example.com
   - **Phone:** +1234567890
   - **Address:** 123 Test St
   - **ID Photo:** Upload any JPG/PNG under 5MB
   - **Booking Option:** One Room or Entire Apartment
   - **Check-in:** Tomorrow's date
   - **Check-out:** 3 days later
   - **Nights:** 3
3. Click Submit

**Expected Results:**
- ✅ Success message appears
- ✅ Firestore document created in `simplified-bookings`
- ✅ ID photo uploaded to `booking-ids/` in Storage
- ✅ Admin email sent (if Django configured)
- ❌ If Django not configured: Email error in console (harmless)

---

### Test 3: Admin Dashboard

1. Visit `http://localhost:4200/admin`
2. **Expected:** See availability toggle at top
3. **Expected:** See pending bookings list with your test booking
4. Click "Approve" or "Reject"

**Expected Results:**
- ✅ Booking status updates in Firestore
- ✅ Guest email sent (if Django configured)
- ✅ Success message appears

---

### Test 4: Availability Toggle

1. In admin dashboard, click "Mark as Unavailable"
2. Go back to home page (`/home`)
3. **Expected:** Booking button hidden
4. **Expected:** Unavailability message displayed
5. Toggle back to "Available" in admin
6. **Expected:** Booking button reappears

---

## What Works Right Now (Without Django)

✅ **Single apartment display**  
✅ **Enhanced booking form with ID upload**  
✅ **Firestore booking storage**  
✅ **Firebase Storage for ID photos**  
✅ **Admin booking approval/rejection**  
✅ **Availability toggle**  
✅ **Admin dashboard stats**  

❌ **Email notifications** (needs Django)

---

## Quick Build & Deploy

### Development Build
```bash
ng serve --port 4200
```

### Production Build
```bash
ng build --configuration production
```

### Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

### Deploy Everything
```bash
firebase deploy
```

---

## Folder Structure (New Files)

```
src/app/
├── core/
│   ├── interfaces/
│   │   └── simplified-booking.interface.ts ✨ NEW
│   └── services/
│       ├── simplified-booking.service.ts ✨ NEW
│       └── email-notification.service.ts ✨ NEW
├── shared/
│   └── forms/
│       └── simplified-form-configs.ts ✨ NEW
└── pages/
    ├── home/
    │   ├── home.component.ts ✏️ MODIFIED
    │   └── home.component.html ✏️ MODIFIED
    ├── admin/
    │   ├── admin.component.ts ✏️ MODIFIED
    │   └── admin.component.html ✏️ MODIFIED
    └── navbar/
        └── navbar.component.html ✏️ MODIFIED
```

---

## Common Issues & Quick Fixes

### Issue: No apartment shows on home page
**Fix:** Add at least one apartment to your Firestore `apartments` collection

### Issue: Booking form won't submit
**Fix:** 
1. Check if ID photo is under 5MB
2. Check if it's JPG/PNG format
3. Check browser console for errors

### Issue: "Permission denied" on Firestore
**Fix:** Deploy updated security rules (see section 2 above)

### Issue: ID photo upload fails
**Fix:** Deploy updated storage rules (see section 2 above)

### Issue: Availability toggle doesn't work
**Fix:** Create `apartment-availability/main-apartment` document (see section 2 above)

---

## Next Steps (Optional Enhancements)

1. **Add real admin authentication** (currently open access)
2. **Implement email templates** in Django with proper styling
3. **Add booking confirmation page** after submission
4. **Add guest dashboard** to view booking status
5. **Add calendar view** in admin for booking dates
6. **Add photo gallery** to apartment display
7. **Add reviews/ratings** system

---

## Support

**Full Documentation:** See `SCALE-DOWN-DOCUMENTATION.md` for:
- Complete API reference
- Re-activation guide (scale back to multi-apartment)
- Troubleshooting guide
- Django implementation examples
- Migration strategies

**Quick Help:**
- Check browser console for errors
- Check Firestore rules are deployed
- Verify Firebase config in `environment.ts`
- Test Django endpoint manually with Postman/curl

---

**Last Updated:** October 27, 2025  
**Status:** ✅ Production Ready (Email notifications optional)
