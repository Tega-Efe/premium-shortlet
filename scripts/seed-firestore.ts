/**
 * Firestore Database Seeding Script — Osaka Apartments
 *
 * This script populates Firestore with:
 * - Two apartment listings for Osaka Apartments (same property, two units)
 * - A real Firebase Auth admin user + matching Firestore profile doc,
 *   keyed by the actual Auth UID (not an auto-generated Firestore ID)
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
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

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
const auth = getAuth(app);

// ==================== SHARED PROPERTY DATA ====================

const PROPERTY_NAME = 'Osaka Apartments';
const PROPERTY_ADDRESS = 'No. 14 Imueruze Street, Off Upper Adesuwa Road, G.R.A Benin City, Benin';
const PROPERTY_CONTACT = {
  phones: ['+234 707 651 1255', '+234 704 907 1901']
};
const PROPERTY_LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/restless-society.firebasestorage.app/o/Osaka%20Apartments-logo.jpeg?alt=media&token=47bc5210-0c71-4607-9489-1c2d77e57104';

// The 7 real property photos, split at random between the two units so each
// listing gets its own distinct set instead of sharing all 7.
const ALL_PROPERTY_IMAGES = [
  'https://firebasestorage.googleapis.com/v0/b/restless-society.firebasestorage.app/o/Osaka%20Apartments-1.jpeg?alt=media&token=8bd3b3e9-e70d-415f-aa22-170cfd262f33',
  'https://firebasestorage.googleapis.com/v0/b/restless-society.firebasestorage.app/o/Osaka%20Apartments-2.jpeg?alt=media&token=dd1dc470-98a8-4188-963c-481b2f478df7',
  'https://firebasestorage.googleapis.com/v0/b/restless-society.firebasestorage.app/o/Osaka%20Apartments-3.jpeg?alt=media&token=35e53405-c7c0-4542-bc5e-abaed0093f41',
  'https://firebasestorage.googleapis.com/v0/b/restless-society.firebasestorage.app/o/Osaka%20Apartments-4.jpeg?alt=media&token=9624c8f2-0617-4b7e-b5be-58ca1fb5f690',
  'https://firebasestorage.googleapis.com/v0/b/restless-society.firebasestorage.app/o/Osaka%20Apartments-5.jpeg?alt=media&token=ef42e2a6-a855-49f7-bdc7-596f82e3239b',
  'https://firebasestorage.googleapis.com/v0/b/restless-society.firebasestorage.app/o/Osaka%20Apartments-6.jpeg?alt=media&token=796133ca-6e4c-460b-84ea-524f8cfffc67',
  'https://firebasestorage.googleapis.com/v0/b/restless-society.firebasestorage.app/o/Osaka%20Apartments-7.jpeg?alt=media&token=ffcdfe45-637a-478d-8b4e-6f9431bbec46',
];

// Random split: unit 1 gets 4 photos, unit 2 gets the remaining 3.
const APARTMENT_1_IMAGES = [
  ALL_PROPERTY_IMAGES[2], // Osaka Apartments-3
  ALL_PROPERTY_IMAGES[6], // Osaka Apartments-7
  ALL_PROPERTY_IMAGES[0], // Osaka Apartments-1
  ALL_PROPERTY_IMAGES[4], // Osaka Apartments-5
];
const APARTMENT_2_IMAGES = [
  ALL_PROPERTY_IMAGES[1], // Osaka Apartments-2
  ALL_PROPERTY_IMAGES[5], // Osaka Apartments-6
  ALL_PROPERTY_IMAGES[3], // Osaka Apartments-4
];

// ==================== APARTMENT DATA ====================

// UNIT 1
const apartment1 = {
  id: 'apt-osaka-001',
  title: PROPERTY_NAME,
  description: `Experience luxury living in this stunning two-bedroom apartment at ${PROPERTY_ADDRESS}.

This beautifully furnished apartment features:
- Spacious living room with modern furniture
- Fully equipped kitchen with premium appliances
- Two comfortable bedrooms with king-size beds
- Two bathrooms with hot water showers
- High-speed WiFi and Smart TV
- 24/7 security and power backup
- Dedicated parking space
- Access to swimming pool and gym

Perfect for business travelers, families, or couples looking for a comfortable short-term stay in Benin City. The apartment is within walking distance to restaurants, shopping centers, and business districts.

Book the entire apartment or just one room - flexible options to suit your needs!`,

  location: {
    address: PROPERTY_ADDRESS,
    city: 'Benin City',
    state: 'Edo',
    country: 'Nigeria',
    landmarks: [
      'Upper Adesuwa Road',
      'G.R.A Benin City',
      'Benin City business district'
    ]
  },

  contact: PROPERTY_CONTACT,

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

  logoUrl: PROPERTY_LOGO_URL,
  images: APARTMENT_1_IMAGES,

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

// UNIT 2
const apartment2 = {
  id: 'apt-osaka-002',
  title: PROPERTY_NAME,
  description: `Discover comfort and style in this contemporary two-bedroom apartment at ${PROPERTY_ADDRESS}.

This modern apartment offers:
- Open-plan living and dining area
- Gourmet kitchen with state-of-the-art appliances
- Two spacious bedrooms with comfortable queen beds
- Two modern bathrooms with rainfall showers
- High-speed internet and cable TV
- Backup power supply
- Secure parking
- Close to beaches and recreation centers

Ideal for both leisure and business stays. Enjoy the peaceful G.R.A Benin City environment while being close to shopping malls and entertainment spots.

Choose between booking one room or the entire apartment for maximum flexibility!`,

  location: {
    address: PROPERTY_ADDRESS,
    city: 'Benin City',
    state: 'Edo',
    country: 'Nigeria',
    landmarks: [
      'Upper Adesuwa Road',
      'G.R.A Benin City',
      'Benin City business district'
    ]
  },

  contact: PROPERTY_CONTACT,

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

  logoUrl: PROPERTY_LOGO_URL,
  images: APARTMENT_2_IMAGES,

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
// Dates below are relative to today (2026-09-17) so they read as live/upcoming
// test data instead of stale dates from last year.

const apartment1Bookings = [
  {
    apartmentId: apartment1.id,
    apartmentTitle: apartment1.title,
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
      checkInDate: '2026-10-05',
      checkOutDate: '2026-10-10',
      numberOfNights: 5,
      numberOfGuests: 4
    },
    pricing: {
      pricePerNight: apartment1.pricing.entireApartmentPrice,
      totalPrice: apartment1.pricing.entireApartmentPrice * 5
    },
    status: 'pending' as const,
    createdAt: new Date('2026-09-10T10:30:00').toISOString(),
    updatedAt: new Date('2026-09-10T10:30:00').toISOString()
  },
  {
    apartmentId: apartment1.id,
    apartmentTitle: apartment1.title,
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
      checkInDate: '2026-10-15',
      checkOutDate: '2026-10-18',
      numberOfNights: 3,
      numberOfGuests: 2
    },
    pricing: {
      pricePerNight: apartment1.pricing.oneRoomPrice,
      totalPrice: apartment1.pricing.oneRoomPrice * 3
    },
    status: 'approved' as const,
    approvedAt: new Date('2026-09-06T09:15:00').toISOString(),
    adminNotes: 'Guest verified, booking approved.',
    createdAt: new Date('2026-09-05T14:20:00').toISOString(),
    updatedAt: new Date('2026-09-06T09:15:00').toISOString()
  },
  {
    apartmentId: apartment1.id,
    apartmentTitle: apartment1.title,
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
      checkInDate: '2026-09-28',
      checkOutDate: '2026-09-30',
      numberOfNights: 2,
      numberOfGuests: 4
    },
    pricing: {
      pricePerNight: apartment1.pricing.entireApartmentPrice,
      totalPrice: apartment1.pricing.entireApartmentPrice * 2
    },
    status: 'rejected' as const,
    rejectedAt: new Date('2026-09-04T11:30:00').toISOString(),
    adminNotes: 'Dates already booked by another guest',
    createdAt: new Date('2026-09-03T16:45:00').toISOString(),
    updatedAt: new Date('2026-09-04T11:30:00').toISOString()
  },
  {
    apartmentId: apartment1.id,
    apartmentTitle: apartment1.title,
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
      checkInDate: '2026-11-01',
      checkOutDate: '2026-11-15',
      numberOfNights: 14,
      numberOfGuests: 4
    },
    pricing: {
      pricePerNight: apartment1.pricing.entireApartmentPrice,
      totalPrice: apartment1.pricing.entireApartmentPrice * 14
    },
    status: 'approved' as const,
    approvedAt: new Date('2026-09-13T10:20:00').toISOString(),
    adminNotes: 'Long stay booking, guest verified.',
    createdAt: new Date('2026-09-12T13:00:00').toISOString(),
    updatedAt: new Date('2026-09-13T10:20:00').toISOString()
  }
];

const apartment2Bookings = [
  {
    apartmentId: apartment2.id,
    apartmentTitle: apartment2.title,
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
      checkInDate: '2026-10-10',
      checkOutDate: '2026-10-13',
      numberOfNights: 3,
      numberOfGuests: 2
    },
    pricing: {
      pricePerNight: apartment2.pricing.oneRoomPrice,
      totalPrice: apartment2.pricing.oneRoomPrice * 3
    },
    status: 'approved' as const,
    approvedAt: new Date('2026-09-09T14:00:00').toISOString(),
    adminNotes: 'Verified guest, approved.',
    createdAt: new Date('2026-09-08T11:00:00').toISOString(),
    updatedAt: new Date('2026-09-09T14:00:00').toISOString()
  },
  {
    apartmentId: apartment2.id,
    apartmentTitle: apartment2.title,
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
      checkInDate: '2026-10-25',
      checkOutDate: '2026-10-30',
      numberOfNights: 5,
      numberOfGuests: 4
    },
    pricing: {
      pricePerNight: apartment2.pricing.entireApartmentPrice,
      totalPrice: apartment2.pricing.entireApartmentPrice * 5
    },
    status: 'approved' as const,
    approvedAt: new Date('2026-09-15T09:30:00').toISOString(),
    adminNotes: 'Family vacation, approved.',
    createdAt: new Date('2026-09-14T15:20:00').toISOString(),
    updatedAt: new Date('2026-09-15T09:30:00').toISOString()
  },
  {
    apartmentId: apartment2.id,
    apartmentTitle: apartment2.title,
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
      checkInDate: '2026-11-05',
      checkOutDate: '2026-11-08',
      numberOfNights: 3,
      numberOfGuests: 2
    },
    pricing: {
      pricePerNight: apartment2.pricing.oneRoomPrice,
      totalPrice: apartment2.pricing.oneRoomPrice * 3
    },
    status: 'pending' as const,
    createdAt: new Date('2026-09-16T10:15:00').toISOString(),
    updatedAt: new Date('2026-09-16T10:15:00').toISOString()
  }
];

const allBookings = [...apartment1Bookings, ...apartment2Bookings];

/**
 * Writes the sample bookings above into the `simplified-bookings` collection
 * (the same collection scripts/cleanup-bookings.ts operates on), letting
 * Firestore assign each booking doc its own auto-generated id.
 */
