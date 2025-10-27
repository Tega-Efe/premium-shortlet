export interface AdminAction {
  id?: string;
  adminId: string;
  adminName: string;
  action: ActionType;
  targetType: 'booking' | 'apartment' | 'user';
  targetId: string;
  details: ActionDetails;
  timestamp: Date;
}

export type ActionType = 
  | 'APPROVE_BOOKING' 
  | 'REJECT_BOOKING' 
  | 'CANCEL_BOOKING'
  | 'UPDATE_APARTMENT'
  | 'DELETE_APARTMENT'
  | 'BAN_USER';

export interface ActionDetails {
  reason?: string;
  notes?: string;
  previousValue?: any;
  newValue?: any;
}

export interface ApprovalRequest {
  bookingId: string;
  action: 'approve' | 'reject';
  reason?: string;
  notes?: string;
}
