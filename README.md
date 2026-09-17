# Shortlet Connect — Project README

**Project:** Shortlet Connect (repo: `premium-shortlet`)
**Stack:** Angular 18+ (Signals, standalone components, OnPush), Firebase (Firestore, Auth, Storage), Font Awesome 6
**Domain:** Single-apartment (now multi-apartment-ready) shortlet booking platform, Victoria Island, Lagos. Pricing in Naira (₦).

This file consolidates the 18 separate documentation/summary files that had accumulated in the repo root. It keeps the information that's still relevant for running, extending, and debugging the app, and drops the parts that were just point-in-time change logs. Original files can be deleted once this is reviewed.

---

## 1. Architecture Overview

### Services
| Service | Role | Used by |
|---|---|---|
| `apartment-browsing.service.ts` (renamed from `apartment.service.firestore.ts`) | **Public**, read-only: browse, filter, search, sort, featured listings | Home, Landing, Filter |
| `apartment-management.service.ts` | **Admin**: full CRUD, availability/date-blocking, bulk updates | Admin panel, booking service |
| `simplified-booking.service.ts` | All booking operations (create/approve/reject, availability checks, date blocking) | Home, Admin |
| `email-notification.service.ts` | Calls a Django backend API to send booking emails | Booking service |
| `notification.service.ts` | In-app toasts/alerts | All components |
| `storage.service.ts`, `theme.service.ts`, `loading.service.ts`, `form-auto-save.service.ts` | Local storage, dark/light theme, global loading, form auto-save | Various |

**Keep these two apartment services separate** — they were flagged as looking like duplicates in an audit, but they serve different concerns (public browsing vs. admin CRUD/availability) and should stay split with clear naming rather than merged.

### Data Model (Firestore)

**`apartments/{apartmentId}`**
```typescript
{
  id, title, description,
  location: { address, city, state, country },
  pricing: { oneRoomPrice, entireApartmentPrice, currency },
  specifications: { bedrooms, bathrooms, maxGuestsOneRoom, maxGuestsEntireApartment },
  amenities: string[],
  images: string[],
  availability: {
    isAvailable: boolean,
    status: 'available' | 'booked' | 'maintenance',
    bookedDates?: DateRange[],     // auto-populated when a booking is approved
    blackoutDates?: DateRange[],   // manually set by admin (offline bookings/maintenance)
    hiddenUntil?: Date             // set when admin hides for a fixed duration
  },
  featured: boolean
}
```

**`simplified-bookings/{bookingId}`** (nested structure — replaced an older flat/unused `booking.interface.ts`)
```typescript
{
  id, apartmentId, apartmentTitle,
  guestInfo: { name, email, phone, address, idPhotoUrl?, idPhotoPath? },
  bookingDetails: { bookingOption: 'one-room'|'entire-apartment', checkInDate, checkOutDate, numberOfNights, numberOfGuests },
  pricing: { pricePerNight, totalPrice },   // required, always populated
  status: 'pending' | 'approved' | 'rejected',
  createdAt, updatedAt, approvedAt?, rejectedAt?, adminNotes?
}
```
`numberOfGuests` auto-defaults: One Room → 4, Entire Apartment → 5.

**`admin-sessions/{userId}`** — session tracking for single-device login (see §4).

---

## 2. Availability & Booking Logic

### Automatic date blocking
- Approving a booking **automatically** adds its date range to the apartment's `bookedDates[]` (re-checks availability first to avoid race conditions, uses `forkJoin` to update booking + apartment atomically).
- Rejecting a booking does **not** block dates.
- Admin can also manually block dates via `blackoutDates[]` for offline/phone bookings or maintenance, independent of the booking flow.
- Apartment `status` is auto-derived from whether "today" falls inside a booked/blackout range.

### Overlap detection (hotel-style: check-in inclusive, checkout exclusive)
```typescript
private datesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  const normalize = (d: Date) => { const n = new Date(d); n.setHours(0,0,0,0); return n.getTime(); };
  const [s1,e1,s2,e2] = [normalize(start1), normalize(end1), normalize(start2), normalize(end2)];
  return s1 < e2 && e1 > s2;
}
```
Dates **must** be normalized to midnight before comparing — the original bug was that overlapping bookings (e.g. an approved Dec 5–8 booking not blocking a new Dec 4–7 request) slipped through due to time-of-day noise. Back-to-back bookings (checkout day = check-in day) are correctly **allowed**.

| Existing: Dec 5–8 | New booking | Result |
|---|---|---|
| — | Dec 1–4 | ✅ allowed |
| — | Dec 9–12 | ✅ allowed |
| — | Dec 1–5 or Dec 8–11 | ✅ allowed (back-to-back) |
| — | Dec 4–7, Dec 6–9, Dec 3–10, Dec 6–7, Dec 5–8 | ❌ blocked (real overlap) |