async function seedBookings(): Promise<void> {
  console.log('📋 Creating sample bookings...\n');

  const bookingsRef = collection(db, 'simplified-bookings');
  for (const booking of allBookings) {
    const bookingDoc = await addDoc(bookingsRef, booking);
    console.log(`   ✅ ${booking.guestInfo.name} — ${booking.bookingDetails.checkInDate} to ${booking.bookingDetails.checkOutDate} (${booking.status}) [${bookingDoc.id}]`);
  }
  console.log(`\n   ✅ ${allBookings.length} sample bookings created\n`);
}

// ==================== ADMIN USER (real Firebase Auth account) ====================

const ADMIN_EMAIL = 'osakaapartments@shortletconnect.com';
const ADMIN_PASSWORD = 'Tega2026SecurePass';
const ADMIN_DISPLAY_NAME = 'Admin User';

/**
 * Creates a real Firebase Auth user and writes the matching Firestore
 * profile doc keyed by that user's actual Auth UID — same mechanism as
 * scripts/seed-admin.ts — instead of a hardcoded/auto-generated doc id.
 */
async function seedAdminUser(): Promise<void> {
  console.log('👤 Creating admin user...\n');

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    );
    const user = userCredential.user;

    await updateProfile(user, { displayName: ADMIN_DISPLAY_NAME });

    const userRef = doc(db, 'users', user.uid); // doc id = real Auth UID
    await setDoc(userRef, {
      uid: user.uid,
      email: ADMIN_EMAIL,
      displayName: ADMIN_DISPLAY_NAME,
      role: 'admin',
      permissions: ['manage_bookings', 'manage_availability', 'view_analytics'],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });

    console.log(`   ✅ Auth user created — UID: ${user.uid}`);
    console.log(`   ✅ Firestore profile written to users/${user.uid} (role: admin)`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}\n`);
  } catch (error: any) {
    if (error?.code === 'auth/email-already-in-use') {
      console.log(`   ⚠️  ${ADMIN_EMAIL} already has an Auth account — skipping admin creation.`);
      console.log(`      Use scripts/seed-admin.ts or the Firebase Console to reset its password if needed.\n`);
    } else {
      throw error;
    }
  }
}

// ==================== SEED FUNCTION ====================

async function seedFirestore() {
  try {
    console.log('🌱 Starting Firestore seeding...\n');

    // 1. Create Apartments
    console.log('📦 Creating apartment listings...\n');

    console.log(`   Unit 1: ${apartment1.title}`);
    const apartment1Ref = doc(db, 'apartments', apartment1.id);
    await setDoc(apartment1Ref, apartment1);
    console.log(`   ✅ ${apartment1.title} (${apartment1.id})`);
    console.log(`      - Price (One Room): ₦${apartment1.pricing.oneRoomPrice.toLocaleString()}/night`);
    console.log(`      - Price (Entire): ₦${apartment1.pricing.entireApartmentPrice.toLocaleString()}/night`);
    console.log(`      - Location: ${apartment1.location.address}`);
    console.log(`      - Contact: ${apartment1.contact.phones.join(', ')}\n`);

    console.log(`   Unit 2: ${apartment2.title}`);
    const apartment2Ref = doc(db, 'apartments', apartment2.id);
    await setDoc(apartment2Ref, apartment2);
    console.log(`   ✅ ${apartment2.title} (${apartment2.id})`);
    console.log(`      - Price (One Room): ₦${apartment2.pricing.oneRoomPrice.toLocaleString()}/night`);
    console.log(`      - Price (Entire): ₦${apartment2.pricing.entireApartmentPrice.toLocaleString()}/night`);
    console.log(`      - Location: ${apartment2.location.address}`);
    console.log(`      - Contact: ${apartment2.contact.phones.join(', ')}\n`);

    // 2. Create sample bookings
    await seedBookings();

    // 3. Create Admin user (real Auth account + Firestore profile)
    await seedAdminUser();

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Summary:');
    console.log(`   ✅ 2 apartment units created for ${PROPERTY_NAME}`);
    console.log(`      - ${apartment1.title} (ID: ${apartment1.id})`);
    console.log(`      - ${apartment2.title} (ID: ${apartment2.id})`);
    console.log(`   ✅ Both units have empty bookedDates (ready for testing)`);
    console.log(`   ✅ ${allBookings.length} sample bookings created in simplified-bookings`);
    console.log(`   ✅ Admin account ready: ${ADMIN_EMAIL}`);
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