/**
 * Simplified Booking Interface for Single Apartment Operation
 * 
 * This interface supports the scaled-down operational phase where only
 * one two-bedroom apartment is available for booking.
 * 
 * Booking Options:
 * - 'one-room': Book a single room in the apartment
 * - 'entire-apartment': Book the entire two-bedroom apartment
 */

export interface SimplifiedBooking {
  id?: string;
  
  // Apartment Reference
  apartmentId: string;  // Links booking to specific apartment
  apartmentTitle?: string;  // For display purposes
  
  // Guest Information
  guestInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;  // Where the guest is coming from
    idPhotoUrl?: string;  // Firebase Storage URL for ID photo
    idPhotoPath?: string;  // Firebase Storage path for deletion if needed
  };
  
  // Booking Details
  bookingDetails: {
    bookingOption: 'one-room' | 'entire-apartment';
    checkInDate: string;  // ISO date string
    checkOutDate: string;  // ISO date string
    numberOfNights: number;
    numberOfGuests: number;  // 4 for one-room, 5 for entire-apartment
  };

  // Pricing Information
  pricing: {
    pricePerNight: number;
    totalPrice: number;
  };
  
  // Status and Approval
  status: 'pending' | 'approved' | 'rejected';
  
  // Metadata
  createdAt?: string;  // ISO timestamp
  updatedAt?: string;  // ISO timestamp
  approvedAt?: string;  // ISO timestamp when approved
  rejectedAt?: string;  // ISO timestamp when rejected
  adminNotes?: string;  // Admin can add notes about the booking
}

/**
 * Apartment Availability Configuration
 * Stored in Firestore to control booking form visibility
 */
export interface ApartmentAvailability {
  id: 'main-apartment';  // Single apartment ID
  isAvailable: boolean;
  unavailableMessage?: string;  // Custom message when unavailable
  lastUpdated: string;  // ISO timestamp
  updatedBy?: string;  // Admin email who made the change
}

/**
 * Email Notification Payload for Django API
 */
export interface EmailNotificationPayload {
  to: string;  // Recipient email
  subject: string;
  templateType: 'booking-received' | 'booking-approved' | 'booking-rejected';
  data: {
    guestName: string;
    bookingOption: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfNights: number;
    numberOfGuests: number;
    address?: string;
    adminNotes?: string;
  };
}

/**
 * Booking Form Data (before submission)
 */
export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  numberOfNights: number;
  numberOfGuests: number;  // 4 for one-room, 5 for entire-apartment
  bookingOption: 'one-room' | 'entire-apartment';
  checkInDate: string;
  checkOutDate: string;
  idPhoto?: File;  // File object from form
}

/**
 * Admin Dashboard Statistics (Simplified)
 */
export interface SimplifiedBookingStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  isApartmentAvailable: boolean;
}
