/**
 * Firestore Database Cleanup Script
 * 
 * This script identifies and fixes/removes bookings with incomplete data
 * Run with: npx ts-node scripts/cleanup-bookings.ts
 */

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  deleteDoc, 
  updateDoc,
  doc
} from 'firebase/firestore';

// Firebase configuration (copy from your environment.ts)
const firebaseConfig = {
  apiKey: "AIzaSyDf7gOOV5p6DY65W1uxmDRjMqlOOxFI3Us",
  authDomain: "premium-shortlet.firebaseapp.com",
  projectId: "premium-shortlet",
  storageBucket: "premium-shortlet.firebasestorage.app",
  messagingSenderId: "736821436661",
  appId: "1:736821436661:web:4a99ad1da6a9fff6ab6a0f",
  measurementId: "G-ER0JW81R2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface SimplifiedBooking {
  id?: string;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    idPhotoUrl?: string;
    idPhotoPath?: string;
  };
  bookingDetails?: {
    bookingOption: 'one-room' | 'entire-apartment';
    checkInDate: string;
    checkOutDate: string;
    numberOfNights: number;
    numberOfGuests: number;
  };
  pricing?: {
    pricePerNight: number;
    totalPrice: number;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  adminNotes?: string;
}

interface CleanupStats {
  total: number;
  valid: number;
  incomplete: number;
  deleted: number;
  fixed: number;
  errors: number;
}

const stats: CleanupStats = {
  total: 0,
  valid: 0,
  incomplete: 0,
  deleted: 0,
  fixed: 0,
  errors: 0
};

/**
 * Check if a booking has all required fields
 */
function isValidBooking(booking: any): boolean {
  return !!(
    booking['guestInfo'] &&
    booking['guestInfo'].name &&
    booking['guestInfo'].email &&
    booking['guestInfo'].phone &&
    booking['guestInfo'].address &&
    booking['bookingDetails'] &&
    booking['bookingDetails'].bookingOption &&
    booking['bookingDetails'].checkInDate &&
    booking['bookingDetails'].checkOutDate &&
    booking['bookingDetails'].numberOfNights &&
    booking['bookingDetails'].numberOfGuests &&
    booking['pricing'] &&
    typeof booking['pricing'].pricePerNight === 'number' &&
    typeof booking['pricing'].totalPrice === 'number' &&
    booking['status']
  );
}

/**
 * Calculate pricing if missing
 */
function calculatePricing(booking: any): { pricePerNight: number; totalPrice: number } {
  const bookingOption = booking['bookingDetails']?.bookingOption || 'one-room';
  const numberOfNights = booking['bookingDetails']?.numberOfNights || 1;
  
  const pricePerNight = bookingOption === 'one-room' ? 25000 : 45000;
  const totalPrice = pricePerNight * numberOfNights;
  
  return { pricePerNight, totalPrice };
}

/**
 * Attempt to fix incomplete booking
 */
async function fixBooking(bookingId: string, booking: any): Promise<boolean> {
  try {
    const updates: Partial<SimplifiedBooking> = {};
    let canFix = true;

    // Check if we can fix missing pricing
    if (!booking['pricing'] && booking['bookingDetails']?.numberOfNights) {
      updates.pricing = calculatePricing(booking);
      console.log(`  ✓ Adding pricing: ₦${updates.pricing.totalPrice.toLocaleString()}`);
    } else if (!booking['pricing']) {
      console.log(`  ✗ Cannot fix: Missing pricing and numberOfNights`);
      canFix = false;
    }

    // Check for missing required fields
    if (!booking['guestInfo'] || !booking['guestInfo'].name) {
      console.log(`  ✗ Cannot fix: Missing guestInfo`);
      canFix = false;
    }

    if (!booking['bookingDetails']) {
      console.log(`  ✗ Cannot fix: Missing bookingDetails`);
      canFix = false;
    }

    if (!booking['status']) {
      updates.status = 'pending';
      console.log(`  ✓ Setting default status: pending`);
    }

    if (!booking['createdAt']) {
      updates.createdAt = new Date().toISOString();
      console.log(`  ✓ Adding createdAt timestamp`);
    }

    // Apply fixes if possible
    if (canFix && Object.keys(updates).length > 0) {
      const bookingRef = doc(db, 'simplified-bookings', bookingId);
      await updateDoc(bookingRef, updates);
      stats.fixed++;
      return true;
    }

    return false;
  } catch (error) {
    console.error(`  ✗ Error fixing booking:`, error);
    stats.errors++;
    return false;
  }
}

/**
 * Delete an incomplete booking
 */
async function deleteBooking(bookingId: string): Promise<void> {
  try {
    const bookingRef = doc(db, 'simplified-bookings', bookingId);
    await deleteDoc(bookingRef);
    stats.deleted++;
    console.log(`  ✓ Deleted incomplete booking`);
  } catch (error) {
    console.error(`  ✗ Error deleting booking:`, error);
    stats.errors++;
  }
}

/**
 * Main cleanup function
 */
