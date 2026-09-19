export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api', // Production API URL
  firebase: {
    apiKey: "AIzaSyDIS034JeQMWf9iT0WuBuVjuVyxc3sDRu4",
    authDomain: "shortlet-connect.firebaseapp.com",
    projectId: "shortlet-connect",
    storageBucket: "shortlet-connect.appspot.com",
    messagingSenderId: "605241409683",
    appId: "1:605241409683:web:68fffdf1da9f09b4384d66",
    measurementId: "G-270LHK7D02"
  },
  emailApi: {
    useMock: true, // Flip to false only once url/apiKey below point at a real, live backend
    url: 'https://your-django-api.com/api/notifications/send',
    apiKey: '', // See the security note in email-notification.service.ts before filling this in
    adminEmail: 'admin@shortletconnect.com'
  }
};