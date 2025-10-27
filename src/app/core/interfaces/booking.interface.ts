export interface Booking {
  id?: string;
  apartmentId: string;
  apartmentTitle?: string;
  guestInfo: GuestInfo;
  bookingDetails: BookingDetails;
  pricing: BookingPricing;
  status: BookingStatus;
  payment?: PaymentInfo;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  purpose?: 'vacation' | 'business' | 'event' | 'other';
  emergencyContact?: EmergencyContact;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface BookingDetails {
  checkIn: Date;
  checkOut: Date;
  numberOfNights: number;
  numberOfGuests: number;
}

export interface BookingPricing {
  basePrice: number;
  totalPrice: number;
  currency: string;
  breakdown?: PriceBreakdown;
}

export interface PriceBreakdown {
  accommodationCost: number;
  serviceFee: number;
  cleaningFee: number;
  tax: number;
  discount?: number;
}

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'approved' 
  | 'rejected' 
  | 'cancelled' 
  | 'completed';

export interface PaymentInfo {
  method: 'card' | 'bank_transfer' | 'cash';
  status: 'pending' | 'paid' | 'refunded' | 'failed';
  transactionId?: string;
  paidAt?: Date;
}

export interface BookingFilter {
  status?: BookingStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  apartmentId?: string;
  guestEmail?: string;
  minPrice?: number;
  maxPrice?: number;
}
