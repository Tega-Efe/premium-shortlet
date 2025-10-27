# 🏠 Shortlet Connect# 🏠 Shortlet Connect



A modern, full-featured apartment booking platform built with Angular 20, featuring a clean architecture, comprehensive dark mode, dynamic forms, and admin management.A modern, full-featured apartment booking platform built with Angular 20, featuring a clean architecture, comprehensive dark mode, dynamic forms, and admin management.



## ✨ Features## ✨ Features



### 🎯 Core Features### 🎯 Core Features



- **Smart Apartment Browsing**: Advanced filtering by price, location, bedrooms, amenities- **Smart Apartment Browsing**: Advanced filtering by price, location, bedrooms, amenities

- **Real-time Booking System**: Instant booking with dynamic form validation- **Real-time Booking System**: Instant booking with dynamic form validation

- **Admin Dashboard**: Complete booking management with approval workflow- **Admin Dashboard**: Complete booking management with approval workflow

- **Responsive Design**: Mobile-first approach with seamless desktop experience- **Responsive Design**: Mobile-first approach with seamless desktop experience

- **Performance Optimized**: OnPush change detection, lazy loading, SSR support- **Performance Optimized**: OnPush change detection, lazy loading, SSR support



### 🎨 User Experience###  User Experience



- **Complete Dark Mode**: System preference detection, smooth theme transitions- **Complete Dark Mode**: System preference detection, smooth theme transitions

- **Typing Effect Animations**: Professional typewriter effects on feature descriptions- **Typing Effect Animations**: Professional typewriter effects on feature descriptions

- **Scroll-to-Top**: Floating button with smooth scroll animation- **Scroll-to-Top**: Floating button with smooth scroll animation

- **Toast Notifications**: Real-time feedback for all user actions- **Toast Notifications**: Real-time feedback for all user actions

- **Loading States**: Professional loading indicators throughout- **Loading States**: Professional loading indicators throughout

- **Modal System**: Reusable modal components for dialogs- **Modal System**: Reusable modal components for dialogs

- **Card Components**: Consistent, beautiful apartment cards with hover effects- **Card Components**: Consistent, beautiful apartment cards with hover effects



### 🔧 Technical Features

### 🔧 Technical Features

- **Standalone Components**: Modern Angular architecture (no NgModules)

- **Signal-based State**: Reactive state management with Angular signals- **Standalone Components**: Modern Angular architecture (no NgModules)

- **Dynamic Forms**: JSON-driven form configuration system- **Signal-based State**: Reactive state management with Angular signals

- **Firebase Backend**: Firestore database with Storage for images- **Dynamic Forms**: JSON-driven form configuration system

- **TypeScript Strict Mode**: Type-safe codebase- **Firebase Backend**: Firestore database with Storage for images

- **Zoneless Change Detection**: Enhanced performance- **TypeScript Strict Mode**: Type-safe codebase

- **Complete Authentication**: Email/password, Google OAuth, password reset- **Zoneless Change Detection**: Enhanced performance

- **Dark Mode System**: Automatic browser detection, persistent preferences- **Complete Authentication**: Email/password, Google OAuth, password reset

- **Dark Mode System**: Automatic browser detection, persistent preferences

## 📚 Documentation

## � Documentation

📖 **[Complete Project Documentation](PROJECT-DOCUMENTATION.md)** - Comprehensive guide covering:

- Theme system & dark mode implementation📖 **[Complete Project Documentation](PROJECT-DOCUMENTATION.md)** - Comprehensive guide covering:

- UI/UX features (typing effects, scroll-to-top)- Theme system & dark mode implementation

- Technical architecture & best practices- UI/UX features (typing effects, scroll-to-top)

- Testing & quality assurance- Technical architecture & best practices

- Deployment guide- Testing & quality assurance

- Future enhancements- Deployment guide

- Future enhancements

📘 **[Quick Start Guide](QUICKSTART.md)** - Get up and running in 5 minutes

📘 **[Quick Start Guide](QUICKSTART.md)** - Get up and running in 5 minutes

## 🚀 Quick Start

## 🚀 Quick Start

### Prerequisites



- Node.js (v18 or higher)

- npm or yarn### Prerequisites- **Toast Notifications**: Real-time feedback for all user actions

