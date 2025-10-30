# Admin Authentication - Quick Setup Guide

## ✅ What's Been Implemented

A complete Firebase-based authentication system for the admin dashboard with:

1. **Login Page** (`/admin/login`)
   - Email/password authentication
   - Remember Me functionality (30-day session vs session-only)
   - Beautiful UI with gradient borders
   - Password visibility toggle
   - Real-time error handling
   - Responsive design

2. **Route Protection** 
   - `/admin` route now protected by auth guard
   - Automatic redirect to login if not authenticated
   - ReturnUrl preservation for seamless post-login redirect

3. **Session Management**
   - Firebase Auth state monitoring
   - Configurable session persistence
   - Auto-logout on session expiry

4. **Admin Dashboard Integration**
   - Logout button in header
   - User email display
   - Logout confirmation modal

## 🚀 How to Test

### Step 1: Create Admin User in Firebase

1. Open Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to **Authentication** → **Users** tab
4. Click **Add User**
5. Enter:
   - Email: `admin@sweethomes.com` (or your preferred email)
   - Password: Choose a secure password
6. Click **Add User**

### Step 2: Test Login Flow

1. **Start your dev server** (if not already running):
   ```powershell
   npm start
   ```

2. **Navigate to admin dashboard**:
   - Go to `http://localhost:4200/admin`
   - You should be automatically redirected to `http://localhost:4200/admin/login?returnUrl=/admin`

3. **Test login**:
   - Enter the email and password you created in Firebase
   - Check "Remember me" if you want the session to persist
   - Click "Sign In"
   - You should be redirected back to `/admin` dashboard

4. **Verify session persistence**:
   - **With "Remember Me" checked**: Close and reopen browser → still logged in
   - **Without "Remember Me"**: Close and reopen browser → logged out

### Step 3: Test Logout Flow

1. In the admin dashboard header, you'll see your email and a "Sign Out" button
2. Click **Sign Out**
3. A confirmation modal appears
4. Click **Sign Out** again to confirm
5. You should be redirected to `/admin/login` with a success notification

### Step 4: Test Error Handling

1. Try logging in with:
   - **Wrong password**: Should show "Invalid email or password"
   - **Invalid email format**: Should show "Invalid email address"
   - **Non-existent user**: Should show "User not found"

2. Try accessing `/admin` without being logged in:
   - Should redirect to `/admin/login`
   - After login, should return to `/admin`

## 🎨 Features Overview

### Login Page Features
- ✅ Email field with validation
- ✅ Password field with show/hide toggle
- ✅ Remember Me checkbox (with 30-day hint)
- ✅ Real-time error messages with shake animation
- ✅ Loading spinner during authentication
- ✅ "Back to Homepage" link
- ✅ Gradient border styling matching your site theme
- ✅ SVG background decoration
- ✅ Fully responsive (mobile-friendly)

### Security Features
- ✅ Firebase Authentication backend
- ✅ Route guard preventing unauthorized access
- ✅ Secure session management
- ✅ Auto-redirect on logout
- ✅ Error messages don't expose sensitive details

## 📁 Files Created/Modified

### New Files Created:
1. `src/app/core/auth/services/admin-auth.service.ts` - Authentication service
2. `src/app/core/auth/guards/admin.guard.ts` - Route guard
3. `src/app/core/auth/pages/admin-login.component.ts` - Login page
4. `src/app/core/auth/README.md` - Detailed documentation

### Modified Files:
1. `src/app/app.routes.ts` - Added guard and login route
2. `src/app/pages/admin/admin.component.ts` - Added logout functionality
3. `src/app/pages/admin/admin.component.html` - Added logout UI

## 🐛 Troubleshooting

### Issue: "User not found" error
**Solution**: Make sure you've created an admin user in Firebase Console

### Issue: Can't access admin page after login
**Solution**: 
- Check browser console for errors
- Verify Firebase configuration in `environment.ts`
- Ensure Firebase Auth is enabled in Firebase Console

### Issue: Remember Me not working
**Solution**:
- Check browser localStorage is enabled
- Clear browser cache and try again
- Check Firebase persistence settings

### Issue: Redirected to login but returnUrl is missing
**Solution**: This is normal if you navigate directly to `/admin/login`

## 📞 Need Help?

Check the detailed documentation in:
- `src/app/core/auth/README.md` - Complete authentication system docs
- Firebase Console - For user management
- Browser DevTools Console - For runtime errors

## ✨ What's Next?

The authentication system is production-ready! Optional enhancements:
- Password reset functionality
- Two-factor authentication
- Admin role levels
- Session timeout warnings
- Activity logging
