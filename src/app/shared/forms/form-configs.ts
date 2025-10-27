import { Validators } from '@angular/forms';
import { FormConfig } from './form-field.config';
import { ValidationUtils } from '../../core/utils';

/**
 * Example: Booking Form Configuration
 * This can be used with the DynamicFormComponent
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
 * Example: Contact Form Configuration
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
 * Example: Filter Form Configuration
 */
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
