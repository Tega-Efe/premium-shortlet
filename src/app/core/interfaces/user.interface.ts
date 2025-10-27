export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: 'guest' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Guest extends User {
  role: 'guest';
  bookingHistory?: string[];
}

export interface Admin extends User {
  role: 'admin';
  permissions: AdminPermission[];
}

export enum AdminPermission {
  VIEW_BOOKINGS = 'VIEW_BOOKINGS',
  APPROVE_BOOKINGS = 'APPROVE_BOOKINGS',
  REJECT_BOOKINGS = 'REJECT_BOOKINGS',
  MANAGE_APARTMENTS = 'MANAGE_APARTMENTS',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS'
}
