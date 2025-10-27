# Shortlet Connect

An Angular application with Firebase integration for authentication, Firestore database, and cloud storage.

## 🚀 Features

- ✅ **Firebase Authentication**
  - Email/Password authentication
  - Google Sign-in
  - Password reset
  - Email verification
  
- ✅ **Firestore Database**
  - Real-time data synchronization
  - CRUD operations
  - Query helpers
  - Real-time listeners

- ✅ **Cloud Storage**
  - File upload with progress tracking
  - File deletion
  - Multiple file uploads
  - Download URLs

- ✅ **Angular Best Practices**
  - Standalone components
  - Signals for state management
  - Lazy loading routes
  - Route guards
  - Reactive forms

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account (free tier)
- Angular CLI (`npm install -g @angular/cli`)

## 🔧 Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or "Create a project"
3. Enter project name: `shortlet-connect` (or your preferred name)
4. Disable Google Analytics (optional for free tier)
5. Click "Create Project"

### 2. Register Your Web App

1. In your Firebase project dashboard, click the **Web** icon (`</>`)
2. Register your app with a nickname (e.g., "Shortlet Connect Web")
3. **Don't enable Firebase Hosting yet** (we'll do this later)
4. Copy the Firebase configuration object

### 3. Configure Firebase in Your App

1. Open `src/environments/environment.ts`
2. Replace the placeholder values with your Firebase config:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

3. Do the same for `src/environments/environment.prod.ts`

### 4. Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Save
3. Enable **Google**:
   - Click on "Google"
   - Toggle "Enable"
   - Select a support email
   - Save

### 5. Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. **Choose Production mode** (we have custom rules)
4. Select your preferred location (choose closest to your users)
5. Click "Enable"

### 6. Deploy Firestore Rules

From your project directory, run:

```bash
firebase deploy --only firestore:rules
```

### 7. Set Up Cloud Storage

1. In Firebase Console, go to **Storage**
2. Click "Get started"
3. Start in **production mode** (we have custom rules)
4. Select your storage location
5. Click "Done"

### 8. Deploy Storage Rules

```bash
firebase deploy --only storage
```

### 9. Update Firebase Project Configuration

1. Open `.firebaserc` file
2. Replace `YOUR_PROJECT_ID` with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## 💻 Installation & Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`

### Build for Production

```bash
ng build
```

The build artifacts will be stored in `dist/shortlet-connect/browser/`.

## 🚀 Firebase Hosting Deployment

### 1. Login to Firebase

```bash
firebase login
```

### 2. Initialize Firebase (if not already done)

```bash
firebase init
```

Select:
- Hosting
- Use existing project
- Choose your project
- Public directory: `dist/shortlet-connect/browser`
- Configure as single-page app: **Yes**
- Set up automatic builds with GitHub: **No** (optional)

### 3. Build and Deploy

```bash
ng build --configuration production
firebase deploy --only hosting
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/              # Home component
│   │   ├── login/             # Login component
│   │   └── signup/            # Signup component
│   ├── guards/
│   │   └── auth.guard.ts      # Route guards
│   ├── services/
│   │   ├── auth.service.ts    # Authentication service
│   │   ├── firestore.service.ts  # Firestore operations
│   │   └── storage.service.ts    # Storage operations
│   ├── app.config.ts          # App configuration
│   └── app.routes.ts          # Route definitions
├── environments/
│   ├── environment.ts         # Development config
│   └── environment.prod.ts    # Production config
└── ...

```

## 🔐 Firebase Security Rules

### Firestore Rules (`firestore.rules`)

The default rules allow:
- Authenticated users to read all documents
- Users to write only their own documents
- Public posts with author-only editing

### Storage Rules (`storage.rules`)

The default rules allow:
- Public read access
- Authenticated write access with file size limits:
  - Profile images: 5MB max (images only)
  - General uploads: 10MB max

## 🛡️ Authentication Features

### Available Auth Methods

- **Email/Password**: Traditional authentication
- **Google Sign-in**: OAuth authentication
- **Password Reset**: Email-based password recovery
- **Email Verification**: Verify user email addresses

### Using Auth Service

```typescript
import { AuthService } from './services/auth.service';

// Sign up
await this.authService.signUp(email, password, displayName);

// Sign in
await this.authService.signIn(email, password);

// Google sign in
await this.authService.signInWithGoogle();

// Sign out
await this.authService.signOut();

// Get current user
const user = this.authService.getCurrentUser();
```

## 📊 Firestore Usage

### Using Firestore Service

```typescript
import { FirestoreService } from './services/firestore.service';

// Add document
const docId = await this.firestoreService.addDocument('posts', {
  title: 'Hello World',
  content: 'My first post'
});

// Get document
const post = await this.firestoreService.getDocument('posts', docId);

// Update document
await this.firestoreService.updateDocument('posts', docId, {
  title: 'Updated Title'
});

// Delete document
await this.firestoreService.deleteDocument('posts', docId);

// Real-time listener
const unsubscribe = this.firestoreService.listenToCollection(
  'posts',
  (posts) => console.log(posts)
);
```

## 📦 Storage Usage

### Using Storage Service

```typescript
import { StorageService } from './services/storage.service';

// Upload file
const downloadURL = await this.storageService.uploadFile(
  'images/photo.jpg',
  file
);

// Upload with progress
const uploadTask = this.storageService.uploadFileWithProgress(
  'images/photo.jpg',
  file
);

uploadTask.on('state_changed',
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
  }
);

// Delete file
await this.storageService.deleteFile('images/photo.jpg');
```

## 🎨 Customization

### Update Styles

Global styles are in `src/styles.css`. Component-specific styles are in each component file.

### Add New Routes

1. Create your component in `src/app/components/`
2. Add route in `src/app/app.routes.ts`
3. Optionally protect with `authGuard` or `guestGuard`

## 🆓 Free Tier Limitations

This setup uses only Firebase features available in the **Spark Plan (Free)**:

### ✅ What's Included (Free)
- Authentication: 10K verifications/month
- Firestore: 1GB storage, 50K reads, 20K writes, 20K deletes per day
- Storage: 5GB storage, 1GB downloads per day
- Hosting: 10GB storage, 360MB downloads per day

### ❌ What's NOT Included (Requires Blaze Plan)
- Cloud Functions
- Cloud Firestore location in multiple regions
- Firebase Extensions
- Test Lab (more than 10 tests per day)

## 📝 Environment Variables

Never commit your Firebase credentials to version control! The `environment.ts` files are typically gitignored in production apps.

For production, consider using:
- Environment variables
- Secret management services
- Firebase App Check for added security

## 🐛 Troubleshooting

### Firebase deployment fails
- Ensure you're logged in: `firebase login`
- Check your project ID in `.firebaserc`
- Build the app first: `ng build --configuration production`

### Authentication not working
- Verify Firebase config in environment files
- Check that auth methods are enabled in Firebase Console
- Ensure you're using the correct project

### Firestore permission denied
- Check your security rules in `firestore.rules`
- Redeploy rules: `firebase deploy --only firestore:rules`
- Verify user is authenticated

## 📚 Resources

- [Angular Documentation](https://angular.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [AngularFire Documentation](https://github.com/angular/angularfire)
- [Firebase Console](https://console.firebase.google.com/)

## 📄 License

MIT

## 👨‍💻 Support

For issues and questions, please create an issue in the repository.

---

**Happy Coding! 🚀**