### Key service methods
- `checkApartmentAvailabilityForDates()` — checks a date range against both `bookedDates` and `blackoutDates`.
- `blockApartmentDates()` — called on approval.
- `manuallyBlockDates()` / `unblockDates()` — admin offline management.
- `getApartmentBookedDates()` — for calendar UI.
- `createBooking()` now **requires `apartmentId`** (breaking change from earlier flat version) and auto-fetches/populates `apartmentTitle` from the apartment doc.

### Debugging
Console logging (🔍 checking availability, 📅 comparing ranges, ❌ overlap detected, 🔒 blocking dates, ✅ success) was added throughout the availability/approval flow for tracing conflicts. **Strip these before shipping to production**, keeping only `console.error` calls.

---

## 3. Admin Panel

### Dashboard
- 4 stat cards (Total Bookings, Pending, Approved Today, Rejected Today) in a responsive grid: 4 cols desktop → 2×2 at 1024px and below, with clamp()-based fluid typography.
- Tabs: **Pending Approvals**, **All Bookings**, **Activity History**, **Manage Listing**. Angular Signals drive per-tab pagination (5 entries/page) via `computed()` slices.

### Tables
- **Pending Approvals**: guest (avatar+email), nights badge, total (₦), icon-only approve/reject.
- **All Bookings**: adds booking-option badge (blue=one-room, gold=entire) and color-coded status badge; view icon opens the details modal.
- **Activity History**: timeline feed of approve/reject/availability-update actions with admin name, timestamp, notes.

### Modals
- **Approval modal**: guest summary, dates, price, rejection-reason textarea when rejecting.
- **Booking details modal**: full guest info, full booking info, ID photo (if uploaded), admin notes.

### Manage Listing / Apartment CRUD
Admins can create, edit, delete apartments and toggle availability directly from the panel (title, description, pricing, amenities, address). Multi-apartment support exists at the data/service layer (`apartment-management.service.ts`); the booking-form apartment selector UI is still commented out pending single vs. multi-apartment decision (see §7).

### Hide/Show apartment (bug fix)
Signals don't support plain `[(ngModel)]` two-way binding — this silently broke the Hide/Show modal. Fixed by splitting into explicit getter/setter bindings:
```html
<input [ngModel]="hideDurationDays()" (ngModelChange)="hideDurationDays.set($event)" />
```
Also required an explicit `this.hideDurationModal.openModal()` call. Supports "Hide Now" (indefinite) or "Hide for N Days" (with optional reason and computed return date).

### Design tokens
```css
--color-burgundy: #7D1935;   --color-gold: #D4A574;
--bg-primary: #ffffff;       --bg-secondary: #f9fafb;
--text-primary: #1f2937;     --text-secondary: #6b7280;
--border-color: #e5e7eb;
```
Animations: 0.3s tab fade-in, 0.4s table fade-in, card hover lift (`translateY(-4px)`), row hover lift, icon buttons scale 1.1×, badges scale 1.05×, activity rows slide right 4px.

---

## 4. Admin Authentication & Security

Firebase Auth email/password login at `/admin/login`, guarding the `/admin` route (with `returnUrl` preservation).

**Five layers implemented:**
1. **Single-device login** — Firestore `admin-sessions/{userId}` doc + real-time listener; a new login anywhere invalidates the old session and force-logs it out with an alert.
2. **Inactivity auto-logout** — default 15 min (`INACTIVITY_TIMEOUT` in `admin-auth.service.ts`), resets on mouse/keyboard/scroll/touch.
3. **Route-change auto-logout** — navigating outside `/admin/*` logs the admin out.
4. **Login-page guard** — an already-authenticated admin hitting `/admin/login` is redirected straight to `/admin`.
5. **Session-termination messaging** — specific reason shown on next login page visit (another-device login vs. inactivity vs. navigation).

Config knobs (`admin-auth.service.ts`): `INACTIVITY_TIMEOUT`, `SESSION_CHECK_INTERVAL` (default 30s), and commenting out `initRouteListener()` to disable #3.

Firestore rule for sessions:
```javascript
match /admin-sessions/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```
Notes: refreshing the page and using multiple tabs both preserve one session; manual "Sign Out" still works alongside all auto-logout paths. Known gaps: no IP tracking, no failed-login lockout, no 2FA, no new-device email alerts — flagged as future work.

---

## 5. Backend / Firebase Setup

### Root cause of the classic CORS error
Firebase **Storage was never initialized** in the console, and the storage bucket name was wrong.
```typescript
// Fix in environment.ts / environment.prod.ts
storageBucket: "shortlet-connect.appspot.com"   // NOT "shortlet-connect.firebasestorage.app"
```
**Fix procedure:** Firebase Console → Storage → Get Started → Next → pick a region (e.g. `us-central1`) → Done → `firebase deploy --only storage`. Then hard-restart `ng serve` and hard-reload the browser.

