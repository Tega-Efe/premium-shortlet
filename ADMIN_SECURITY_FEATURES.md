# Admin Security Features Documentation

## 🔐 Security Measures Implemented

Your admin authentication system now includes **5 layers of security** to protect against unauthorized access:

---

## 1. Single Device Login Enforcement

### How It Works
- Only **ONE device** can be logged in at a time with the same admin account
- When you log in from a new device, the previous session is automatically terminated
- The other device receives an alert and is immediately logged out

### Technical Implementation
- Uses Firestore `admin-sessions` collection to track active sessions
- Each login creates a unique session ID
- Real-time listener monitors for session changes
- If a different session ID is detected, current session is forcefully logged out

### User Experience
```
Device A: Logged in and working
Device B: Admin logs in with same credentials
Device A: 🚨 Alert: "Your session has been terminated because you logged in from another device."
Device A: Automatically redirected to login page
```

---

## 2. Automatic Inactivity Logout

### How It Works
- System monitors user activity (mouse movements, keyboard, scrolling, touches)
- After **15 minutes of inactivity**, user is automatically logged out
- Activity timer resets with any user interaction

### Configuration
```typescript
// In admin-auth.service.ts
private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

// To change timeout, modify this value:
// 10 minutes = 10 * 60 * 1000
// 30 minutes = 30 * 60 * 1000
```

### User Experience
```
Admin working... (activity detected)
15 minutes pass with no mouse/keyboard activity
🚨 Alert: "You have been logged out due to inactivity."
Automatically redirected to login page
```

---

## 3. Auto-Logout on Route Change

### How It Works
- System monitors navigation events
- If admin navigates away from `/admin` routes (to `/`, `/home`, etc.)
- User is automatically logged out

### Protected Routes
```
✅ Can stay logged in:
- /admin (main dashboard)
- /admin/* (any admin sub-route)

❌ Auto-logout triggers:
- / (home page)
- /home (apartment page)
- Any non-admin route
```

### User Experience
```
Admin Dashboard: Logged in, viewing bookings
Clicks "Back to Homepage" in browser
🚪 System detects route change to non-admin area
Automatically logged out
Redirected to login page
```

---

## 4. Login Page Protection

### How It Works
- If an admin is already logged in, they **cannot** access the login page
- Attempting to visit `/admin/login` while authenticated redirects to `/admin`
- Prevents multiple login attempts from the same browser

### Guard Implementation
```typescript
// login.guard.ts
- Checks if user is already authenticated
- If yes → redirect to /admin dashboard
- If no → allow access to login page
```

### User Experience
```
Admin: Already logged in
Types /admin/login in browser
🔒 Guard intercepts navigation
Redirects to /admin dashboard
Message: "Already authenticated - redirecting to admin dashboard"
```

---

## 5. Session Termination Messages

### How It Works
- When logged out by the system (not manual logout), user sees specific reason
- Helps user understand why they need to log in again

### Messages
1. **Another Device Login**:
   - "Your session was terminated because you logged in from another device."
   
2. **Inactivity Timeout**:
   - "You have been logged out due to inactivity."

3. **Route Change**:
   - "User navigated away from admin area - logging out"

---

## 🔧 Configuration Options

### Change Inactivity Timeout
Edit `src/app/core/auth/services/admin-auth.service.ts`:

```typescript
// Line ~53
private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; // Current: 15 minutes

// Examples:
private readonly INACTIVITY_TIMEOUT = 5 * 60 * 1000;   // 5 minutes
private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000;  // 30 minutes
private readonly INACTIVITY_TIMEOUT = 60 * 60 * 1000;  // 1 hour
```

### Disable Auto-Logout on Route Change
Edit `src/app/core/auth/services/admin-auth.service.ts`:

```typescript
// Line ~65
// Comment out this line in constructor:
// this.initRouteListener();
```

### Change Session Check Interval
```typescript
// Line ~54
private readonly SESSION_CHECK_INTERVAL = 30 * 1000; // Current: 30 seconds
```

---

## 📊 Firestore Collection: admin-sessions

### Structure
```typescript
Collection: admin-sessions
Document ID: {userId} // Firebase Auth UID

Document Fields:
{
  userId: string;           // Firebase Auth UID
  sessionId: string;        // Unique session identifier
  deviceInfo: string;       // Browser/platform info
  lastActivity: Timestamp;  // Last user activity
  loginTime: Timestamp;     // When session started
  isActive: boolean;        // Session status
}
```

