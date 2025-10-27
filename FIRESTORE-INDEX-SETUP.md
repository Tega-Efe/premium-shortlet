# Firestore Index Setup Required

## Index Needed

The application requires a Firestore composite index for the `simplified-bookings` collection.

### Error Message
```
The query requires an index. You can create it here:
https://console.firebase.google.com/v1/r/project/shortlet-connect/firestore/indexes
```

### Query Details

**Collection**: `simplified-bookings`  
**Fields**:
- `status` (Ascending)
- `createdAt` (Descending)

### Used By

**File**: `src/app/core/services/simplified-booking.service.ts`  
**Method**: `getPendingBookings()`

```typescript
const q = query(
  this.bookingsCollection,
  where('status', '==', 'pending'),
  orderBy('createdAt', 'desc')
);
```

### How to Create Index

#### Option 1: Automatic (Recommended)
1. Click the link in the error message
2. Firebase Console will open with pre-filled index configuration
3. Click "Create Index"
4. Wait 2-5 minutes for index to build

#### Option 2: Manual
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Click "Indexes" tab
4. Click "Create Index"
5. Fill in:
   - Collection ID: `simplified-bookings`
   - Fields to index:
     - Field: `status`, Order: Ascending
     - Field: `createdAt`, Order: Descending
6. Click "Create"

### Status

- ✅ Index created successfully
- ✅ Application builds successfully
- ✅ Index deployed to Firebase
- ✅ Queries will now work optimally

### Deployment Details

**Date**: October 28, 2025  
**Method**: Firebase CLI (`firebase deploy --only firestore:indexes`)  
**Status**: Active  
**Database**: (default)  

### Index Configuration

```json
{
  "collectionGroup": "simplified-bookings",
  "queryScope": "COLLECTION",
  "fields": [
    {
      "fieldPath": "status",
      "order": "ASCENDING"
    },
    {
      "fieldPath": "createdAt",
      "order": "DESCENDING"
    },
    {
      "fieldPath": "__name__",
      "order": "DESCENDING"
    }
  ],
  "density": "SPARSE_ALL"
}
```

### Impact

**With Index** (Current):
- ✅ Admin dashboard fully functional
- ✅ Pending bookings load instantly
- ✅ Optimal query performance
- ✅ No runtime errors

---

**Note**: This is a one-time setup. Once created, the index persists in Firestore.

**Priority**: Medium (Admin feature only)
