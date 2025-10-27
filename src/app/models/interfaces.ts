// Shortlet Listing Interface
export interface ShortletListing {
  id?: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  price: {
    amount: number;
    currency: string;
    period: 'night' | 'week' | 'month';
  };
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Booking Interface - Main data captured from booking forms
export interface Booking {
  id?: string;
  listingId?: string;
  listingTitle?: string;
  
  // Guest information from booking form
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  
  // Booking details
  checkIn: Date;
  checkOut: Date;
  numberOfGuests: number;
  numberOfNights?: number;
  
  // Pricing
  pricePerNight?: number;
  totalPrice: number;
  currency?: string;
  
  // Additional booking information
  specialRequests?: string;
  purpose?: string; // e.g., 'vacation', 'business', 'event'
  
  // Status tracking
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Optional: Emergency contact
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Review Interface - Optional feature for collecting feedback
export interface Review {
  id?: string;
  listingId: string;
  bookingId: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

// Contact/Inquiry Interface - For contact form submissions
export interface ContactInquiry {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: Date;
}