- Angular CLI (v20.3.0 or higher)

- Node.js (v18 or higher)

### Installation

- npm or yarn- **Loading States**: Professional loading indicators throughout  - Google Sign-in integration```bash

1. **Install dependencies**

   ```bash- Angular CLI (v20.3.0 or higher)

   npm install

   ```- **Modal System**: Reusable modal components for dialogs



2. **Configure Firebase**### Installation

   - Update `src/app/app.config.ts` with your Firebase credentials

   - Ensure Firestore and Storage are enabled in your Firebase project- **Card Components**: Consistent, beautiful apartment cards with hover effects  - Password reset functionalityng serve



3. **Run development server**1. **Install dependencies**

   ```bash

   npm start   ```bash

   # or

   ng serve   npm install

   ```

   ```### 🔧 Technical Features  - Email verification```

4. **Open browser**

   - Navigate to `http://localhost:4200`



## 📁 Project Structure2. **Configure Firebase**- **Standalone Components**: Modern Angular architecture (no NgModules)



```   - Update `src/app/app.config.ts` with your Firebase credentials

src/app/

├── core/                          # Core business logic & utilities   - Ensure Firestore and Storage are enabled in your Firebase project- **Signal-based State**: Reactive state management with Angular signals  - Protected routes with guards

│   ├── animations/                # Animation definitions

│   ├── directives/                # Global directives (scroll-to-top, click-outside)

│   ├── models/                    # TypeScript interfaces

│   └── services/                  # Singleton services (theme, auth, etc.)3. **Run development server**- **Dynamic Forms**: JSON-driven form configuration system

├── shared/                        # Shared/reusable modules

│   ├── components/                # Reusable UI components   ```bash

│   │   ├── navbar/                # Navigation with theme toggle

│   │   ├── footer/                # Footer with typing effects   npm start- **Firebase Backend**: Firestore database with Storage for imagesOnce the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

│   │   ├── card/                  # Property cards

│   │   ├── filter/                # Filter sidebar   # or

│   │   └── modal/                 # Modal dialogs

│   ├── directives/                # Shared directives (typing-effect)   ng serve- **TypeScript Strict Mode**: Type-safe codebase

│   └── forms/                     # Dynamic form system

├── pages/                         # Feature pages/routes   ```

│   ├── landing/                   # Landing page (/)

│   ├── home/                      # Apartment browsing (/browse)- **Zoneless Change Detection**: Enhanced performance- 📊 **Firestore Database**

│   └── admin/                     # Admin dashboard (/admin)

├── app.ts                         # Root component4. **Open browser**

├── app.config.ts                  # App configuration

└── app.routes.ts                  # Routing configuration   Navigate to `http://localhost:4200`

```



## 🎨 Pages Overview

## 📁 Project Structure## 🚀 Quick Start  - Real-time data synchronization## Code scaffolding

### 🏡 Landing Page (`/`)

- Hero section with theme-adaptive SVG backgrounds

- Featured apartments showcase

- Platform statistics```

- Key features with typing effect animations

src/app/

### 🏘️ Browse Apartments (`/browse`)

- Complete apartment listings with pagination├── core/                          # Core business logic & utilities### Prerequisites  - CRUD operations service

- Advanced filtering sidebar (dark mode compatible)

- Sort options (price, rating, newest)│   ├── animations/                # Animation definitions (fade, slide, scale, etc.)

- Booking modal with dynamic form

- Empty state illustrations│   ├── directives/                # Shared directives (debounce, lazy-load, etc.)- Node.js (v18 or higher)



### 👨‍💼 Admin Dashboard (`/admin`)│   ├── interfaces/                # TypeScript interfaces

- Dashboard stats (total, pending, approved, rejected)

- Three-tab interface:│   │   ├── user.interface.ts- npm or yarn  - Query helpers and filtersAngular CLI includes powerful code scaffolding tools. To generate a new component, run:

  - Pending Approvals

  - All Bookings│   │   ├── apartment.interface.ts

  - Activity History

- Booking management with approve/reject workflow│   │   ├── booking.interface.ts- Angular CLI (v20.3.0 or higher)

- Dark mode optimized tables and cards

│   │   ├── admin-action.interface.ts

## 🌙 Dark Mode

│   │   └── index.ts  - Real-time listeners

