# Backend Setup & Fixes Guide

## 🔥 Firebase Storage CORS Issue - SOLVED

### Problem
The error `CORS policy: Response to preflight request doesn't pass access control check` occurs because:
1. **Firebase Storage was not initialized** in your Firebase project
2. **Incorrect storage bucket name** in environment files

### Solution Steps

#### Step 1: Initialize Firebase Storage
1. Go to [Firebase Console](https://console.firebase.google.com/project/shortlet-connect/storage)
2. Click **"Get Started"** button
3. Click **"Next"** on the security rules screen
4. Select your preferred location (choose one close to your users, e.g., `us-central1` or `europe-west1`)
5. Click **"Done"**

#### Step 2: Environment Configuration Fixed ✅
The storage bucket name has been corrected from:
- ❌ `shortlet-connect.firebasestorage.app`
- ✅ `shortlet-connect.appspot.com`

This change has been applied to:
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

#### Step 3: Deploy Storage Rules
After initializing Firebase Storage in the console, run:
```bash
firebase deploy --only storage
```

---

## 🗄️ Firestore Setup

### Current Collections Needed:
1. **simplified-bookings** - Stores booking requests
2. **apartment-availability** - Stores apartment availability status
3. **listings** (optional) - For future expansion
4. **reviews** (optional) - For guest reviews

### Deploy Firestore Rules:
```bash
firebase deploy --only firestore:rules
```

---

## 📧 Email Notification Service

### Current Status
The app uses `EmailNotificationService` which calls a Django backend API for sending emails.

### Required Backend API Endpoints:
1. `POST /api/bookings/new-booking/` - Notify admin of new booking
2. `POST /api/bookings/approved/` - Notify guest of approval
3. `POST /api/bookings/rejected/` - Notify guest of rejection

### Django Backend Setup (if not already done):
See the separate Django project for email notification service setup.

---

## 🚀 Complete Setup Checklist

### Firebase Console Tasks:
- [ ] Enable Firebase Storage (Step 1 above)
- [ ] Verify Firestore Database is enabled
- [ ] Check that Authentication is enabled (if using auth)
- [ ] Review Security Rules

### Local Development:
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Environment files updated ✅
- [ ] Storage rules updated ✅
- [ ] Deploy storage rules (after enabling Storage)
- [ ] Test booking form submission

### Commands to Run:
```bash
# 1. Install dependencies (if needed)
npm install

# 2. Deploy all Firebase rules (after enabling Storage in console)
firebase deploy --only firestore:rules,storage

# 3. Start development server
ng serve

# 4. Test the application
# Visit http://localhost:4200 and submit a booking
```

---

## 🐛 Troubleshooting

### If CORS error persists:
1. **Clear browser cache** and restart dev server
2. Ensure Firebase Storage is **enabled** in console
3. Verify storage bucket name is `shortlet-connect.appspot.com`
4. Check browser console for any auth errors

### If file upload still fails:
1. Check file size (must be < 5MB for ID photos)
2. Verify file type is an image (jpg, png, etc.)
3. Check browser network tab for exact error response

### If emails don't send:
1. Verify Django backend is running
2. Check email service configuration in Django
3. Review API endpoint URLs in `environment.ts`

---

## 📝 Next Steps After Setup

1. **Test booking flow:**
   - Fill out booking form
   - Upload ID photo
   - Submit booking
   - Check Firestore for new booking document
   - Verify email notifications are sent

2. **Admin dashboard:**
   - Navigate to `/admin`
   - View pending bookings
   - Test approve/reject functionality

3. **Production deployment:**
   - Update `environment.prod.ts` with production Django API URL
   - Build: `ng build --configuration production`
   - Deploy: `firebase deploy`

---

## 🔒 Security Notes

**Current Status:** All collections are set to public read/write for development.

**Before Production:**
1. Implement proper authentication
2. Update Firestore rules to validate user permissions
3. Restrict storage writes to authenticated users only
4. Add server-side validation for booking data
5. Implement rate limiting on booking submissions

---

## 📞 Support

If you encounter any issues:
1. Check browser console for detailed errors
2. Review Firebase console logs
3. Verify all services are enabled in Firebase
4. Ensure environment variables are correct
