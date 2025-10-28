import { Validators } from '@angular/forms';
import { FormConfig } from './form-field.config';
import { ValidationUtils } from '../../core/utils';

/**
 * SIMPLIFIED BOOKING FORM (Single Apartment Operation)
 * 
 * This form configuration is designed for the scaled-down operational phase
 * where only one two-bedroom apartment is available.
 * 
 * Fields:
 * - Guest name, email, phone, address
 * - ID photo upload (for identification)
 * - Booking option (one room vs entire apartment)
 * - Check-in/check-out dates
 * - Number of nights
 */
export const simplifiedBookingFormConfig: FormConfig = {
  fields: [
    // Section: Guest Information
    {
      name: 'guestName',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      validators: [
        Validators.required,
        Validators.minLength(3)
      ],
      errorMessages: {
        required: 'Please enter your full name',
        minlength: 'Name must be at least 3 characters'
      }
    },
    {
      name: 'guestEmail',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your.email@example.com',
      validators: [
        Validators.required,
        Validators.email
      ],
      errorMessages: {
        required: 'Email is required',
        email: 'Please enter a valid email address'
      },
      hint: 'We will send your booking confirmation to this email'
    },
    {
      name: 'guestPhone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+234 800 123 4567',
      validators: [
        Validators.required,
        ValidationUtils.phoneValidator()
      ],
      errorMessages: {
        required: 'Phone number is required',
        phone: 'Please enter a valid phone number'
      },
      hint: 'Include country code (e.g., +234 for Nigeria)'
    },
    {
      name: 'guestAddress',
      label: 'Your Address',
      type: 'textarea',
      placeholder: 'Enter your full address (where you are coming from)',
      rows: 3,
      validators: [
        Validators.required,
        Validators.minLength(10)
      ],
      errorMessages: {
        required: 'Please provide your address',
        minlength: 'Address must be at least 10 characters'
      },
      hint: 'Provide your full residential address for verification purposes'
    },
    {
      name: 'idPhoto',
      label: 'Upload ID Photo',
      type: 'file',
      accept: 'image/jpeg,image/png,image/jpg',
      placeholder: 'Choose a photo of your ID (passport, driver license, etc.)',
      validators: [
        Validators.required
      ],
      errorMessages: {
        required: 'Please upload a photo of your ID for verification'
      },
      hint: 'Accepted formats: JPG, PNG. Max size: 5MB. For security purposes only.'
    },
    
    // Section: Booking Details
    {
      name: 'bookingOption',
      label: 'Booking Option',
      type: 'select',
      options: [
        { 
          label: 'Book One Room', 
          value: 'one-room',
          icon: 'fas fa-door-open'
        },
        { 
          label: 'Book Entire Apartment (2 Bedrooms)', 
          value: 'entire-apartment',
          icon: 'fas fa-home'
        }
      ],
      placeholder: 'Choose your booking preference',
      validators: [Validators.required],
      errorMessages: {
        required: 'Please select a booking option'
      },
      hint: 'Choose whether to book one room or the entire apartment'
    },
    {
      name: 'checkInDate',
      label: 'Check-in Date',
      type: 'date',
      validators: [
        Validators.required,
        ValidationUtils.futureDateValidator()
      ],
      errorMessages: {
        required: 'Please select check-in date',
        futureDate: 'Check-in date must be in the future'
      },
      hint: 'Select the date you plan to arrive'
    },
    {
      name: 'checkOutDate',
      label: 'Check-out Date',
      type: 'date',
      validators: [
        Validators.required,
        ValidationUtils.futureDateValidator()
      ],
      errorMessages: {
        required: 'Please select check-out date',
        futureDate: 'Check-out date must be in the future'
      },
      hint: 'Select the date you plan to leave'
    },
    {
      name: 'numberOfNights',
      label: 'Number of Nights',
      type: 'number',
      min: 1,
      max: 90,
      step: 1,
      value: 1,
      validators: [
        Validators.required,
        Validators.min(1),
        Validators.max(90)
      ],
      errorMessages: {
        required: 'Please enter number of nights',
        min: 'Minimum stay is 1 night',
        max: 'Maximum stay is 90 nights'
      },
      hint: 'Minimum 1 night, maximum 90 nights'
    }
  ],
  submitLabel: 'Submit Booking Request',
  showReset: true,
  resetLabel: 'Clear Form',
  layout: 'vertical'
};


