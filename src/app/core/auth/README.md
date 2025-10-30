# Admin Authentication System

This directory contains the complete authentication system for the admin dashboard.

## 📁 Structure

```
src/app/core/auth/
├── services/
│   └── admin-auth.service.ts    # Firebase authentication service
├── guards/
│   └── admin.guard.ts            # Route protection guard
├── pages/
│   └── admin-login.component.ts  # Login page UI
└── README.md                     # This file
```

## 🔐 Features

### 1. **Admin Authentication Service** (`admin-auth.service.ts`)
- Firebase email/password authentication
- Remember Me functionality using Firebase persistence
  - `browserLocalPersistence`: Session persists across browser restarts (30 days)
  - `browserSessionPersistence`: Session expires when browser closes
- Automatic auth state monitoring
- Comprehensive error handling with user-friendly messages
- Reactive state management using Angular signals

### 2. **Route Guard** (`admin.guard.ts`)
- Protects `/admin` route from unauthorized access
- Waits for Firebase auth initialization before checking state
- Preserves `returnUrl` in query params for post-login redirect
- Automatically redirects unauthenticated users to `/admin/login`

### 3. **Login Page** (`admin-login.component.ts`)
- Beautiful UI matching site theme (burgundy/tan/sage colors)
- Gradient border styling on form inputs
- Email and password fields with validation
- Password visibility toggle
- Remember Me checkbox with helpful hint
- Real-time error display
- Loading states during login
- Responsive design for all screen sizes
- Decorative SVG background

## 🚀 Usage

### Login Flow
1. User navigates to `/admin` or clicks "Admin" in navbar
2. If not authenticated, guard redirects to `/admin/login?returnUrl=/admin`
3. User enters credentials and optionally checks "Remember Me"
4. On success, redirected to original URL or `/admin`
5. Session persists based on "Remember Me" selection

### Logout Flow
1. User clicks "Sign Out" button in admin header
2. Confirmation modal appears
3. On confirm, Firebase signs out and redirects to `/admin/login`
4. Success notification shown

## 🔧 Configuration

### Routes Setup (app.routes.ts)
```typescript
import { adminGuard } from './core/auth/guards/admin.guard';

{
  path: 'admin/login',
  loadComponent: () => import('./core/auth/pages/admin-login.component')
},
{
  path: 'admin',
  loadComponent: () => import('./pages/admin/admin.component'),
  canActivate: [adminGuard]  // Protected route
}
```

### Firebase Setup
Ensure Firebase Auth is configured in your environment:
- Email/Password authentication enabled in Firebase Console
- Firebase config in `environment.ts`

## 🧪 Testing Checklist

### Authentication Tests
- [ ] Login with valid credentials
- [ ] Login with invalid email (should show error)
- [ ] Login with wrong password (should show error)
- [ ] Remember Me checked - session persists after browser restart
- [ ] Remember Me unchecked - session expires when browser closes
- [ ] Password visibility toggle works
- [ ] Form validation prevents empty submissions

### Route Guard Tests
- [ ] Accessing `/admin` without login redirects to `/admin/login`
- [ ] After login, redirects to original URL (returnUrl)
- [ ] Logged-in users can access `/admin` directly
- [ ] Logout redirects to `/admin/login`

### UI/UX Tests
- [ ] Login form displays correctly on desktop
- [ ] Login form displays correctly on mobile (responsive)
- [ ] Error messages display properly
- [ ] Loading states show during login
- [ ] Success notification shows on login
- [ ] Admin email displays in dashboard header
- [ ] Logout confirmation modal works
- [ ] "Back to Homepage" link works

## 🎨 Styling

The login page uses:
- CSS custom properties from global theme
- Gradient borders matching site design (burgundy → tan → sage)
- Responsive font sizes using `clamp()`
- Animations (fadeIn, shake, slideIn)
- Dark mode support

## 🔑 Security Features

1. **Firebase Authentication**: Production-grade auth backend
2. **Route Guards**: Prevent unauthorized route access
3. **Session Management**: Configurable persistence
4. **Error Handling**: No sensitive error details exposed to user
5. **Auto-redirect**: Logged-in users skip login page

## 📝 Admin Credentials

Set up admin credentials in Firebase Console:
1. Go to Firebase Console → Authentication → Users
2. Add user with email/password
3. Use these credentials to log into the admin portal

## 🐛 Common Issues

### "User not found" error
- Ensure admin user exists in Firebase Authentication Users tab

### Login successful but immediately logged out
- Check Firebase Auth configuration
- Verify persistence is properly set

### Route guard not working
- Ensure guard is imported in `app.routes.ts`
- Check that Firebase is initialized before route check

### Remember Me not working
- Check browser localStorage permissions
- Verify Firebase persistence API calls

## 📚 Dependencies

- `@angular/fire/auth`: Firebase Authentication
- `@angular/router`: Route guards and navigation
- `@angular/core`: Signals and dependency injection
- `rxjs`: Observable state management

## 🔄 Future Enhancements

- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Session timeout warnings
- [ ] Login attempt rate limiting
- [ ] Admin role-based permissions
- [ ] Activity logging
