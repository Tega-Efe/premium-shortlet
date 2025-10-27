/**
 * Firestore Database Seeding Script
 * 
 * This script populates Firestore with test data for the single-apartment booking system:
 * - One two-bedroom apartment
 * - Apartment availability document
 * - Sample booking data
 * - Admin user data
 * 
 * Run with: npx ts-node scripts/seed-firestore.ts
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc,
  Timestamp 
} from 'firebase/firestore';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIS034JeQMWf9iT0WuBuVjuVyxc3sDRu4",
  authDomain: "shortlet-connect.firebaseapp.com",
  projectId: "shortlet-connect",
  storageBucket: "shortlet-connect.firebasestorage.app",
  messagingSenderId: "605241409683",
  appId: "1:605241409683:web:68fffdf1da9f09b4384d66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==================== APARTMENT DATA ====================

const twoBedroomApartment = {
  id: 'main-apartment-001',
  title: 'Luxury Two-Bedroom Apartment in Victoria Island',
  description: `Experience luxury living in this stunning two-bedroom apartment located in the heart of Victoria Island, Lagos. 

This beautifully furnished apartment features:
- Spacious living room with modern furniture
- Fully equipped kitchen with premium appliances
- Two comfortable bedrooms with king-size beds
- Two bathrooms with hot water showers
- High-speed WiFi and Smart TV
- 24/7 security and power backup
- Dedicated parking space
- Access to swimming pool and gym

Perfect for business travelers, families, or couples looking for a comfortable short-term stay in Lagos. The apartment is within walking distance to restaurants, shopping centers, and business districts.

Book the entire apartment or just one room - flexible options to suit your needs!`,
  
  // Location (nested object matching Apartment interface)
  location: {
    address: 'Victoria Island, Lagos',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    coordinates: {
      latitude: 6.4281,
      longitude: 3.4219
    },
    landmarks: [
      'Eko Hotel & Suites',
      'The Palms Shopping Mall',
      'Federal Palace Hotel'
    ]
  },
  
  // Pricing (nested object matching Apartment interface)
  pricing: {
    basePrice: 35000, // ₦35,000 per night for entire apartment
    currency: 'NGN',
    period: 'night',
    discounts: [
      {
        type: 'extended_stay',
        percentage: 10,
        minDays: 7
      },
      {
        type: 'extended_stay',
        percentage: 25,
        minDays: 30
      }
    ]
  },
  
  // Specifications (nested object matching Apartment interface)
  specifications: {
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    squareMeters: 120,
    floors: 1
  },
  
  // Amenities array
  amenities: [
    'WiFi',
    'Air Conditioning',
    'Kitchen',
    'TV',
    'Parking',
    'Security',
    'Generator',
    'Swimming Pool',
    'Gym',
    'Elevator',
    'Balcony',
    'Washer/Dryer'
  ],
  
  // Images array
  images: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800',
    'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800'
  ],
  
  // Availability (nested object matching Apartment interface)
  availability: {
    status: 'available',
    bookedDates: [],
    blackoutDates: []
  },
  
  // Rating (nested object matching Apartment interface)
  rating: {
    average: 4.8,
    count: 127,
    breakdown: {
      cleanliness: 4.9,
      accuracy: 4.7,
      communication: 4.8,
      location: 4.9,
      value: 4.7
    }
  },
  
  featured: true,
  verified: true,
  
  createdAt: new Date(),
  updatedAt: new Date()
};

// ==================== APARTMENT AVAILABILITY ====================

const apartmentAvailability = {
  isAvailable: true,
  unavailableMessage: null,
  lastUpdated: new Date().toISOString(),
  updatedBy: 'System'
};

// ==================== SAMPLE BOOKINGS ====================

const sampleBookings = [
  {
    guestName: 'Chinedu Okonkwo',
    guestEmail: 'chinedu.okonkwo@email.com',
    guestPhone: '+234 803 456 7890',
    address: '45 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
    bookingOption: 'entire-apartment',
    checkInDate: '2025-11-05',
    checkOutDate: '2025-11-10',
    numberOfNights: 5,
    status: 'pending',
    idPhotoUrl: null,
    idPhotoPath: null,
    createdAt: new Date('2025-10-25T10:30:00').toISOString(),
    updatedAt: new Date('2025-10-25T10:30:00').toISOString(),
    approvedBy: null,
    rejectedBy: null,
    rejectionReason: null
  },
  {
    guestName: 'Aisha Bello',
    guestEmail: 'aisha.bello@email.com',
    guestPhone: '+234 805 678 9012',
    address: '12 Ogudu Road, Ojota, Lagos, Nigeria',
    bookingOption: 'one-room',
    checkInDate: '2025-11-15',
    checkOutDate: '2025-11-18',
    numberOfNights: 3,
    status: 'approved',
    idPhotoUrl: null,
    idPhotoPath: null,
    createdAt: new Date('2025-10-20T14:20:00').toISOString(),
    updatedAt: new Date('2025-10-21T09:15:00').toISOString(),
    approvedBy: 'Admin User',
    approvedAt: new Date('2025-10-21T09:15:00').toISOString(),
    rejectedBy: null,
    rejectionReason: null
  },
  {
    guestName: 'Emeka Nwosu',
    guestEmail: 'emeka.nwosu@email.com',
    guestPhone: '+234 807 890 1234',
    address: '78 Herbert Macaulay Street, Yaba, Lagos, Nigeria',
    bookingOption: 'entire-apartment',
    checkInDate: '2025-10-28',
    checkOutDate: '2025-10-30',
    numberOfNights: 2,
    status: 'rejected',
    idPhotoUrl: null,
    idPhotoPath: null,
    createdAt: new Date('2025-10-18T16:45:00').toISOString(),
    updatedAt: new Date('2025-10-19T11:30:00').toISOString(),
    approvedBy: null,
    rejectedBy: 'Admin User',
    rejectedAt: new Date('2025-10-19T11:30:00').toISOString(),
    rejectionReason: 'Dates already booked by another guest'
  },
  {
    guestName: 'Funke Adeyemi',
    guestEmail: 'funke.adeyemi@email.com',
    guestPhone: '+234 809 012 3456',
    address: '23 Allen Avenue, Ikeja, Lagos, Nigeria',
    bookingOption: 'one-room',
    checkInDate: '2025-11-20',
    checkOutDate: '2025-11-27',
    numberOfNights: 7,
    status: 'pending',
    idPhotoUrl: null,
    idPhotoPath: null,
    createdAt: new Date('2025-10-26T08:15:00').toISOString(),
    updatedAt: new Date('2025-10-26T08:15:00').toISOString(),
    approvedBy: null,
    rejectedBy: null,
    rejectionReason: null
  },
  {
    guestName: 'Ibrahim Yusuf',
    guestEmail: 'ibrahim.yusuf@email.com',
    guestPhone: '+234 802 345 6789',
    address: '56 Adeola Odeku Street, Victoria Island, Lagos, Nigeria',
    bookingOption: 'entire-apartment',
    checkInDate: '2025-12-01',
    checkOutDate: '2025-12-15',
    numberOfNights: 14,
    status: 'approved',
    idPhotoUrl: null,
    idPhotoPath: null,
    createdAt: new Date('2025-10-22T13:00:00').toISOString(),
    updatedAt: new Date('2025-10-23T10:20:00').toISOString(),
    approvedBy: 'Admin User',
    approvedAt: new Date('2025-10-23T10:20:00').toISOString(),
    rejectedBy: null,
    rejectionReason: null
  }
];

// ==================== ADMIN USER DATA ====================

const adminUser = {
  uid: 'admin-001',
  email: 'admin@shortletconnect.com',
  displayName: 'Admin User',
  role: 'admin',
  permissions: ['manage_bookings', 'manage_availability', 'view_analytics'],
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
};

// ==================== SEED FUNCTION ====================

async function seedFirestore() {
  try {
    console.log('🌱 Starting Firestore seeding...\n');

    // 1. Create Apartment
    console.log('📦 Creating two-bedroom apartment...');
    const apartmentRef = doc(db, 'apartments', twoBedroomApartment.id);
    await setDoc(apartmentRef, twoBedroomApartment);
    console.log('✅ Apartment created successfully!');
    console.log(`   - Title: ${twoBedroomApartment.title}`);
    console.log(`   - Price: ₦${twoBedroomApartment.pricing.basePrice.toLocaleString()}/night`);
    console.log(`   - Location: ${twoBedroomApartment.location.address}\n`);

    // 2. Create Availability Document
    console.log('🏠 Creating apartment availability document...');
    const availabilityRef = doc(db, 'apartment-availability', 'main-apartment');
    await setDoc(availabilityRef, apartmentAvailability);
    console.log('✅ Availability document created!');
    console.log(`   - Status: ${apartmentAvailability.isAvailable ? 'Available' : 'Unavailable'}\n`);

    // 3. Create Sample Bookings
    console.log('📅 Creating sample bookings...');
    const bookingsRef = collection(db, 'simplified-bookings');
    
    for (let i = 0; i < sampleBookings.length; i++) {
      const booking = sampleBookings[i];
      const docRef = await addDoc(bookingsRef, booking);
      console.log(`   ✅ Booking ${i + 1}/${sampleBookings.length}: ${booking.guestName} (${booking.status})`);
      console.log(`      - Dates: ${booking.checkInDate} to ${booking.checkOutDate}`);
      console.log(`      - Option: ${booking.bookingOption}`);
    }
    console.log(`\n✅ ${sampleBookings.length} sample bookings created!\n`);

    // 4. Create Admin User
    console.log('👤 Creating admin user...');
    const adminRef = doc(db, 'users', adminUser.uid);
    await setDoc(adminRef, adminUser);
    console.log('✅ Admin user created!');
    console.log(`   - Email: ${adminUser.email}`);
    console.log(`   - Role: ${adminUser.role}\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Summary:');
    console.log(`   ✅ 1 apartment created`);
    console.log(`   ✅ 1 availability document created`);
    console.log(`   ✅ ${sampleBookings.length} bookings created`);
    console.log(`      - ${sampleBookings.filter(b => b.status === 'pending').length} pending`);
    console.log(`      - ${sampleBookings.filter(b => b.status === 'approved').length} approved`);
    console.log(`      - ${sampleBookings.filter(b => b.status === 'rejected').length} rejected`);
    console.log(`   ✅ 1 admin user created`);
    console.log('\n🚀 Your application is ready for testing!');
    console.log('   Run: ng serve --port 4200');
    console.log('   Visit: http://localhost:4200/home\n');

  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    process.exit(1);
  }
}

// Run the seeding
seedFirestore()
  .then(() => {
    console.log('✨ Seeding script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding script failed:', error);
    process.exit(1);
  });
