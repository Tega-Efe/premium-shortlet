export interface Apartment {
  id?: string;
  title: string;
  description: string;
  location: Location;
  pricing: Pricing;
  amenities: string[];
  images: string[];
  specifications: Specifications;
  availability: Availability;
  rating?: Rating;
  featured?: boolean;
  createdAt?: Date | any;
  updatedAt?: Date | any;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates?: Coordinates;
  landmarks?: string[];
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Pricing {
  oneRoomPrice: number;
  entireApartmentPrice: number;
  currency: string;
  // Legacy field for backward compatibility
  basePrice?: number;
}

export interface Discount {
  type: 'early_bird' | 'extended_stay' | 'seasonal';
  percentage: number;
  minDays?: number;
  validFrom?: Date;
  validTo?: Date;
}

export interface Specifications {
  bedrooms: number;
  bathrooms: number;
  maxGuestsOneRoom: number;
  maxGuestsEntireApartment: number;
  // Legacy field for backward compatibility
  maxGuests?: number;
  squareMeters?: number;
  floors?: number;
}

export interface Availability {
  isAvailable: boolean;
  status: 'available' | 'booked' | 'maintenance';
  bookedDates?: DateRange[];
  blackoutDates?: DateRange[];
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface Rating {
  average: number;
  count: number;
  breakdown?: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    value: number;
  };
}