Complete dark mode implementation with:

- **Automatic Detection**: Respects system preference (`prefers-color-scheme`)│   ├── services/                  # All application services

- **Manual Toggle**: Icon-only button in navbar (sun/moon)

- **Persistent**: Saves preference to localStorage│   │   ├── api.service.ts         # HTTP & Firebase integration### Installation

- **Comprehensive**: All components adapted (cards, forms, tables, modals)

- **Smooth Transitions**: 300ms CSS transitions│   │   ├── apartment.service.ts   # Apartment CRUD & filtering

- **CSS Variables**: Centralized color management

│   │   ├── booking.service.ts     # Booking operations  - Secure rules configuration```bash

### Color Philosophy

- **Light Mode**: Warm creams (#FFF8F0) and charcoal (#2C2C2C)│   │   ├── admin.service.ts       # Admin operations

- **Dark Mode**: Soft browns (#1A1816) and light beige (#E5DFD6)

- **NOT Pure Black**: Reduces eye strain, maintains elegance│   │   ├── notification.service.ts # Toast notifications1. **Install dependencies**



## 🎬 Animations│   │   ├── firestore.service.ts   # Firestore utilities



### Typing Effect Directive│   │   ├── storage.service.ts     # Firebase Storage utilities   ```bashng generate component component-name

- Applied to 6 locations (landing features, footer)

- Character-by-character animation│   │   └── index.ts

- Configurable speed

- SSR-safe│   └── utils/                     # Utility functions   npm install



### Scroll-to-Top│       ├── date.utils.ts

- Appears after 300px scroll

- Smooth scroll animation│       ├── price.utils.ts   ```- 📁 **Cloud Storage**```

- Burgundy gradient button

- Hover effects│       ├── validation.utils.ts



### Custom Animations│       └── index.ts

- `fadeIn`: Smooth fade-in

- `slideIn`: Slide from bottom├── shared/                        # Shared/reusable modules

- `scaleIn`: Scale from center

- `staggerList`: Stagger children│   ├── components/                # Reusable UI components2. **Configure Firebase**  - File upload with progress tracking



## 🚀 Build & Deployment│   │   ├── navbar/



### Development Build│   │   ├── footer/   - Update `src/app/app.config.ts` with your Firebase credentials

```bash

npm run build│   │   ├── loader/

```

│   │   ├── modal/   - Ensure Firestore and Storage are enabled in your Firebase project  - Multiple file uploadsFor a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

### Production Build

```bash│   │   ├── toast/

npm run build:prod

```│   │   ├── card/



### Firebase Deployment│   │   ├── filter/



1. **Install Firebase CLI**│   │   └── index.ts3. **Run development server**  - File deletion

   ```bash

   npm install -g firebase-tools│   └── forms/                     # Dynamic form system

   ```

│       ├── components/   ```bash

2. **Login to Firebase**

   ```bash│       │   ├── form-field/        # Individual field component

   firebase login

   ```│       │   └── dynamic-form/      # Dynamic form wrapper   npm start  - Download URL generation```bash



3. **Deploy**│       ├── form-configs.ts        # Pre-configured forms

   ```bash

   npm run build:prod│       ├── form-field.config.ts   # Field configuration types   # or

   firebase deploy

   ```│       ├── dynamic-form.service.ts



## 📊 Performance Optimizations│       └── index.ts   ng serveng generate --help



- ✅ OnPush Change Detection├── pages/                         # Feature pages/routes

- ✅ Lazy Loading Routes

- ✅ Standalone Components│   ├── landing/                   # Landing page (/)   ```

- ✅ Zoneless Mode

- ✅ Signal-based State│   ├── home/                      # Apartment browsing (/home)

- ✅ AOT Compilation

- ✅ Server-Side Rendering│   └── admin/                     # Admin dashboard (/admin)- 🎨 **Modern UI/UX**```

- ✅ CSS Variable Theming (GPU-accelerated)

├── app.ts                         # Root component

## 🛠️ Development Tools

├── app.html                       # Root template4. **Open browser**

- **Angular**: v20.3.7

- **TypeScript**: v5.7.2├── app.css                        # Root styles

- **RxJS**: v7.8.0

- **Firebase**: Latest SDK├── app.config.ts                  # App configuration   Navigate to `http://localhost:4200`  - Responsive design

- **Font Awesome**: v6.7.2

└── app.routes.ts                  # Routing configuration

## 📝 Code Style Guide

```

Following Angular best practices:

- ✅ Standalone components

- ✅ Signal-based state management

- ✅ OnPush change detection## 🎨 Pages Overview## 📁 Project Structure  - Standalone Angular components## Building

- ✅ `input()` and `output()` functions

- ✅ Native control flow (`@if`, `@for`, `@switch`)

- ✅ `inject()` function for DI

- ✅ CSS variables for theming### 🏡 Landing Page (`/`)



## 🧪 Testing- Hero section with gradient title effect



```bash- Featured apartments showcase```  - Signal-based state management

# Unit tests

npm test- Platform statistics



# E2E tests- Key features highlightsrc/app/

npm run e2e



# Code coverage

npm run test:coverage### 🏘️ Home/Dashboard (`/home`)├── core/                          # Core utilities  - Reactive formsTo build the project run:

```

- Complete apartment listings with pagination

## 🔧 Available Scripts

- Advanced filtering sidebar│   ├── animations/                # Animation definitions

```bash

npm start                        # Start dev server- Sort options (price, rating, newest)

npm run build:prod               # Production build

npm run firebase:deploy          # Build & deploy everything- Booking modal with dynamic form│   ├── directives/                # Shared directives

npm run firebase:deploy:hosting  # Deploy only hosting

npm run firebase:deploy:rules    # Deploy security rules

npm test                         # Run unit tests

```### 👨‍💼 Admin Dashboard (`/admin`)│   └── utils/                     # Utility functions



## 🆓 Firebase Free Tier Usage- Dashboard stats (total, pending, approved, rejected)



This project uses only free Firebase features:- Three-tab interface:├── models/                        # TypeScript interfaces## 🚀 Quick Start```bash

- **Authentication**: 10K verifications/month

- **Firestore**: 1GB storage, 50K reads, 20K writes/day  - Pending Approvals

- **Storage**: 5GB storage, 1GB downloads/day

- **Hosting**: 10GB storage, 360MB downloads/day  - All Bookings├── services/                      # Application services



## 📄 License  - Activity History



This project is licensed under the MIT License.- Booking management with approve/reject workflow├── shared/                        # Shared components & formsng build



---



**Built with ❤️ using Angular 20**## 🎬 Animation System│   ├── components/               # Reusable UI components



For detailed documentation, see [PROJECT-DOCUMENTATION.md](PROJECT-DOCUMENTATION.md)


Custom animations available:│   └── forms/                    # Dynamic form system**Follow the [Quick Start Guide](QUICKSTART.md) for a 5-minute setup!**```

- `fadeIn`: Smooth fade-in effect

- `slideIn`: Slide from bottom├── pages/                         # Main application pages

- `slideDown`: Slide from top

- `scaleIn`: Scale from center│   ├── landing/                   # Landing page

- `staggerList`: Stagger children animations

│   ├── home/                      # Apartment browsing

## 🚀 Build & Deployment

│   └── admin/                     # Admin dashboard### PrerequisitesThis will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Development Build

```bash├── app.ts                         # Root component

npm run build

```├── app.config.ts                  # App configuration



### Production Build└── app.routes.ts                  # Routing configuration

```bash

npm run build:prod```- Node.js 18+ and npm## Running unit tests

```



### Firebase Deployment

## 🎨 Pages Overview- Angular CLI: `npm install -g @angular/cli`

1. **Install Firebase CLI**

   ```bash

   npm install -g firebase-tools

   ```### 🏡 Landing Page (`/`)- Firebase account (free tier)To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:



2. **Login to Firebase**- Hero section with gradient title effect

   ```bash

   firebase login- Featured apartments showcase

   ```

- Platform statistics

3. **Initialize Firebase**

   ```bash- Key features highlight### Installation```bash

   firebase init

   # Select: Hosting

   # Public directory: dist/shortet-connect/browser

   # SPA: Yes### 🏘️ Home/Dashboard (`/home`)ng test

   ```

- Complete apartment listings with pagination

4. **Deploy**

   ```bash- Advanced filtering sidebar1. Install dependencies (already done): `npm install````

   npm run build:prod

   firebase deploy- Sort options (price, rating, newest)

   ```

- Booking modal with dynamic form2. Configure Firebase (see [QUICKSTART.md](QUICKSTART.md))

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.



## 📊 Performance Optimizations

### 👨‍💼 Admin Dashboard (`/admin`)3. Run the app: `npm start`## Running end-to-end tests

- ✅ OnPush Change Detection

- ✅ Lazy Loading Routes- Dashboard stats (total, pending, approved, rejected)

- ✅ Standalone Components

- ✅ Zoneless Mode- Three-tab interface:

- ✅ Signal-based State

- ✅ AOT Compilation  - Pending Approvals

- ✅ Server-Side Rendering

  - All BookingsVisit http://localhost:4200For end-to-end (e2e) testing, run:

## 🛠️ Development Tools

  - Activity History

- **Angular CLI**: v20.3.0

- **TypeScript**: v5.7.2- Booking management with approve/reject workflow

- **RxJS**: v7.8.0

- **Firebase**: Latest SDK



## 📝 Code Style Guide## 🎬 Animation System## 📚 Documentation```bash



Following Angular best practices:

- ✅ Standalone components

- ✅ Signal-based state managementCustom animations available:ng e2e

- ✅ OnPush change detection

- ✅ `input()` and `output()` functions- `fadeIn`: Smooth fade-in effect

- ✅ Native control flow (`@if`, `@for`, `@switch`)

- ✅ `inject()` function for DI- `slideIn`: Slide from bottom- [Quick Start Guide](QUICKSTART.md) - Get up and running in 5 minutes```



## 🧪 Testing- `slideDown`: Slide from top



```bash- `scaleIn`: Scale from center- [Firebase Setup Guide](FIREBASE_SETUP.md) - Detailed Firebase configuration

# Unit tests

npm test- `staggerList`: Stagger children animations



# E2E testsAngular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

npm run e2e

## 🚀 Build & Deployment

# Code coverage

npm run test:coverage## 🔧 Available Scripts

```

### Development Build

## 📄 License

```bash## Additional Resources

This project is licensed under the MIT License.

npm run build

---

``````bash

**Built with ❤️ using Angular 20**



### Production Buildnpm start                        # Start dev serverFor more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

```bash

npm run build:prodnpm run build:prod              # Production build

```npm run firebase:deploy         # Build & deploy everything

npm run firebase:deploy:hosting # Deploy only hosting

### Firebase Deploymentnpm run firebase:deploy:rules   # Deploy security rules only

npm test                        # Run unit tests

1. **Install Firebase CLI**```

   ```bash

   npm install -g firebase-tools## 🆓 Free Tier Usage

   ```

This project uses only free Firebase features:

2. **Login to Firebase**

   ```bash- Authentication: 10K verifications/month

   firebase login- Firestore: 1GB storage, 50K reads, 20K writes/day

   ```- Storage: 5GB storage, 1GB downloads/day

- Hosting: 10GB storage, 360MB downloads/day

3. **Initialize Firebase**

   ```bash## 🚀 Deployment

   firebase init

   # Select: Hosting```bash

   # Public directory: dist/shortet-connect/browsernpm run firebase:deploy:hosting

   # SPA: Yes```

   ```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

4. **Deploy**

   ```bash## 🆘 Troubleshooting

   npm run build:prod

   firebase deploySee [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed troubleshooting.

   ```

## 📝 License

## 📊 Performance Optimizations

MIT License

- ✅ OnPush Change Detection

- ✅ Lazy Loading Routes---

- ✅ Standalone Components

- ✅ Zoneless Mode**Built with ❤️ using Angular and Firebase**

- ✅ Signal-based State
- ✅ AOT Compilation
- ✅ Server-Side Rendering

## 🛠️ Development Tools

- **Angular CLI**: v20.3.0
- **TypeScript**: v5.7.2
- **RxJS**: v7.8.0
- **Firebase**: Latest SDK

## 📝 Code Style Guide

Following Angular best practices:
- ✅ Standalone components
- ✅ Signal-based state management
- ✅ OnPush change detection
- ✅ `input()` and `output()` functions
- ✅ Native control flow (`@if`, `@for`, `@switch`)
- ✅ `inject()` function for DI

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run e2e

# Code coverage
npm run test:coverage
```

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Angular 20**
