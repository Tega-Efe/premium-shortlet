# Firestore Test Data Setup Guide

This guide will help you populate your Firestore database with test data for the single-apartment booking system.

---

## Option 1: Manual Import via Firebase Console (EASIEST)

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Firestore Database** in the left menu

### Step 2: Create Collections and Documents

#### A. Create Apartment
1. Click **Start collection**
2. Collection ID: `apartments`
3. Click **Next**
4. Document ID: `main-apartment-001`
5. Add these fields (click **Add field** for each):

```
Field Name          | Type    | Value
--------------------|---------|------------------------------------------
id                  | string  | main-apartment-001
title               | string  | Luxury Two-Bedroom Apartment in Victoria Island
description         | string  | Experience luxury living... (copy from test-data.json)
bedrooms            | number  | 2
bathrooms           | number  | 2
guests              | number  | 4
pricePerNight       | number  | 35000
availability        | boolean | true
featured            | boolean | true
verified            | boolean | true
rating              | number  | 4.8
totalReviews        | number  | 127
createdAt           | string  | 2025-10-27T10:00:00.000Z
updatedAt           | string  | 2025-10-27T10:00:00.000Z
```

6. Add **images** (array):
   - Click **Add field** → Name: `images`, Type: `array`
   - Add these URLs as array elements:
     ```
     https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800
     https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800
     https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800
     https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800
     https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800
     https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800
     ```

7. Add **amenities** (array):
   ```
   WiFi
   Air Conditioning
   Kitchen
   TV
   Parking
   Security
   Generator
   Swimming Pool
   Gym
   Elevator
   Balcony
   Washer/Dryer
   ```

8. Add **location** (map):
   - Click **Add field** → Name: `location`, Type: `map`
   - Add nested fields:
     ```
     city        | string | Lagos
     state       | string | Lagos
     country     | string | Nigeria
     address     | string | Victoria Island, Lagos
     coordinates | map    | { lat: 6.4281, lng: 3.4219 }
     ```

9. Add **pricing** (map):
   ```
   oneRoomPerNight          | number | 20000
   entireApartmentPerNight  | number | 35000
   weeklyDiscount           | number | 10
   monthlyDiscount          | number | 25
   cleaningFee              | number | 5000
   securityDeposit          | number | 50000
   ```

10. Add **houseRules** (array):
    ```
    No smoking inside the apartment
    No parties or events
    Quiet hours: 10 PM - 7 AM
    Maximum 4 guests
    Pets not allowed
    Check-in: 2:00 PM - 10:00 PM
    Check-out: 12:00 PM
    ```

11. Add **owner** (map):
    ```
    id       | string  | owner-001
    name     | string  | Shortlet Connect
    email    | string  | admin@shortletconnect.com
    phone    | string  | +234 809 123 4567
    verified | boolean | true
    ```

12. Click **Save**

---

#### B. Create Availability Document
1. Click **Start collection** (or add to existing)
2. Collection ID: `apartment-availability`
3. Document ID: `main-apartment`
4. Add fields:

```
Field Name            | Type    | Value
----------------------|---------|----------------------------------
isAvailable           | boolean | true
unavailableMessage    | null    | null
lastUpdated           | string  | 2025-10-27T10:00:00.000Z
updatedBy             | string  | System
```

5. Click **Save**

---

#### C. Create Sample Bookings
1. Click **Start collection**
2. Collection ID: `simplified-bookings`
3. Click **Auto-ID** for document ID
4. Add fields for first booking:

**Booking 1 (Pending):**
```
Field Name        | Type    | Value
------------------|---------|----------------------------------
guestName         | string  | Chinedu Okonkwo
guestEmail        | string  | chinedu.okonkwo@email.com
guestPhone        | string  | +234 803 456 7890
address           | string  | 45 Admiralty Way, Lekki Phase 1, Lagos, Nigeria
bookingOption     | string  | entire-apartment
checkInDate       | string  | 2025-11-05
checkOutDate      | string  | 2025-11-10
numberOfNights    | number  | 5
status            | string  | pending
idPhotoUrl        | null    | null
idPhotoPath       | null    | null
createdAt         | string  | 2025-10-25T10:30:00.000Z
updatedAt         | string  | 2025-10-25T10:30:00.000Z
approvedBy        | null    | null
rejectedBy        | null    | null
rejectionReason   | null    | null
```

5. Click **Save**
6. Repeat for other bookings (see test-data.json for details)

---