### Example Document
```json
{
  "userId": "abc123xyz",
  "sessionId": "session_1698765432_x7k2m9p",
  "deviceInfo": "Windows - Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "lastActivity": "2025-10-30T14:23:15.000Z",
  "loginTime": "2025-10-30T13:45:00.000Z",
  "isActive": true
}
```

---

## 🔒 Firestore Security Rules

Updated rules in `firestore.rules`:

```javascript
// Admin Sessions collection
match /admin-sessions/{userId} {
  // Only authenticated admin can read/write their own session
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

**Security Benefits:**
- ✅ Users can only access their own session document
- ✅ Prevents other users from terminating sessions
- ✅ Requires authentication to read/write sessions

---

## 🧪 Testing the Security Features

### Test 1: Single Device Login
1. Open browser A → log in to admin
2. Open browser B (or incognito) → log in with same credentials
3. Check browser A → should show alert and redirect to login

### Test 2: Inactivity Timeout
1. Log in to admin dashboard
2. Wait 15 minutes without any activity
3. Should show alert and redirect to login

### Test 3: Route Change Logout
1. Log in to admin dashboard
2. Navigate to `/` or `/home` using browser address bar
3. Should automatically log out

### Test 4: Login Page Protection
1. Log in to admin dashboard
2. Try to navigate to `/admin/login`
3. Should redirect to `/admin` dashboard

### Test 5: Session Termination Message
1. Log in from device A
2. Log in from device B
3. Device A should show specific termination message on login page

---

## 🚀 Deployment Steps

### 1. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 2. Verify in Firebase Console
1. Go to Firestore Database
2. You should see `admin-sessions` collection after first login
3. Check security rules are applied

### 3. Test All Features
- Test single-device login
- Test inactivity timeout
- Test route change logout
- Test login page protection

---

## ⚠️ Important Notes

### Session Persistence
- **Remember Me checked**: Session persists across browser restarts
- **Remember Me unchecked**: Session expires when browser closes
- Both options still enforce single-device login

### Manual Logout vs Auto-Logout
- **Manual logout**: User clicks "Sign Out" button
- **Auto-logout**: System terminates session (inactivity, route change, another device)
- Auto-logout includes specific reason in query params

### Browser Refresh
- ✅ Refreshing admin page maintains session
- ✅ Activity timer continues running
- ✅ Single-device enforcement still active

### Multiple Tabs
- ✅ Multiple tabs in same browser = ONE session
- ✅ All tabs share same activity monitoring
- ✅ Logout in one tab logs out all tabs

---

## 🔍 Monitoring & Debugging

### Check Active Sessions
Firebase Console → Firestore → `admin-sessions` collection

### Console Logs
```javascript
// Login from another device:
🚨 Another device has logged in - logging out this session

// Inactivity:
⏰ Inactivity timeout - logging out

// Route change:
🚪 User navigated away from admin area - logging out

// Login page protection:
🔒 Already authenticated - redirecting to admin dashboard
```

### Session Document Updates
- Activity updates every time user interacts
- Session termination sets `isActive: false`
- Old sessions remain in Firestore for audit purposes

---

## 📚 Additional Security Recommendations

### Future Enhancements
1. **IP Address Tracking**: Log IP address in session document
2. **Failed Login Attempts**: Lock account after 5 failed attempts
3. **Two-Factor Authentication**: Add 2FA for additional security
4. **Session History**: Keep log of all login attempts
5. **Email Notifications**: Send email when new device logs in
6. **Suspicious Activity**: Detect unusual login patterns

### Current Limitations
- Sessions are tracked by Firebase Auth UID only
- No email notifications for new logins
- No IP-based restrictions
- No geolocation tracking

---

## 🆘 Troubleshooting

### Issue: Multiple devices staying logged in
**Solution**: Check Firestore rules are deployed correctly

### Issue: Getting logged out too frequently
**Solution**: Increase `INACTIVITY_TIMEOUT` value

### Issue: Not getting logged out when navigating away
**Solution**: Check `initRouteListener()` is called in constructor

### Issue: Session document not created
**Solution**: Check Firestore rules allow write access for authenticated users

### Issue: Activity not detected
**Solution**: Check browser console for errors in event listeners

---

## ✅ Summary

Your admin panel now has **enterprise-level security**:

1. ✅ Only one device can be logged in at a time
2. ✅ Automatic logout after 15 minutes of inactivity
3. ✅ Automatic logout when leaving admin area
4. ✅ Login page protected from authenticated users
5. ✅ Session tracking in Firestore
6. ✅ User-friendly termination messages
7. ✅ Secure Firestore rules

**Status**: Production-ready with comprehensive security measures! 🔐