async function cleanupBookings(mode: 'analyze' | 'fix' | 'delete' = 'analyze'): Promise<void> {
  console.log('\n🔍 Starting Firestore Bookings Cleanup...\n');
  console.log(`Mode: ${mode.toUpperCase()}`);
  console.log('─'.repeat(60));

  try {
    const bookingsRef = collection(db, 'simplified-bookings');
    const snapshot = await getDocs(bookingsRef);
    
    stats.total = snapshot.size;
    console.log(`\nFound ${stats.total} total bookings\n`);

    for (const docSnapshot of snapshot.docs) {
      const bookingId = docSnapshot.id;
      const booking = docSnapshot.data();

      console.log(`\n📋 Booking ID: ${bookingId.substring(0, 8)}...`);
      console.log(`   Status: ${booking['status'] || 'UNKNOWN'}`);
      console.log(`   Created: ${booking['createdAt'] ? new Date(booking['createdAt']).toLocaleString() : 'UNKNOWN'}`);

      if (isValidBooking(booking)) {
        stats.valid++;
        console.log(`   ✅ Valid - All required fields present`);
      } else {
        stats.incomplete++;
        console.log(`   ⚠️  Incomplete booking detected:`);

        // List missing fields
        if (!booking['guestInfo']) console.log(`      - Missing: guestInfo`);
        else {
          if (!booking['guestInfo'].name) console.log(`      - Missing: guestInfo.name`);
          if (!booking['guestInfo'].email) console.log(`      - Missing: guestInfo.email`);
          if (!booking['guestInfo'].phone) console.log(`      - Missing: guestInfo.phone`);
          if (!booking['guestInfo'].address) console.log(`      - Missing: guestInfo.address`);
        }

        if (!booking['bookingDetails']) console.log(`      - Missing: bookingDetails`);
        else {
          if (!booking['bookingDetails'].bookingOption) console.log(`      - Missing: bookingDetails.bookingOption`);
          if (!booking['bookingDetails'].checkInDate) console.log(`      - Missing: bookingDetails.checkInDate`);
          if (!booking['bookingDetails'].numberOfNights) console.log(`      - Missing: bookingDetails.numberOfNights`);
        }

        if (!booking['pricing']) console.log(`      - Missing: pricing`);
        else {
          if (typeof booking['pricing'].pricePerNight !== 'number') console.log(`      - Missing: pricing.pricePerNight`);
          if (typeof booking['pricing'].totalPrice !== 'number') console.log(`      - Missing: pricing.totalPrice`);
        }

        // Take action based on mode
        if (mode === 'fix') {
          console.log(`\n   🔧 Attempting to fix...`);
          const fixed = await fixBooking(bookingId, booking);
          if (!fixed) {
            console.log(`   ❌ Could not fix - consider deletion`);
          }
        } else if (mode === 'delete') {
          console.log(`\n   🗑️  Deleting incomplete booking...`);
          await deleteBooking(bookingId);
        }
      }
    }

    // Print summary
    console.log('\n' + '═'.repeat(60));
    console.log('\n📊 CLEANUP SUMMARY\n');
    console.log('─'.repeat(60));
    console.log(`Total Bookings:      ${stats.total}`);
    console.log(`Valid Bookings:      ${stats.valid} ✅`);
    console.log(`Incomplete Bookings: ${stats.incomplete} ⚠️`);
    
    if (mode === 'fix') {
      console.log(`Fixed Bookings:      ${stats.fixed} 🔧`);
      console.log(`Could Not Fix:       ${stats.incomplete - stats.fixed} ❌`);
    } else if (mode === 'delete') {
      console.log(`Deleted Bookings:    ${stats.deleted} 🗑️`);
    }
    
    if (stats.errors > 0) {
      console.log(`Errors:              ${stats.errors} ⚠️`);
    }
    console.log('─'.repeat(60));

    // Recommendations
    if (mode === 'analyze') {
      console.log('\n💡 RECOMMENDATIONS:\n');
      if (stats.incomplete > 0) {
        console.log(`   1. Run with 'fix' mode to attempt automatic fixes:`);
        console.log(`      npm run cleanup:fix\n`);
        console.log(`   2. If fixes don't work, run 'delete' mode to remove them:`);
        console.log(`      npm run cleanup:delete\n`);
      } else {
        console.log(`   ✅ All bookings are valid! No cleanup needed.\n`);
      }
    } else if (mode === 'fix') {
      const unfixed = stats.incomplete - stats.fixed;
      if (unfixed > 0) {
        console.log('\n💡 NEXT STEPS:\n');
        console.log(`   ${unfixed} bookings could not be fixed automatically.`);
        console.log(`   Run delete mode to remove them:\n`);
        console.log(`   npm run cleanup:delete\n`);
      } else {
        console.log('\n✅ All incomplete bookings have been fixed!\n');
      }
    } else if (mode === 'delete') {
      console.log('\n✅ Cleanup complete! All incomplete bookings removed.\n');
    }

  } catch (error) {
    console.error('\n❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const mode = process.argv[2] as 'analyze' | 'fix' | 'delete' || 'analyze';

if (!['analyze', 'fix', 'delete'].includes(mode)) {
  console.error('\n❌ Invalid mode. Use: analyze | fix | delete\n');
  process.exit(1);
}

// Run cleanup
cleanupBookings(mode)
  .then(() => {
    console.log('\n✅ Script completed successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
