# Admin Panel Responsive Testing Checklist

## Testing Date: October 28, 2025

---

## Responsive Breakpoints to Test

### 1. **Desktop (1440px+)**
- [ ] Stats grid displays in 4 columns
- [ ] All stat cards visible without scrolling
- [ ] Hover animations work on stat cards (lift, shadow, gradient overlay)
- [ ] Card icons properly sized (56px)
- [ ] Tabs display horizontally without wrapping
- [ ] Tables display all columns without horizontal scroll
- [ ] Action buttons properly spaced
- [ ] Pagination controls centered and readable

### 2. **Tablet Landscape (1024px)**
- [ ] Stats grid switches to 2x2 layout
- [ ] Cards maintain proper spacing
- [ ] Availability header switches to column layout
- [ ] Tables maintain readability
- [ ] Icon-only buttons remain accessible (36px touch targets)
- [ ] Pagination controls stack properly if needed
- [ ] Hover effects still work (for devices with mouse)

### 3. **Tablet Portrait (768px)**
- [ ] Stats grid remains 2x2
- [ ] Reduced padding on cards (1.5rem → 1rem)
- [ ] Stat icons resize (56px → 48px)
- [ ] Font sizes adjust (stat-value: 2rem → 1.75rem)
- [ ] Tables scroll horizontally if needed
- [ ] Touch targets remain minimum 44px
- [ ] Modals resize appropriately
- [ ] Form inputs stack vertically

### 4. **Mobile (480px and below)**
- [ ] Stats grid maintains 2x2 layout
- [ ] Further font size reduction (stat-value: 1.75rem → 1.375rem)
- [ ] Card content doesn't overflow
- [ ] Tabs stack or scroll horizontally
- [ ] Tables scroll horizontally smoothly
- [ ] Pagination info text wraps gracefully
- [ ] Modal content scrollable
- [ ] All buttons remain tappable (min 44px)

---

## Feature-Specific Tests

### Dashboard Cards
- [ ] Total Bookings card displays correct count
- [ ] Pending Approvals card shows correct number
- [ ] Approved Today card updates properly
- [ ] Rejected Today card shows accurate count
- [ ] Hover animations smooth (translateY(-4px), shadow increase, gradient fade-in)
- [ ] Icons properly aligned and colored
- [ ] Trend indicators display correctly

### Apartment Availability Control
- [ ] Status indicator shows correct state (Available/Unavailable)
- [ ] Toggle button displays correct text and icon
- [ ] Button hover effects work (lift, shadow)
- [ ] Loading state (spinner) shows when toggling
- [ ] Disabled state prevents multiple clicks
- [ ] Hint text updates based on availability state

### Tabs Navigation
- [ ] Active tab highlighted with blue border
- [ ] Tab hover effects work
- [ ] Tab badges show correct counts (Pending Approvals)
- [ ] Tab icons properly aligned
- [ ] Tab switching smooth with fade-in animation (0.3s)

### Pending Approvals Table
- [ ] Shows 5 entries per page
- [ ] Guest cell displays avatar, name, and email
- [ ] Nights badge shows moon icon + number
- [ ] Total displays in Naira (₦) with proper formatting
- [ ] Approve icon button (green check) visible and clickable
- [ ] Reject icon button (red X) visible and clickable
- [ ] Icon buttons scale on hover (1.1x)
- [ ] Pagination shows correct page numbers
- [ ] "Showing X to Y of Z entries" displays correctly
- [ ] Previous/Next buttons enable/disable properly
- [ ] Empty state shows when no pending bookings

### All Bookings Table
- [ ] Shows 5 entries per page
- [ ] Guest name and email display
- [ ] Booking option badge shows correct color (blue for one-room, gold for entire apartment)
- [ ] Nights badge displays correctly
- [ ] Total price in Naira (₦)
- [ ] Status badge shows correct color (yellow=pending, green=approved, red=rejected)
- [ ] View icon button (blue eye) clickable
- [ ] Pagination works correctly
- [ ] Alternating row colors visible (even rows have gray background)
- [ ] Row hover effect works (lift, shadow)

### Activity History
- [ ] Shows 5 entries per page
- [ ] Activity items display with timeline dots
- [ ] Timeline line connects items
- [ ] Activity icons show correct colors based on action type
- [ ] Admin name displays
- [ ] Timestamp formatted correctly (MMM d, y - h:mm a)
- [ ] Admin notes show when available
- [ ] Hover effect on activity items (slide right 4px)
- [ ] Pagination works
- [ ] Empty state shows when no activity

