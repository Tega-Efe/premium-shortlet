# Testing Guide - Admin Panel Fixes

## What Was Fixed

### 1. Hide/Show Modal Not Opening
- Added `this.hideDurationModal.openModal()` call when hiding apartment
- Fixed ngModel binding for signals

### 2. Date Overlap Detection
- Added comprehensive console logging to trace the entire flow
- Enhanced date normalization in overlap detection

---

## How to Test

### Test 1: Hide/Show Functionality

#### Steps:
1. **Open Admin Dashboard**
   - Navigate to `/admin`
   - Click on "Manage Availability" button

2. **Test "Hide Now" Option**
   - Click "Hide" button on an available apartment
   - **EXPECTED**: Modal should open with title "Hide [Apartment Name]"
   - Click "Hide Now" button in the left section
   - **EXPECTED**: 
     - Success notification: "Apartment is now hidden"
     - Modal closes
     - Apartment status changes to "Unavailable"
     - "Hide" button becomes "Show" button

3. **Test "Hide for Duration" Option**
   - Click "Hide" on another apartment (or "Show" then "Hide" the same one)
   - In the modal, enter:
     - Number of Days: `7`
     - Reason: `Maintenance`
   - **EXPECTED**: 
     - Text should appear: "Will become available again on: [Date 7 days from now]"
     - Click "Hide for 7 Days" button
     - Success notification
     - Modal closes
     - Apartment marked as unavailable

4. **Test "Show" Functionality**
   - Click "Show" on a hidden apartment
   - **EXPECTED**:
     - Success notification: "Apartment is now available"
     - Status changes to "Available"

---

### Test 2: Booking Date Conflict Detection

Open your browser's **Developer Console** (F12) to see the detailed logs.

#### Scenario 1: Create First Booking (No Conflict)

1. **Create a booking for Dec 5-8**:
   - Go to homepage (`/home`)
   - Select apartment
   - Choose dates: Dec 5 to Dec 8
   - Fill in guest details
   - Submit booking

2. **Approve the booking**:
   - Go to Admin Dashboard
   - Find the pending booking
   - Click "Approve"
   - **CHECK CONSOLE**: Should see logs like:
     ```
     🔒 Blocking apartment dates: { apartmentId: "...", checkInDate: "2025-12-05", checkOutDate: "2025-12-08" }
     📅 Updating booked dates: { existingCount: 0, newCount: 1, ... }
     ✅ Apartment dates blocked successfully
     ```

#### Scenario 2: Try Overlapping Booking (Should Fail)

1. **Try to book Dec 4-7** (overlaps with Dec 5-8):
   - Go to homepage
   - Select same apartment
   - Choose dates: Dec 4 to Dec 7
   - Fill details and submit

2. **CHECK CONSOLE**: You should see:
   ```
   🔍 Checking availability: {
     apartmentId: "...",
     requestedCheckIn: "2025-12-04T00:00:00.000Z",
     requestedCheckOut: "2025-12-07T00:00:00.000Z",
     bookedDatesCount: 1
   }
   📅 Checking against booked range: {
     bookedStart: "2025-12-05T00:00:00.000Z",
     bookedEnd: "2025-12-08T00:00:00.000Z"
   }
   🔍 Overlap check: {
     range1: { start: "2025-12-04", end: "2025-12-07" },
     range2: { start: "2025-12-05", end: "2025-12-08" },
     overlaps: true,
     logic: "..."
   }
   ❌ OVERLAP DETECTED with booked dates!
   ```

3. **EXPECTED RESULT**: 
   - Error message: "Apartment is not available for the selected dates"
   - Booking should NOT be created

#### Scenario 3: Valid Non-Overlapping Booking (Should Succeed)

1. **Try to book Dec 9-12** (no overlap with Dec 5-8):
   - Select dates: Dec 9 to Dec 12
   - Submit booking

2. **CHECK CONSOLE**: Should see:
   ```
   🔍 Checking availability: { ... }
   📅 Checking against booked range: { ... }
   🔍 Overlap check: { ..., overlaps: false }
   ✅ Apartment is available for requested dates
   ```

3. **EXPECTED RESULT**: 
   - Booking created successfully
   - Status: Pending

---

## Test Cases Summary

