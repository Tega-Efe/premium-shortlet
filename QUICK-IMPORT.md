# Quick Firestore Import Instructions

## EASIEST METHOD: Copy & Paste in Firebase Console

### 1. Create Apartment (2 minutes)

**Go to:** Firebase Console → Firestore Database → Start collection

**Collection ID:** `apartments`  
**Document ID:** `main-apartment-001`

**Copy this and paste as JSON:**
```json
{
  "id": "main-apartment-001",
  "title": "Luxury Two-Bedroom Apartment in Victoria Island",
  "description": "Experience luxury living in this stunning two-bedroom apartment located in the heart of Victoria Island, Lagos. Perfect for business travelers, families, or couples. Features modern furniture, fully equipped kitchen, WiFi, and 24/7 security.",
  "bedrooms": 2,
  "bathrooms": 2,
  "guests": 4,
  "pricePerNight": 35000,
  "images": [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800"
  ],
  "amenities": ["WiFi", "Air Conditioning", "Kitchen", "TV", "Parking", "Security", "Generator", "Pool", "Gym"],
  "city": "Lagos",
  "availability": true,
  "featured": true,
  "rating": 4.8,
  "totalReviews": 127
}
```

---

### 2. Create Availability (30 seconds)

**Collection ID:** `apartment-availability`  
**Document ID:** `main-apartment`

**Paste this:**
```json
{
  "isAvailable": true,
  "unavailableMessage": null,
  "lastUpdated": "2025-10-27T10:00:00.000Z",
  "updatedBy": "System"
}
```

---

### 3. Create Test Bookings (2 minutes)

**Collection ID:** `simplified-bookings`  
**Document ID:** Auto-ID (let Firebase generate)

**Paste each booking separately (click "Add document" for each):**

**Booking 1 (Pending):**
```json
{
  "guestName": "Chinedu Okonkwo",
  "guestEmail": "chinedu.okonkwo@email.com",
  "guestPhone": "+234 803 456 7890",
  "address": "45 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  "bookingOption": "entire-apartment",
  "checkInDate": "2025-11-05",
  "checkOutDate": "2025-11-10",
  "numberOfNights": 5,
  "status": "pending",
  "createdAt": "2025-10-25T10:30:00.000Z",
  "updatedAt": "2025-10-25T10:30:00.000Z"
}
```

**Booking 2 (Pending):**
```json
{
  "guestName": "Funke Adeyemi",
  "guestEmail": "funke.adeyemi@email.com",
  "guestPhone": "+234 809 012 3456",
  "address": "23 Allen Avenue, Ikeja, Lagos, Nigeria",
  "bookingOption": "one-room",
  "checkInDate": "2025-11-20",
  "checkOutDate": "2025-11-27",
  "numberOfNights": 7,
  "status": "pending",
  "createdAt": "2025-10-26T08:15:00.000Z",
  "updatedAt": "2025-10-26T08:15:00.000Z"
}
```

---

## ✅ Done! Test Your Application

```powershell
ng serve --port 4200
```

**Visit:** http://localhost:4200/home
- Should see the apartment
- Click "Book Now" to test booking form

**Visit:** http://localhost:4200/admin
- Should see 2 pending bookings
- Test approve/reject buttons
- Test availability toggle

---

## If You Want More Test Data

Add these additional bookings (approved & rejected) using the same method:

**Booking 3 (Approved):**
```json
{
  "guestName": "Aisha Bello",
  "guestEmail": "aisha.bello@email.com",
  "guestPhone": "+234 805 678 9012",
  "address": "12 Ogudu Road, Ojota, Lagos, Nigeria",
  "bookingOption": "one-room",
  "checkInDate": "2025-11-15",
  "checkOutDate": "2025-11-18",
  "numberOfNights": 3,
  "status": "approved",
  "approvedBy": "Admin User",
  "createdAt": "2025-10-20T14:20:00.000Z",
  "updatedAt": "2025-10-21T09:15:00.000Z"
}
```

**Booking 4 (Rejected):**
```json
{
  "guestName": "Emeka Nwosu",
  "guestEmail": "emeka.nwosu@email.com",
  "guestPhone": "+234 807 890 1234",
  "address": "78 Herbert Macaulay Street, Yaba, Lagos, Nigeria",
  "bookingOption": "entire-apartment",
  "checkInDate": "2025-10-28",
  "checkOutDate": "2025-10-30",
  "numberOfNights": 2,
  "status": "rejected",
  "rejectedBy": "Admin User",
  "rejectionReason": "Dates already booked",
  "createdAt": "2025-10-18T16:45:00.000Z",
  "updatedAt": "2025-10-19T11:30:00.000Z"
}
```

---

**Total Setup Time:** ~5 minutes  
**Collections Created:** 3 (apartments, apartment-availability, simplified-bookings)  
**Documents Created:** 5+ (1 apartment, 1 availability, 3+ bookings)