### Approval Modal
- [ ] Opens on approve/reject button click
- [ ] Shows correct guest information
- [ ] Booking option displays ("One Room" or "Entire Apartment")
- [ ] Check-in date formatted properly
- [ ] Total price shows in Naira
- [ ] Rejection reason textarea shows for reject action
- [ ] Confirm button text changes ("Approve" or "Reject")
- [ ] Modal closes properly
- [ ] Backdrop click closes modal

### Booking Details Modal
- [ ] Opens on view button click
- [ ] Guest Information section complete (name, email, phone, address, # of guests)
- [ ] Booking Information section displays all fields
- [ ] Booking option badge with icon shows
- [ ] Check-in/check-out dates formatted
- [ ] Nights badge displays
- [ ] Status badge with icon
- [ ] Price per night shows (or 0 if not available)
- [ ] Total price highlighted in burgundy
- [ ] ID photo displays if available
- [ ] Admin notes section shows if available
- [ ] Modal scrolls if content overflows
- [ ] Close button works

---

## Animation Tests

### Fade-in Animations
- [ ] Tab content fades in when switching (0.3s)
- [ ] Tables fade in when loading (0.4s)
- [ ] Empty states fade in (0.4s)

### Hover Effects
- [ ] Stat cards lift on hover (translateY(-4px))
- [ ] Stat cards show gradient overlay on hover
- [ ] Table rows lift on hover (translateY(-1px))
- [ ] Buttons lift on hover (translateY(-1px))
- [ ] Icon buttons scale on hover (1.1x)
- [ ] Status badges scale on hover (1.05x)
- [ ] Nights badges scale on hover (1.05x)
- [ ] Booking option badges scale on hover (1.05x)
- [ ] Activity items slide right on hover (translateX(4px))

### Transitions
- [ ] All transitions smooth (0.2-0.3s ease)
- [ ] No janky animations
- [ ] Hover states revert smoothly

---

## Icon Alignment Tests
- [ ] All Font Awesome icons vertically centered
- [ ] Table header icons have proper margin-right
- [ ] Button icons aligned with text
- [ ] Badge icons aligned with text
- [ ] Status badge icons correct size (0.75rem)
- [ ] Stat card icons centered in circle

---

## Color and Typography Tests
- [ ] Burgundy (#7D1935) used correctly
- [ ] Gold (#D4A574) used for accents
- [ ] Text primary readable
- [ ] Text secondary visible but subdued
- [ ] Naira symbol (₦) displays correctly
- [ ] Font sizes responsive and readable
- [ ] Font weights appropriate (600 for labels, 700 for emphasis)

---

## Cross-Browser Tests (if applicable)
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

---

## Performance Tests
- [ ] Initial load time acceptable
- [ ] Tab switching instantaneous
- [ ] Pagination changes smooth
- [ ] No layout shift during animations
- [ ] Hover effects don't cause lag
- [ ] Table scrolling smooth

---

## Accessibility Tests
- [ ] All interactive elements have proper contrast
- [ ] Touch targets minimum 44x44px on mobile
- [ ] Focus states visible on keyboard navigation
- [ ] Modal can be closed with Escape key
- [ ] Screen reader friendly (semantic HTML)
- [ ] Icon-only buttons have title attributes

---

## Edge Cases
- [ ] Empty state for pending approvals
- [ ] Empty state for all bookings
- [ ] Empty state for activity history
- [ ] Long guest names don't break layout
- [ ] Long email addresses truncate or wrap
- [ ] Many pages of pagination display correctly
- [ ] Missing pricing data shows "₦0"
- [ ] Missing ID photo section hidden

---

## Notes
- Test with Chrome DevTools responsive mode for various screen sizes
- Use "Toggle device toolbar" (Ctrl+Shift+M) to simulate mobile devices
- Test actual device if available (phone, tablet)
- Check performance tab for animation frame rate

---

## Issues Found
(Document any issues discovered during testing)

| Issue | Severity | Device/Size | Status |
|-------|----------|-------------|--------|
| | | | |

---

## Sign-off
- [ ] All critical features work on desktop
- [ ] All critical features work on tablet
- [ ] All critical features work on mobile
- [ ] Animations smooth across devices
- [ ] No console errors
- [ ] Ready for production

**Tested by:** _____________  
**Date:** October 28, 2025  
**Status:** ⬜ Pass | ⬜ Fail | ⬜ Pass with minor issues
