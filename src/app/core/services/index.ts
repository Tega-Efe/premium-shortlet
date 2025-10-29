// Service exports
// 
// SERVICE ARCHITECTURE:
// - apartment-browsing.service.ts: PUBLIC read-only browsing, filtering, searching
// - apartment-management.service.ts: ADMIN CRUD operations, availability management
// - simplified-booking.service.ts: Booking operations (create, approve, reject)
// - email-notification.service.ts: Email notifications via Django API
// - notification.service.ts: In-app notifications (toasts, alerts)
// - storage.service.ts: LocalStorage/SessionStorage utilities
// - theme.service.ts: Dark/light theme management
// - loading.service.ts: Global loading state
//
export * from './notification.service';
export * from './storage.service';
export * from './theme.service';
export * from './email-notification.service';
export * from './simplified-booking.service';
export * from './apartment-browsing.service';
export * from './apartment-management.service';
export * from './loading.service';

