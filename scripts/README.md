# Firestore Database Cleanup Script

This script helps you identify and fix incomplete bookings in your Firestore database.

## Prerequisites

Make sure you have `ts-node` installed (already in devDependencies).

## Usage

### 1. Analyze Database (Recommended First Step)

This will scan all bookings and report which ones are incomplete **without making any changes**:

```bash
npm run cleanup:analyze
```

**What it does:**
- ✅ Scans all bookings in Firestore
- 📊 Shows detailed report of valid vs incomplete bookings
- 🔍 Lists exactly what's missing from each incomplete booking
- 💡 Provides recommendations for next steps

**Example Output:**
```
📋 Booking ID: abc12345...
   Status: pending
   Created: 10/28/2025, 2:30:45 PM
   ⚠️  Incomplete booking detected:
      - Missing: pricing
      - Missing: guestInfo.phone

📊 CLEANUP SUMMARY
──────────────────────────────────────────────────────────
Total Bookings:      10
Valid Bookings:      7 ✅
Incomplete Bookings: 3 ⚠️
```

---

### 2. Attempt Automatic Fixes

This will try to fix incomplete bookings automatically:

```bash
npm run cleanup:fix
```

**What it does:**
- 🔧 Adds missing `pricing` field (calculates based on booking option and nights)
- 🔧 Sets default `status` to 'pending' if missing
- 🔧 Adds `createdAt` timestamp if missing
- ❌ **Cannot fix** bookings missing critical data like `guestInfo` or `bookingDetails`

**Example Output:**
```
📋 Booking ID: abc12345...
   ⚠️  Incomplete booking detected:
      - Missing: pricing

   🔧 Attempting to fix...
   ✓ Adding pricing: ₦50,000
   ✓ Setting default status: pending

📊 CLEANUP SUMMARY
──────────────────────────────────────────────────────────
Fixed Bookings:      2 🔧
Could Not Fix:       1 ❌
```

---

### 3. Delete Unfixable Bookings

**⚠️ WARNING: This permanently deletes bookings from Firestore!**

Use this only after reviewing the analysis and attempting fixes:

```bash
npm run cleanup:delete
```

**What it does:**
- 🗑️ Permanently deletes all bookings that don't have complete data
- ✅ Keeps all valid bookings
- 📊 Shows summary of deletions

**Example Output:**
```
📋 Booking ID: xyz98765...
   ⚠️  Incomplete booking detected:
      - Missing: guestInfo

   🗑️  Deleting incomplete booking...
   ✓ Deleted incomplete booking

📊 CLEANUP SUMMARY
──────────────────────────────────────────────────────────
Deleted Bookings:    1 🗑️
```

---

## Required Fields

For a booking to be considered **valid**, it must have:

### Guest Info
- ✅ `guestInfo.name`
- ✅ `guestInfo.email`
- ✅ `guestInfo.phone`
- ✅ `guestInfo.address`

### Booking Details
- ✅ `bookingDetails.bookingOption` ('one-room' | 'entire-apartment')
- ✅ `bookingDetails.checkInDate`
- ✅ `bookingDetails.checkOutDate`
- ✅ `bookingDetails.numberOfNights`
- ✅ `bookingDetails.numberOfGuests`

### Pricing
- ✅ `pricing.pricePerNight` (number)
- ✅ `pricing.totalPrice` (number)

### Status
- ✅ `status` ('pending' | 'approved' | 'rejected')

---

## Recommended Workflow

1. **First**, run analyze to see what's wrong:
   ```bash
   npm run cleanup:analyze
   ```

2. **Then**, try automatic fixes:
   ```bash
   npm run cleanup:fix
   ```

3. **Finally**, if needed, delete unfixable bookings:
   ```bash
   npm run cleanup:delete
   ```

4. **Verify** by running analyze again:
   ```bash
   npm run cleanup:analyze
   ```

---

## What Gets Fixed Automatically

| Missing Field | Fix Applied |
|---------------|-------------|
| `pricing` | ✅ Calculated from booking option and nights |
| `status` | ✅ Set to 'pending' |
| `createdAt` | ✅ Set to current timestamp |
| `guestInfo` | ❌ Cannot fix - will be deleted |
| `bookingDetails` | ❌ Cannot fix - will be deleted |

---

## Safety Features

- ✅ **Analyze mode** never modifies data
- ✅ **Fix mode** only updates, never deletes
- ✅ **Detailed logging** shows exactly what's happening
- ✅ **Summary reports** at the end of each run
- ✅ **Error handling** prevents partial updates

---

## Troubleshooting

### Error: "Cannot find module 'firebase'"
```bash
npm install
```

### Error: "Permission denied"
Make sure you're logged into Firebase:
```bash
firebase login
```

### Script hangs or times out
Your database might be very large. The script processes all bookings sequentially for safety.

---

## After Cleanup

Once your database is clean:
1. ✅ All bookings will display correctly in the admin panel
2. ✅ No more "undefined" errors
3. ✅ Data integrity is maintained
4. ✅ Future bookings will follow the correct structure

---

## Technical Details

**Script Location:** `scripts/cleanup-bookings.ts`

**Dependencies:**
- Firebase Admin SDK (via `firebase` package)
- TypeScript (`ts-node` for execution)

**Database:** 
- Collection: `simplified-bookings`
- Mode: Client SDK (uses your Firebase config)

**Safe to run multiple times:** Yes, the script is idempotent.
