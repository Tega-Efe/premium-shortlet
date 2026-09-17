/**
 * Firebase Admin User Seeding Script
 *
 * Creates a real Firebase Auth user (so you actually have working login
 * credentials) and a matching Firestore profile doc in the `users`
 * collection with role: 'admin'.
 *
 * Run with:
 *   npx ts-node scripts/seed-admin.ts <email> <password> [displayName]
 *
 * Example:
 *   npx ts-node scripts/seed-admin.ts admin@shortletconnect.com "MyStrongPass123!" "Admin User"
 *
 * If you don't pass an email/password, safe random defaults are generated
 * and printed at the end so you have something to write down immediately.
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
} from 'firebase/firestore';
import * as crypto from 'crypto';

// Firebase configuration — shortlet-connect project
const firebaseConfig = {
  apiKey: "AIzaSyDIS034JeQMWf9iT0WuBuVjuVyxc3sDRu4",
  authDomain: "shortlet-connect.firebaseapp.com",
  projectId: "shortlet-connect",
  storageBucket: "shortlet-connect.firebasestorage.app",
  messagingSenderId: "605241409683",
  appId: "1:605241409683:web:68fffdf1da9f09b4384d66"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Generate a reasonably strong random password if the user doesn't supply one.
 */
function generatePassword(length = 16): string {
  const charset =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let pw = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    pw += charset[bytes[i] % charset.length];
  }
  return pw;
}

async function seedAdmin() {
  const [, , emailArg, passwordArg, displayNameArg] = process.argv;

  const email = emailArg || 'admin@shortletconnect.com';
  const password = passwordArg || generatePassword();
  const displayName = displayNameArg || 'Admin User';

  console.log('\n🌱 Seeding new admin user...\n');
  console.log('─'.repeat(60));

  try {
    // 1. Create the Auth user (this is what makes login actually work)
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    console.log(`✅ Auth user created`);
    console.log(`   UID: ${user.uid}`);

    // 2. Write the matching Firestore profile doc
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email,
      displayName,
      role: 'admin',
      permissions: ['manage_bookings', 'manage_availability', 'view_analytics'],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });

    console.log(`✅ Firestore profile written to users/${user.uid} with role: 'admin'`);

    console.log('\n' + '═'.repeat(60));
    console.log('🎉 ADMIN CREATED — SAVE THESE CREDENTIALS NOW');
    console.log('═'.repeat(60));
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   UID:      ${user.uid}`);
    console.log('═'.repeat(60));
    console.log(
      '\n⚠️  This password is only shown here — Firebase Auth stores it hashed'
    );
    console.log('   and there is no way to retrieve it again. Store it in a password manager now.\n');
  } catch (error: any) {
    if (error?.code === 'auth/email-already-in-use') {
      console.error(
        `\n❌ ${email} already has an Auth account. If you forgot the password, ` +
          `use Firebase Console → Authentication → Users → (reset password), ` +
          `or the "forgot password" flow in your app, instead of this script.\n`
      );
    } else {
      console.error('\n❌ Error seeding admin:', error);
    }
    process.exit(1);
  }
}

seedAdmin()
  .then(() => {
    console.log('✅ Script completed successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
