# Shortlet Connect 🏠# ShortletConnect



A modern Angular web application with complete Firebase integration for building shortlet rental platforms. Features authentication, real-time database, cloud storage, and Firebase hosting - all on the free tier!This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.6.



## 🌟 Features## Development server



- 🔐 **Complete Authentication System**To start a local development server, run:

  - Email/Password authentication

  - Google Sign-in integration```bash

  - Password reset functionalityng serve

  - Email verification```

  - Protected routes with guards

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

- 📊 **Firestore Database**

  - Real-time data synchronization## Code scaffolding

  - CRUD operations service

  - Query helpers and filtersAngular CLI includes powerful code scaffolding tools. To generate a new component, run:

  - Real-time listeners

  - Secure rules configuration```bash

ng generate component component-name

- 📁 **Cloud Storage**```

  - File upload with progress tracking

  - Multiple file uploadsFor a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

  - File deletion

  - Download URL generation```bash

ng generate --help

- 🎨 **Modern UI/UX**```

  - Responsive design

  - Standalone Angular components## Building

  - Signal-based state management

  - Reactive formsTo build the project run:



## 🚀 Quick Start```bash

ng build

**Follow the [Quick Start Guide](QUICKSTART.md) for a 5-minute setup!**```



### PrerequisitesThis will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.



- Node.js 18+ and npm## Running unit tests

- Angular CLI: `npm install -g @angular/cli`

- Firebase account (free tier)To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:



### Installation```bash

ng test

1. Install dependencies (already done): `npm install````

2. Configure Firebase (see [QUICKSTART.md](QUICKSTART.md))

3. Run the app: `npm start`## Running end-to-end tests



Visit http://localhost:4200For end-to-end (e2e) testing, run:



## 📚 Documentation```bash

ng e2e

- [Quick Start Guide](QUICKSTART.md) - Get up and running in 5 minutes```

- [Firebase Setup Guide](FIREBASE_SETUP.md) - Detailed Firebase configuration

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## 🔧 Available Scripts

## Additional Resources

```bash

npm start                        # Start dev serverFor more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

npm run build:prod              # Production build
npm run firebase:deploy         # Build & deploy everything
npm run firebase:deploy:hosting # Deploy only hosting
npm run firebase:deploy:rules   # Deploy security rules only
npm test                        # Run unit tests
```

## 🆓 Free Tier Usage

This project uses only free Firebase features:

- Authentication: 10K verifications/month
- Firestore: 1GB storage, 50K reads, 20K writes/day
- Storage: 5GB storage, 1GB downloads/day
- Hosting: 10GB storage, 360MB downloads/day

## 🚀 Deployment

```bash
npm run firebase:deploy:hosting
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

## 🆘 Troubleshooting

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed troubleshooting.

## 📝 License

MIT License

---

**Built with ❤️ using Angular and Firebase**