## Option 2: Use Firebase CLI Import (FASTER)

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Logged in: `firebase login`

### Steps
1. Open PowerShell in project directory
2. Run:
```powershell
firebase firestore:import scripts/test-data.json --project your-project-id
```

**Note:** This method requires formatting the JSON as Firestore export format. The manual method above is simpler for initial setup.

---

## Option 3: Run TypeScript Seeding Script

### Prerequisites
- `ts-node` installed: `npm install -g ts-node`
- Firebase config updated in `scripts/seed-firestore.ts`

### Steps

1. **Update Firebase Config** in `scripts/seed-firestore.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

2. **Install Dependencies:**
   ```powershell
   npm install firebase
   ```

3. **Run the Script:**
   ```powershell
   npx ts-node scripts/seed-firestore.ts
   ```

4. **Expected Output:**
   ```
   🌱 Starting Firestore seeding...
   
   📦 Creating two-bedroom apartment...
   ✅ Apartment created successfully!
      - Title: Luxury Two-Bedroom Apartment in Victoria Island
      - Price: ₦35,000/night
      - Location: Victoria Island, Lagos
   
   🏠 Creating apartment availability document...
   ✅ Availability document created!
      - Status: Available
   
   📅 Creating sample bookings...
      ✅ Booking 1/5: Chinedu Okonkwo (pending)
         - Dates: 2025-11-05 to 2025-11-10
         - Option: entire-apartment
      ✅ Booking 2/5: Aisha Bello (approved)
      ...
   
   🎉 SEEDING COMPLETED SUCCESSFULLY!
   ```

---

## Quick Verification

After adding the data, verify it's working:

### 1. Check Firestore Console
- Go to Firestore Database
- Should see collections:
  - ✅ `apartments` (1 document)
  - ✅ `apartment-availability` (1 document)
  - ✅ `simplified-bookings` (5 documents)
  - ✅ `users` (1 document)

### 2. Test the Application
```powershell
ng serve --port 4200
```

Visit `http://localhost:4200/home`:
- ✅ See the two-bedroom apartment displayed
- ✅ Click "Book Now" - booking form should appear
- ✅ All form fields present (including ID upload)

Visit `http://localhost:4200/admin`:
- ✅ See availability toggle at top
- ✅ See 2 pending bookings
- ✅ See 2 approved bookings
- ✅ See 1 rejected booking
- ✅ Stats should show: Total: 5, Pending: 2

---

## Test Data Summary

### Apartment
- **Type:** Two-bedroom luxury apartment
- **Location:** Victoria Island, Lagos
- **Price:** ₦35,000/night (entire), ₦20,000/night (one room)
- **Features:** 6 high-quality images, 12 amenities
- **Rating:** 4.8/5.0 (127 reviews)

### Bookings (5 total)
1. **Chinedu Okonkwo** - Pending - Nov 5-10 (5 nights, entire apartment)
2. **Aisha Bello** - Approved - Nov 15-18 (3 nights, one room)
3. **Emeka Nwosu** - Rejected - Oct 28-30 (2 nights, entire apartment)
4. **Funke Adeyemi** - Pending - Nov 20-27 (7 nights, one room)
5. **Ibrahim Yusuf** - Approved - Dec 1-15 (14 nights, entire apartment)

### Admin User
- **Email:** admin@shortletconnect.com
- **Role:** admin
- **Permissions:** manage_bookings, manage_availability, view_analytics

---

## Troubleshooting

### Issue: "Collection not found"
**Fix:** Make sure you created the exact collection names:
- `apartments` (not "apartment")
- `apartment-availability` (with hyphen)
- `simplified-bookings` (not "bookings")

### Issue: "Apartment not showing on home page"
**Fix:** 
1. Check document ID is `main-apartment-001`
2. Verify `availability` field is `true`
3. Check browser console for errors

### Issue: "Firestore permission denied"
**Fix:** Deploy security rules:
```powershell
firebase deploy --only firestore:rules
```

---

## Next Steps

After adding test data:

1. ✅ Test home page displays apartment
2. ✅ Test booking form submission (with ID upload)
3. ✅ Test admin dashboard (approve/reject bookings)
4. ✅ Test availability toggle
5. ✅ Configure Django email API (optional)
6. 🚀 Deploy to production!

---

**For detailed test data values, see:** `scripts/test-data.json`  
**For automated seeding, use:** `scripts/seed-firestore.ts`

---

**Last Updated:** October 27, 2025  
**Status:** Ready for Testing