/**
 * ORIGINAL BOOKING FORM (Multi-Apartment - COMMENTED OUT FOR SCALE-DOWN)
 * 
 * This configuration is preserved for when the business scales back up.
 * To re-enable: Replace usage of simplifiedBookingFormConfig with bookingFormConfig
 */
export const bookingFormConfig: FormConfig = {
  fields: [
    {
      name: 'guestName',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      validators: [
        Validators.required,
        Validators.minLength(3)
      ],
      errorMessages: {
        required: 'Please enter your name',
        minlength: 'Name must be at least 3 characters'
      }
    },
    {
      name: 'guestEmail',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your.email@example.com',
      validators: [
        Validators.required,
        Validators.email
      ],
      errorMessages: {
        required: 'Email is required',
        email: 'Please enter a valid email address'
      }
    },
    {
      name: 'guestPhone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+1234567890',
      validators: [
        Validators.required,
        ValidationUtils.phoneValidator()
      ],
      hint: 'Include country code'
    },
    {
      name: 'checkIn',
      label: 'Check-in Date',
      type: 'date',
      validators: [
        Validators.required,
        ValidationUtils.futureDateValidator()
      ]
    },
    {
      name: 'checkOut',
      label: 'Check-out Date',
      type: 'date',
      validators: [
        Validators.required,
        ValidationUtils.futureDateValidator()
      ]
    },
    {
      name: 'numberOfGuests',
      label: 'Number of Guests',
      type: 'number',
      min: 1,
      max: 10,
      step: 1,
      value: 1,
      validators: [
        Validators.required,
        Validators.min(1),
        ValidationUtils.minimumGuestsValidator(1)
      ]
    },
    {
      name: 'purpose',
      label: 'Purpose of Stay',
      type: 'select',
      options: [
        { label: 'Vacation', value: 'vacation' },
        { label: 'Business', value: 'business' },
        { label: 'Event', value: 'event' },
        { label: 'Other', value: 'other' }
      ],
      validators: [Validators.required]
    },
    {
      name: 'specialRequests',
      label: 'Special Requests',
      type: 'textarea',
      placeholder: 'Any special requests or requirements?',
      rows: 4,
      hint: 'Optional - let us know if you have any special needs'
    }
  ],
  submitLabel: 'Complete Booking',
  showReset: true,
  resetLabel: 'Clear Form',
  layout: 'vertical'
};

/**
 * Contact Form Configuration (UNCHANGED)
 */
export const contactFormConfig: FormConfig = {
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Your name',
      validators: [Validators.required]
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'your@email.com',
      validators: [Validators.required, Validators.email]
    },
    {
      name: 'subject',
      label: 'Subject',
      type: 'text',
      placeholder: 'What is this about?',
      validators: [Validators.required]
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Your message...',
      rows: 5,
      validators: [Validators.required, Validators.minLength(10)]
    }
  ],
  submitLabel: 'Send Message',
  showReset: false,
  layout: 'vertical'
};

/**
 * Filter Form Configuration (COMMENTED OUT FOR SCALE-DOWN)
 * 
 * Filters are not needed for single-apartment operation
 * To re-enable: Uncomment and restore to filter component
 */
/* 
export const filterFormConfig: FormConfig = {
  fields: [
    {
      name: 'priceRange',
      label: 'Max Price',
      type: 'number',
      placeholder: 'Maximum price',
      min: 0
    },
    {
      name: 'bedrooms',
      label: 'Bedrooms',
      type: 'select',
      options: [
        { label: 'Any', value: '' },
        { label: '1 Bedroom', value: 1 },
        { label: '2 Bedrooms', value: 2 },
        { label: '3+ Bedrooms', value: 3 }
      ]
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'City or area'
    },
    {
      name: 'amenities',
      label: 'Amenities',
      type: 'checkbox',
      placeholder: 'WiFi, Pool, Parking, etc.'
    }
  ],
  submitLabel: 'Apply Filters',
  showReset: true,
  resetLabel: 'Clear',
  layout: 'horizontal'
};
*/
