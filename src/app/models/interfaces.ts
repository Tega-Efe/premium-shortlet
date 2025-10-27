// Example User Profile Interface
export interface UserProfile {
  id?: string;
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Example Post Interface
export interface Post {
  id?: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

// Example Comment Interface
export interface Comment {
  id?: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

// Example Shortlet Listing Interface (for shortlet-connect app)
export interface ShortletListing {
  id?: string;
  ownerId: string;
  ownerName: string;
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

// Example Booking Interface
export interface Booking {
  id?: string;
  listingId: string;
  listingTitle: string;
  guestId: string;
  guestName: string;
  ownerId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// Example Review Interface
export interface Review {
  id?: string;
  listingId: string;
  bookingId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}