### Collections requiring rules
`simplified-bookings`, `apartment-availability`, `apartments`, `admin-sessions`. Firestore rules were deployed; storage rules require Storage to be enabled first (see above). A production-ready rules sketch (auth-gated writes for apartments/bookings, public read) is included in `IMPLEMENTATION_SUMMARY.md`'s history — apply before going live, since dev rules are public read/write.

### ID photo upload (Firebase Storage)
Currently **disabled by design** — the two booking-service variants (`simplified-booking.service.ts` and a since-deleted `-no-storage` variant) were consolidated into one file with the Storage code commented out but preserved. When an ID photo is provided but storage is off, it's logged to console only, not uploaded; booking still saves fine.

**To re-enable:** in `simplified-booking.service.ts`, uncomment (in order) the Storage imports, `private storage = inject(Storage)`, the storage branch inside `createBooking()` (and remove/disable the no-storage branch), and the `uploadIdPhoto()` method. Also add storage rules limiting `booking-ids/` to authenticated writers, image content-type, and a 5MB size cap.

### Email notifications
Wired to call a Django REST API (`email-notification.service.ts`) for: new-booking admin alert, approval, rejection. Currently optional — failures are silent and don't block booking creation. Needs `DJANGO_API_URL` / API key set per environment before it's functional.

---

## 6. Custom Date Picker

A themed calendar component (`date-picker.component.ts`) replaces native `<input type="date">` for consistent cross-browser UX. Implements `ControlValueAccessor`, drives state via Signals (`isOpen`, `selectedDate`, `currentMonth`, computed `calendarDays`/`displayValue`).

Features: month navigation, "Today" and "Clear" shortcuts, `minDate`/`maxDate` constraints (used for `futureDateValidator()` on check-in/out), Escape-to-close, click-outside-to-close, 42-cell (6-week) grid with greyed adjacent-month days, burgundy-gradient selected state.

**Known limitations:** single-date only (no range picker), no time selection, no year/month quick-jump, US-English date format only, no built-in ARIA support. Listed as future work: a combined check-in/check-out range picker, unavailable-date shading pulled from the booking service, and localization.

---

## 7. Codebase Cleanup History (for context, not action items)

These consolidations already happened — noted so nobody reintroduces the duplicates:
- **Booking services**: `simplified-booking-no-storage.service.ts` was merged into `simplified-booking.service.ts` (storage code kept but commented out) and then deleted. All components import the one service now.
- **Apartment services**: kept as two, renamed `apartment.service.firestore.ts` → `apartment-browsing.service.ts` for clarity (public browsing vs. admin management — see §1).
- **Deleted**: unused `booking.interface.ts` (superseded by `SimplifiedBooking`), unused `form-configs.ts` (superseded by `simplified-form-configs.ts`).
- **Open item flagged but not resolved**: possible duplication between `debounce-click.directive.ts` and `prevent-double-click.directive.ts` — worth a diff before adding new directives.
- **Known stale file**: `scripts/cleanup-bookings.ts` still points at an old Firebase project (`premium-shortlet` instead of `shortlet-connect`) — update its config or remove before running it.

---

## 8. Local Dev Quick Reference

```bash
npm install
ng serve                                   # http://localhost:4200
ng build --configuration production
ng test
firebase deploy --only firestore:rules
firebase deploy --only storage             # after enabling Storage in console
firebase deploy                            # full deploy
npx ts-node scripts/seed-firestore.ts      # reseed sample apartment + bookings
```

**Full DB reset procedure:** delete `apartments`, `simplified-bookings`, `apartment-availability`, `users` collections in the Firebase console, then rerun the seed script. The seed data includes two pre-approved bookings (Nov 15–18, Dec 1–15) already reflected in the apartment's `bookedDates`, useful for immediately testing overlap rejection.

---

## 9. Outstanding / Future Work

- Apartment selector in the booking form (multi-apartment booking UI — service layer is ready, UI is commented out).
- Real Firestore CRUD for "Manage Listing" apartment images (currently simulated for images).
- Auto-unhide scheduled job for apartments hidden for a fixed duration (currently requires a cron/Cloud Function — sketch included in `FIXES_ADMIN_BOOKING_ISSUES.md` history).
- Calendar view of blocked/booked dates, CSV export, revenue/analytics dashboard.
- Production Firestore/Storage security rules (restrict from current public dev rules), rate limiting on booking submission.
- 2FA, failed-login lockout, IP/device logging for admin auth.
- Strip debug `console.log` tracing from the booking/availability flow before production.
- Update or retire `scripts/cleanup-bookings.ts`.
