import { Injectable, inject, signal } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { AdminAction, ActionType, ApprovalRequest, Booking, BookingStatus } from '../interfaces';
import { ApiService } from './api.service';
import { BookingService } from './booking.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiService = inject(ApiService);
  private bookingService = inject(BookingService);

  // State management
  private adminActionsSubject = new BehaviorSubject<AdminAction[]>([]);
  public adminActions$ = this.adminActionsSubject.asObservable();

  private pendingApprovalsSubject = new BehaviorSubject<ApprovalRequest[]>([]);
  public pendingApprovals$ = this.pendingApprovalsSubject.asObservable();

  // Signals for reactive state
  public totalActions = signal<number>(0);
  public pendingApprovals = signal<number>(0);
  public isLoading = signal<boolean>(false);

  /**
   * Get all admin actions with optional filters
   */
  getAdminActions(filter?: AdminActionFilter): Observable<AdminAction[]> {
    this.isLoading.set(true);

    return this.apiService.get<AdminAction[]>('admin/actions', filter).pipe(
      tap(actions => {
        this.adminActionsSubject.next(actions);
        this.totalActions.set(actions.length);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      }),
      shareReplay(1)
    );
  }

  /**
   * Get admin actions by admin ID
   */
  getAdminActionsByAdmin(adminId: string): Observable<AdminAction[]> {
    return this.getAdminActions({ adminId });
  }

  /**
   * Get admin actions by type
   */
  getAdminActionsByType(actionType: ActionType): Observable<AdminAction[]> {
    return this.getAdminActions({ actionType });
  }

  /**
   * Get pending approval requests
   */
  getPendingApprovals(): Observable<ApprovalRequest[]> {
    this.isLoading.set(true);

    return this.apiService.get<ApprovalRequest[]>('admin/approvals/pending').pipe(
      tap(approvals => {
        this.pendingApprovalsSubject.next(approvals);
        this.pendingApprovals.set(approvals.length);
        this.isLoading.set(false);
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      }),
      shareReplay(1)
    );
  }

  /**
   * Approve booking
   */
  approveBooking(
    bookingId: string,
    adminId: string,
    notes?: string
  ): Observable<{ booking: Booking; action: AdminAction }> {
    this.isLoading.set(true);

    const actionData: Partial<AdminAction> = {
      adminId,
      adminName: '', // Will be set by backend
      action: 'APPROVE_BOOKING',
      targetId: bookingId,
      targetType: 'booking',
      details: { notes },
      timestamp: new Date()
    };

    return this.apiService.post<{ booking: Booking; action: AdminAction }>(
      `admin/bookings/${bookingId}/approve`,
      actionData
    ).pipe(
      tap(({ booking, action }) => {
        this.recordAction(action);
        this.bookingService.notifyBookingUpdate(booking);
        this.isLoading.set(false);
        this.clearCache();
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Reject booking
   */
  rejectBooking(
    bookingId: string,
    adminId: string,
    reason: string
  ): Observable<{ booking: Booking; action: AdminAction }> {
    this.isLoading.set(true);

    const actionData: Partial<AdminAction> = {
      adminId,
      adminName: '', // Will be set by backend
      action: 'REJECT_BOOKING',
      targetId: bookingId,
      targetType: 'booking',
      details: { reason, notes: reason },
      timestamp: new Date()
    };

    return this.apiService.post<{ booking: Booking; action: AdminAction }>(
      `admin/bookings/${bookingId}/reject`,
      actionData
    ).pipe(
      tap(({ booking, action }) => {
        this.recordAction(action);
        this.bookingService.notifyBookingUpdate(booking);
        this.isLoading.set(false);
        this.clearCache();
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update booking status (generic admin action)
   */
  updateBookingStatus(
    bookingId: string,
    adminId: string,
    status: BookingStatus,
    notes?: string
  ): Observable<{ booking: Booking; action: AdminAction }> {
    this.isLoading.set(true);

    const actionData: Partial<AdminAction> = {
      adminId,
      adminName: '', // Will be set by backend
      action: 'UPDATE_APARTMENT', // Generic update action
      targetId: bookingId,
      targetType: 'booking',
      details: { notes, newValue: status },
      timestamp: new Date()
    };

    return this.apiService.patch<{ booking: Booking; action: AdminAction }>(
      `admin/bookings/${bookingId}/status`,
      { status, ...actionData }
    ).pipe(
      tap(({ booking, action }) => {
        this.recordAction(action);
        this.bookingService.notifyBookingUpdate(booking);
        this.isLoading.set(false);
        this.clearCache();
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete booking (admin action)
   */
  deleteBooking(
    bookingId: string,
    adminId: string,
    reason: string
  ): Observable<AdminAction> {
    this.isLoading.set(true);

    const actionData: Partial<AdminAction> = {
      adminId,
      adminName: '', // Will be set by backend
      action: 'CANCEL_BOOKING',
      targetId: bookingId,
      targetType: 'booking',
      details: { reason, notes: reason },
      timestamp: new Date()
    };

    return this.apiService.delete<AdminAction>(
      `admin/bookings/${bookingId}`
    ).pipe(
      tap(action => {
        this.recordAction(action);
        this.isLoading.set(false);
        this.clearCache();
      }),
      catchError(error => {
        this.isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get booking history (all admin actions for a booking)
   */
  getBookingHistory(bookingId: string): Observable<AdminAction[]> {
    return this.apiService.get<AdminAction[]>(`admin/bookings/${bookingId}/history`);
  }

  /**
   * Get admin dashboard statistics
   */
  getDashboardStats(): Observable<AdminDashboardStats> {
    return this.apiService.get<AdminDashboardStats>('admin/dashboard/stats').pipe(
      shareReplay(1)
    );
  }

  /**
   * Get recent admin activity
   */
  getRecentActivity(limit: number = 10): Observable<AdminAction[]> {
    return this.getAdminActions({ limit }).pipe(
      map(actions => this.sortActionsByDate(actions, 'desc').slice(0, limit))
    );
  }

  /**
   * Filter admin actions locally
   */
  filterAdminActions(actions: AdminAction[], filter: AdminActionFilter): AdminAction[] {
    return actions.filter(action => {
      // Admin ID filter
      if (filter.adminId && action.adminId !== filter.adminId) {
        return false;
      }

      // Action type filter
      if (filter.actionType && action.action !== filter.actionType) {
        return false;
      }

      // Target type filter
      if (filter.targetType && action.targetType !== filter.targetType) {
        return false;
      }

      // Date range filter
      if (filter.dateRange) {
        const actionDate = new Date(action.timestamp);
        if (actionDate < filter.dateRange.start || actionDate > filter.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Sort actions by date
   */
  sortActionsByDate(
    actions: AdminAction[],
    order: 'asc' | 'desc' = 'desc'
  ): AdminAction[] {
    const sorted = [...actions];
    return sorted.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Record admin action locally
   */
  private recordAction(action: AdminAction): void {
    const currentActions = this.adminActionsSubject.value;
    this.adminActionsSubject.next([action, ...currentActions]);
    this.totalActions.set(currentActions.length + 1);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.apiService.clearCache('admin');
    this.bookingService.clearCache();
  }
}

export interface AdminActionFilter {
  adminId?: string;
  actionType?: ActionType;
  targetType?: 'booking' | 'apartment' | 'user';
  dateRange?: {
    start: Date;
    end: Date;
  };
  limit?: number;
}

export interface AdminDashboardStats {
  totalBookings: number;
  pendingApprovals: number;
  approvedToday: number;
  rejectedToday: number;
  totalRevenue: number;
  revenueThisMonth: number;
  activeAdmins: number;
  totalActions: number;
}
