# Database Reset and Reseed Guide

## Overview
This guide will help you clear the Firestore database and reseed it with updated data that includes proper `apartmentId` tracking for the automatic availability functionality.

## What Changed

### 1. **Booking Structure Updated**
- All bookings now include `apartmentId` field linking to specific apartments
- Bookings now include `apartmentTitle` for display purposes
- Guest info, booking details, and pricing are properly nested

### 2. **Apartment Availability Pre-populated**
- The seeded apartment includes pre-blocked dates for approved bookings
- Aisha Bello's booking (Nov 15-18) is in `bookedDates`
- Ibrahim Yusuf's booking (Dec 1-15) is in `bookedDates`

### 3. **Automatic Availability Tracking**
- When you approve a booking, the dates are automatically added to the apartment's `bookedDates`
- The booking form checks availability before allowing submissions
- Overlapping bookings are prevented

## Step-by-Step Database Reset

### Step 1: Clear Firestore Database

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select project: `shortlet-connect`

2. **Navigate to Firestore Database**
   - Click "Firestore Database" in the left sidebar
   - You should see your collections

3. **Delete Collections**
   Delete the following collections (click the 3 dots → Delete collection):
   - `apartments`
   - `simplified-bookings`
   - `apartment-availability`
   - `users` (if exists)

4. **Confirm Deletion**
   - Make sure all collections are completely removed
   - The database should be empty

### Step 2: Run the Seed Script

1. **Open PowerShell Terminal in VS Code**
   - Press `` Ctrl + ` `` to open terminal
   - Make sure you're in the project root directory

2. **Run the Seed Command**
   ```powershell
   npx ts-node scripts/seed-firestore.ts
   ```

3. **Verify Seeding Output**
   You should see output like:
   ```
   🌱 Starting Firestore seeding...

   📦 Creating two-bedroom apartment...
   ✅ Apartment created successfully!
      - Title: Luxury Two-Bedroom Apartment in Victoria Island
      - Price (One Room): ₦25,000/night
      - Price (Entire): ₦45,000/night
      - Location: Victoria Island, Lagos

   🏠 Creating apartment availability document...
   ✅ Availability document created!
      - Status: Available

   📅 Creating sample bookings...
      ✅ Booking 1/5: Chinedu Okonkwo (pending)
      ✅ Booking 2/5: Aisha Bello (approved)
      ✅ Booking 3/5: Emeka Nwosu (rejected)
      ✅ Booking 4/5: Funke Adeyemi (pending)
      ✅ Booking 5/5: Ibrahim Yusuf (approved)

   ✅ 5 sample bookings created!

   👤 Creating admin user...
   ✅ Admin user created!
   
   🎉 SEEDING COMPLETED SUCCESSFULLY!
   ```

### Step 3: Verify in Firebase Console

1. **Check Apartments Collection**
   - Go to Firestore → `apartments`
   - Find document: `main-apartment-001`
   - Verify fields:
     - `apartmentId`: `main-apartment-001`
     - `title`: Present
     - `availability.bookedDates`: Should have 2 entries (Nov 15-18, Dec 1-15)
     - `availability.isAvailable`: `true`

2. **Check Simplified Bookings Collection**
   - Go to `simplified-bookings`
   - You should see 5 bookings
   - Each booking should have:
     - `apartmentId`: `main-apartment-001`
     - `apartmentTitle`: `Luxury Two-Bedroom Apartment in Victoria Island`
     - `guestInfo`: Nested object with name, email, phone, address
     - `bookingDetails`: Nested object with dates and options
     - `pricing`: Nested object
     - `status`: pending, approved, or rejected

3. **Check Apartment Availability Collection**
   - Go to `apartment-availability`
   - Find document: `main-apartment`
   - Verify `isAvailable`: `true`

### Step 4: Test Automatic Availability

#### Test 1: View Approved Bookings in Admin Dashboard
1. Navigate to: http://localhost:4200/admin
2. Go to "All Bookings" tab
3. You should see:
   - 2 approved bookings (Aisha Bello, Ibrahim Yusuf)
   - 2 pending bookings (Chinedu Okonkwo, Funke Adeyemi)
   - 1 rejected booking (Emeka Nwosu)

#### Test 2: Try to Book Blocked Dates
1. Navigate to: http://localhost:4200/home
2. Select the apartment
3. Try to book dates that overlap with Nov 15-18 (should be blocked)
4. Try to book dates that overlap with Dec 1-15 (should be blocked)
5. The form should prevent you from submitting or show an error

#### Test 3: Approve a Pending Booking
1. Go to Admin Dashboard → Pending Bookings
2. Approve "Chinedu Okonkwo" booking (Nov 5-10)
3. After approval, check Firebase Console:
   - Go to `apartments/main-apartment-001`
   - Check `availability.bookedDates`
   - You should now see **3 date ranges** (including Nov 5-10)

#### Test 4: Try to Book Newly Blocked Dates
1. Go back to Home page
2. Try to book Nov 5-10 (should now be blocked)
3. The system should prevent the booking

#### Test 5: Book Available Dates
1. Try to book dates like Nov 1-4 (before any blocked dates)
2. Or book Jan 2026 dates (after all blocked dates)
3. These should work fine and create a pending booking

### Step 5: Verify Manage Listings

1. **Go to Admin Dashboard → Manage Listings**
2. Click on the apartment card
3. You should see the availability calendar showing:
   - Blocked dates (Nov 15-18, Dec 1-15)
   - After approving Chinedu's booking: Nov 5-10 should also show as blocked
4. The apartment should show as "Available" but with specific dates blocked

## Troubleshooting

### Issue: Seed Script Fails
**Solution:**
- Make sure you deleted all collections first
- Check Firebase credentials in the seed script
- Verify internet connection

### Issue: Bookings Don't Have apartmentId
**Solution:**
- Make sure you ran the updated seed script
- Check that you cleared the database completely before reseeding

### Issue: Dates Not Blocking After Approval
**Solution:**
- Check browser console for errors
- Verify the booking has a valid `apartmentId`
- Check that the apartment document exists in Firestore
- Make sure the `blockApartmentDates()` method is being called in the approval flow

### Issue: Can Still Book Blocked Dates
**Solution:**
- Verify that `checkApartmentAvailabilityForDates()` is called before creating bookings
- Check that the apartment's `bookedDates` array is populated
- Ensure date overlap logic is working correctly

## Summary of Fixed Issues

✅ **apartmentId Field**: All bookings now have apartmentId linking to specific apartments
✅ **Apartment Title**: Automatically populated from apartment document
✅ **Nested Structure**: Bookings use proper nested structure (guestInfo, bookingDetails, pricing)
✅ **Pre-seeded Booked Dates**: Apartment includes dates for approved bookings
✅ **Automatic Date Blocking**: Approving a booking adds dates to apartment's bookedDates
✅ **Availability Checking**: Booking form validates against booked and blackout dates
✅ **Interface Consolidation**: ApartmentListing is now just a type alias for Apartment

## Next Steps

After successful reset and testing:
1. Delete test bookings if needed
2. Add real apartment data
3. Configure admin authentication
4. Test email notifications
5. Deploy to production

---

**Last Updated**: October 29, 2025
**Script Version**: Updated with apartmentId tracking
