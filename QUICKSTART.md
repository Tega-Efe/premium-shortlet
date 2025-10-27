# 🚀 Quick Start Guide - Shortlet Connect

## Step-by-Step Setup (5 minutes)

### 1. ✅ Install Dependencies (Already Done!)
Your project is already set up with all necessary packages.

### 2. 🔥 Set Up Firebase

#### A. Create Firebase Project
1. Visit: https://console.firebase.google.com/
2. Click "Add project" 
3. Name it: `shortlet-connect`
4. Disable Google Analytics (optional)
5. Click "Create Project"

#### B. Get Firebase Config
1. Click the **Web** icon (`</>`) in project overview
2. Register app nickname: "Shortlet Connect"
3. Copy the config object that looks like this:
```javascript
{
  apiKey: "AIza...",
  authDomain: "shortlet-connect.firebaseapp.com",
  projectId: "shortlet-connect",
  storageBucket: "shortlet-connect.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:..."
}
```

#### C. Update Your App Config
1. Open: `src/environments/environment.ts`
2. Replace the placeholder values with your Firebase config
3. Open: `src/environments/environment.prod.ts`
4. Do the same

#### D. Update Firebase Project ID
1. Open: `.firebaserc`
2. Replace `YOUR_PROJECT_ID` with your actual project ID

### 3. 🔐 Enable Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (select support email)

### 4. 📊 Create Firestore Database

1. In Firebase Console → **Firestore Database**
2. Click "Create database"
3. Choose **Production mode**
4. Select your region (closest to your users)
5. Click "Enable"

### 5. 📁 Enable Cloud Storage

1. In Firebase Console → **Storage**
2. Click "Get started"
3. Start in **production mode**
4. Select your region
5. Click "Done"

### 6. 🚀 Deploy Security Rules

Open PowerShell in your project directory and run:

```powershell
firebase login
firebase deploy --only firestore:rules,storage:rules
```

### 7. ▶️ Run Your App!

```powershell
npm start
```

Visit: http://localhost:4200

## 🎉 You're Ready!

Your app is now fully configured with:
- ✅ Authentication (Email/Password + Google)
- ✅ Firestore Database
- ✅ Cloud Storage
- ✅ Security Rules

## 📱 Test the Features

1. **Sign Up**: Create a new account at `/signup`
2. **Login**: Sign in at `/login`
3. **Google Sign-in**: Try the Google authentication button
4. **View Profile**: See your user info on the home page

## 🚀 Deploy to Firebase Hosting

When you're ready to deploy:

```powershell
npm run firebase:deploy:hosting
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

## 🆘 Need Help?

Check out `FIREBASE_SETUP.md` for detailed documentation.

## 📝 Quick Commands

```powershell
# Start development server
npm start

# Build for production
npm run build:prod

# Deploy everything to Firebase
npm run firebase:deploy

# Deploy only hosting
npm run firebase:deploy:hosting

# Deploy only security rules
npm run firebase:deploy:rules

# Login to Firebase
npm run firebase:login
```

## 🎨 Next Steps

- Customize the UI in `src/app/components/`
- Add your own Firestore collections
- Implement file uploads with Storage service
- Add more authentication providers
- Create protected routes with `authGuard`

---

**Happy Building! 🎉**