### Valid Bookings (Should Succeed ✅):
| Existing Booking | New Booking | Expected |
|-----------------|-------------|----------|
| Dec 5-8 | Dec 1-4 | ✅ ALLOWED (ends before) |
| Dec 5-8 | Dec 9-12 | ✅ ALLOWED (starts after) |
| Dec 5-8 | Dec 1-5 | ✅ ALLOWED (back-to-back, checkout = checkin) |
| Dec 5-8 | Dec 8-11 | ✅ ALLOWED (back-to-back, checkout = checkin) |
| None | Any dates | ✅ ALLOWED (first booking) |

### Invalid Bookings (Should Fail ❌):
| Existing Booking | New Booking | Why Invalid |
|-----------------|-------------|-------------|
| Dec 5-8 | Dec 4-7 | ❌ BLOCKED (overlaps Dec 5-7) |
| Dec 5-8 | Dec 6-9 | ❌ BLOCKED (overlaps Dec 6-8) |
| Dec 5-8 | Dec 3-10 | ❌ BLOCKED (encompasses existing) |
| Dec 5-8 | Dec 6-7 | ❌ BLOCKED (within existing) |
| Dec 5-8 | Dec 5-8 | ❌ BLOCKED (exact same dates) |

---

## Understanding the Console Logs

### When Checking Availability:
```
🔍 Checking availability: {...}       // Starting check
  📅 Checking against booked range     // Comparing with each booked range
    🔍 Overlap check: {...}            // Detailed overlap calculation
    ❌ OVERLAP DETECTED                // Found conflict
✅ Apartment is available              // No conflicts found
```

### When Approving Booking:
```
🔒 Blocking apartment dates: {...}    // Starting to block dates
📅 Updating booked dates: {...}        // Adding new dates to array
✅ Apartment dates blocked successfully // Success
```

---

## Troubleshooting

### If Hide Modal Still Not Opening:

1. **Check Console for Errors**:
   - Look for JavaScript errors
   - Check if `hideDurationModal` is undefined

2. **Verify Modal Component**:
   - Ensure `<app-modal #hideDurationModal>` exists in HTML
   - Check that `@ViewChild('hideDurationModal')` is in component

3. **Test Manually**:
   ```typescript
   // In browser console:
   angular.getComponent(document.querySelector('app-admin')).hideDurationModal
   // Should not be undefined
   ```

### If Date Conflicts Not Detected:

1. **Check Console Logs**:
   - Are you seeing the `🔍 Checking availability` logs?
   - Is `bookedDatesCount` showing the correct number?
   - Does the overlap check show `overlaps: true`?

2. **Verify Apartment Has Booked Dates**:
   - Go to Firestore console
   - Find your apartment document
   - Check `availability.bookedDates` array
   - Should contain objects like:
     ```json
     {
       "start": { "_seconds": 1733356800, "_nanoseconds": 0 },
       "end": { "_seconds": 1733616000, "_nanoseconds": 0 }
     }
     ```

3. **Check Date Format**:
   - Dates should be stored as Firestore Timestamps or Date objects
   - NOT as strings like "Dec 5, 2025"

### If Bookings Approved But Dates Not Blocked:

1. **Check Console for**:
   ```
   🔒 Blocking apartment dates: {...}
   ✅ Apartment dates blocked successfully
   ```

2. **If you see errors**:
   - Check Firestore permissions
   - Verify apartment ID is correct
   - Ensure apartment document exists

---

## Quick Diagnostic Checklist

- [ ] Modal opens when clicking "Hide"
- [ ] "Hide Now" button works
- [ ] "Hide for Duration" accepts input
- [ ] Number of days field updates the future date display
- [ ] "Show" button makes apartment available again
- [ ] Console shows availability check logs
- [ ] First booking creates without issues
- [ ] Second overlapping booking is rejected with error message
- [ ] Console shows "OVERLAP DETECTED" for conflicting dates
- [ ] Non-overlapping booking succeeds
- [ ] Approved bookings appear in `availability.bookedDates` in Firestore

---

## Next Steps After Testing

1. **If everything works**: Remove the console.log statements for production
2. **If issues persist**: Share the console logs with the detailed error messages
3. **Consider adding**: User-friendly error messages explaining why dates are unavailable

---

## Production Cleanup (Once Everything Works)

Remove these console.log statements from:
- `simplified-booking.service.ts` - All the 🔍, 📅, ✅, ❌ logs
- Keep error logs (`console.error`) for debugging production issues
