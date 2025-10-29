/**
 * Firestore Database Seeding Script
 * 
 * This script populates Firestore with test data for the two-apartment booking system:
 * - Two two-bedroom apartments
 * - Sample booking data for each apartment
 * - Admin user data
 * 
 * Run with: npm run seed
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

// APARTMENT 1: Victoria Island
const apartment1 = {
  id: 'apt-victoria-island-001',
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
  
  location: {
    address: '15 Akin Adesola Street, Victoria Island',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    landmarks: [
      'Eko Hotel & Suites',
      'The Palms Shopping Mall',
      'Federal Palace Hotel'
    ]
  },
  
  pricing: {
    oneRoomPrice: 25000,
    entireApartmentPrice: 45000,
    currency: 'NGN'
  },
  
  specifications: {
    bedrooms: 2,
    bathrooms: 2,
    maxGuestsOneRoom: 2,
    maxGuestsEntireApartment: 4,
    floors: 1
  },
  
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
  
  images: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
  ],
  
  availability: {
    isAvailable: true,
    status: 'available' as const,
    bookedDates: [],
    blackoutDates: []
  },
  
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
  
  createdAt: new Date(),
  updatedAt: new Date()
};

// APARTMENT 2: Lekki Phase 1
const apartment2 = {
  id: 'apt-lekki-phase1-002',
  title: 'Modern Two-Bedroom Apartment in Lekki Phase 1',
  description: `Discover comfort and style in this contemporary two-bedroom apartment in the serene Lekki Phase 1 area.

This modern apartment offers:
- Open-plan living and dining area
- Gourmet kitchen with state-of-the-art appliances
- Two spacious bedrooms with comfortable queen beds
- Two modern bathrooms with rainfall showers
- High-speed internet and cable TV
- Backup power supply
- Secure parking
- Close to beaches and recreation centers

Ideal for both leisure and business stays. Enjoy the peaceful Lekki environment while being close to the beach, shopping malls, and entertainment spots.

Choose between booking one room or the entire apartment for maximum flexibility!`,
  
  location: {
    address: '42 Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    landmarks: [
      'Lekki Conservation Centre',
      'Elegushi Beach',
      'Circle Mall'
    ]
  },
  
  pricing: {
    oneRoomPrice: 22000,
    entireApartmentPrice: 40000,
    currency: 'NGN'
  },
  
  specifications: {
    bedrooms: 2,
    bathrooms: 2,
    maxGuestsOneRoom: 2,
    maxGuestsEntireApartment: 4,
    floors: 1
  },
  
  amenities: [
    'WiFi',
    'Air Conditioning',
    'Kitchen',
    'Smart TV',
    'Parking',
    '24/7 Security',
    'Generator',
    'Garden',
    'Balcony',
    'Washing Machine',
    'Microwave',
    'Coffee Maker'
  ],
  
  images: [
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800',
    'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'
  ],
  
  availability: {
    isAvailable: true,
    status: 'available' as const,
    bookedDates: [],
    blackoutDates: []
  },
  
  rating: {
    average: 4.7,
    count: 89,
    breakdown: {
      cleanliness: 4.8,
      accuracy: 4.6,
      communication: 4.7,
      location: 4.8,
      value: 4.7
    }
  },
  
  featured: true,
  
  createdAt: new Date(),
  updatedAt: new Date()
};

// ==================== SAMPLE BOOKINGS ====================

// Bookings for Apartment 1 (Victoria Island)
const apartment1Bookings = [
  {
    apartmentId: 'apt-victoria-island-001',
    apartmentTitle: 'Luxury Two-Bedroom Apartment in Victoria Island',
    guestInfo: {
      name: 'Chinedu Okonkwo',
      email: 'chinedu.okonkwo@email.com',
      phone: '+234 803 456 7890',
      address: '45 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
      idPhotoUrl: null,
      idPhotoPath: null
    },
    bookingDetails: {
      bookingOption: 'entire-apartment' as const,
      checkInDate: '2025-11-05',
      checkOutDate: '2025-11-10',
      numberOfNights: 5,
      numberOfGuests: 4
    },
    pricing: {
      pricePerNight: 45000,
      totalPrice: 225000
    },
    status: 'pending' as const,
    createdAt: new Date('2025-10-25T10:30:00').toISOString(),
    updatedAt: new Date('2025-10-25T10:30:00').toISOString()
  },
  {
    apartmentId: 'apt-victoria-island-001',
    apartmentTitle: 'Luxury Two-Bedroom Apartment in Victoria Island',
    guestInfo: {
      name: 'Aisha Bello',
      email: 'aisha.bello@email.com',
      phone: '+234 805 678 9012',
      address: '12 Ogudu Road, Ojota, Lagos, Nigeria',
      idPhotoUrl: null,
      idPhotoPath: null
    },
    bookingDetails: {
      bookingOption: 'one-room' as const,
      checkInDate: '2025-11-15',
      checkOutDate: '2025-11-18',
      numberOfNights: 3,
      numberOfGuests: 2
    },
    pricing: {
      pricePerNight: 25000,
      totalPrice: 75000
    },
    status: 'approved' as const,
    approvedAt: new Date('2025-10-21T09:15:00').toISOString(),
    adminNotes: 'Guest verified, booking approved.',
    createdAt: new Date('2025-10-20T14:20:00').toISOString(),
    updatedAt: new Date('2025-10-21T09:15:00').toISOString()
  },
  {
    apartmentId: 'apt-victoria-island-001',
    apartmentTitle: 'Luxury Two-Bedroom Apartment in Victoria Island',
    guestInfo: {
      name: 'Emeka Nwosu',
      email: 'emeka.nwosu@email.com',
      phone: '+234 807 890 1234',
      address: '78 Herbert Macaulay Street, Yaba, Lagos, Nigeria',
      idPhotoUrl: null,
      idPhotoPath: null
    },
    bookingDetails: {
      bookingOption: 'entire-apartment' as const,
      checkInDate: '2025-10-28',
      checkOutDate: '2025-10-30',
      numberOfNights: 2,
      numberOfGuests: 4
    },
    pricing: {
      pricePerNight: 45000,
      totalPrice: 90000
    },
    status: 'rejected' as const,
    rejectedAt: new Date('2025-10-19T11:30:00').toISOString(),
    adminNotes: 'Dates already booked by another guest',
    createdAt: new Date('2025-10-18T16:45:00').toISOString(),
    updatedAt: new Date('2025-10-19T11:30:00').toISOString()
  },
  {
    apartmentId: 'apt-victoria-island-001',
    apartmentTitle: 'Luxury Two-Bedroom Apartment in Victoria Island',
    guestInfo: {
      name: 'Ibrahim Yusuf',
      email: 'ibrahim.yusuf@email.com',
      phone: '+234 802 345 6789',
      address: '56 Adeola Odeku Street, Victoria Island, Lagos, Nigeria',
      idPhotoUrl: null,
      idPhotoPath: null
    },
    bookingDetails: {
      bookingOption: 'entire-apartment' as const,
      checkInDate: '2025-12-01',
      checkOutDate: '2025-12-15',
      numberOfNights: 14,
      numberOfGuests: 4
    },
    pricing: {
      pricePerNight: 45000,
      totalPrice: 630000
    },
    status: 'approved' as const,
    approvedAt: new Date('2025-10-23T10:20:00').toISOString(),
    adminNotes: 'Long stay booking, guest verified.',
    createdAt: new Date('2025-10-22T13:00:00').toISOString(),
    updatedAt: new Date('2025-10-23T10:20:00').toISOString()
  }
];

// Bookings for Apartment 2 (Lekki Phase 1)
const apartment2Bookings = [
  {
    apartmentId: 'apt-lekki-phase1-002',
    apartmentTitle: 'Modern Two-Bedroom Apartment in Lekki Phase 1',
    guestInfo: {
      name: 'Funke Adeyemi',
      email: 'funke.adeyemi@email.com',
      phone: '+234 809 012 3456',
      address: '23 Allen Avenue, Ikeja, Lagos, Nigeria',
      idPhotoUrl: null,
      idPhotoPath: null
    },
    bookingDetails: {
      bookingOption: 'one-room' as const,
      checkInDate: '2025-11-10',
      checkOutDate: '2025-11-13',
      numberOfNights: 3,
      numberOfGuests: 2
    },
    pricing: {
      pricePerNight: 22000,
      totalPrice: 66000
    },
    status: 'approved' as const,
    approvedAt: new Date('2025-10-24T14:00:00').toISOString(),
    adminNotes: 'Verified guest, approved.',
    createdAt: new Date('2025-10-23T11:00:00').toISOString(),
    updatedAt: new Date('2025-10-24T14:00:00').toISOString()
  },
  {
    apartmentId: 'apt-lekki-phase1-002',
    apartmentTitle: 'Modern Two-Bedroom Apartment in Lekki Phase 1',
    guestInfo: {
      name: 'Tunde Bakare',
      email: 'tunde.bakare@email.com',
      phone: '+234 806 789 0123',
      address: '89 Opebi Road, Ikeja, Lagos, Nigeria',
      idPhotoUrl: null,
      idPhotoPath: null
    },
    bookingDetails: {
      bookingOption: 'entire-apartment' as const,
      checkInDate: '2025-11-25',
      checkOutDate: '2025-11-30',
      numberOfNights: 5,
      numberOfGuests: 4
    },
    pricing: {
      pricePerNight: 40000,
      totalPrice: 200000
    },
    status: 'approved' as const,
    approvedAt: new Date('2025-10-26T09:30:00').toISOString(),
    adminNotes: 'Family vacation, approved.',
    createdAt: new Date('2025-10-25T15:20:00').toISOString(),
    updatedAt: new Date('2025-10-26T09:30:00').toISOString()
  },
  {
    apartmentId: 'apt-lekki-phase1-002',
    apartmentTitle: 'Modern Two-Bedroom Apartment in Lekki Phase 1',
    guestInfo: {
      name: 'Ngozi Okafor',
      email: 'ngozi.okafor@email.com',
      phone: '+234 808 234 5678',
      address: '34 Awolowo Road, Ikoyi, Lagos, Nigeria',
      idPhotoUrl: null,
      idPhotoPath: null
    },
    bookingDetails: {
      bookingOption: 'one-room' as const,
      checkInDate: '2025-12-05',
      checkOutDate: '2025-12-08',
      numberOfNights: 3,
      numberOfGuests: 2
    },
    pricing: {
      pricePerNight: 22000,
      totalPrice: 66000
    },
    status: 'pending' as const,
    createdAt: new Date('2025-10-27T10:15:00').toISOString(),
    updatedAt: new Date('2025-10-27T10:15:00').toISOString()
  }
];

// Combine all bookings
const allBookings = [...apartment1Bookings, ...apartment2Bookings];

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

    // 1. Create Apartments
    console.log('📦 Creating two-bedroom apartments...\n');
    
    // Apartment 1
    console.log('   Apartment 1: Victoria Island');
    const apartment1Ref = doc(db, 'apartments', apartment1.id);
    await setDoc(apartment1Ref, apartment1);
    console.log(`   ✅ ${apartment1.title}`);
    console.log(`      - Price (One Room): ₦${apartment1.pricing.oneRoomPrice.toLocaleString()}/night`);
    console.log(`      - Price (Entire): ₦${apartment1.pricing.entireApartmentPrice.toLocaleString()}/night`);
    console.log(`      - Location: ${apartment1.location.address}\n`);

    // Apartment 2
    console.log('   Apartment 2: Lekki Phase 1');
    const apartment2Ref = doc(db, 'apartments', apartment2.id);
    await setDoc(apartment2Ref, apartment2);
    console.log(`   ✅ ${apartment2.title}`);
    console.log(`      - Price (One Room): ₦${apartment2.pricing.oneRoomPrice.toLocaleString()}/night`);
    console.log(`      - Price (Entire): ₦${apartment2.pricing.entireApartmentPrice.toLocaleString()}/night`);
    console.log(`      - Location: ${apartment2.location.address}\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Summary:');
    console.log(`   ✅ 2 apartments created`);
    console.log(`      - Victoria Island (ID: ${apartment1.id})`);
    console.log(`      - Lekki Phase 1 (ID: ${apartment2.id})`);
    console.log(`   ✅ Both apartments have empty bookedDates (ready for testing)`);
    console.log('\n🚀 Your application is ready for testing!');
    console.log('   Run: ng serve');
    console.log('   Visit: http://localhost:4200/home');
    console.log('\n💡 Test booking flow:');
    console.log('   - Book apartments through the UI');
    console.log('   - Dates are automatically blocked on booking creation');
    console.log('   - Try booking overlapping dates to test conflict detection\n');

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
