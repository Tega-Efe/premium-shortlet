import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, BookingService, NotificationService } from '../../core/services';
import { SimplifiedBookingService } from '../../core/services/simplified-booking.service'; // NEW: For single-apartment operations
import { Booking, AdminAction } from '../../core/interfaces';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AnimateOnScrollDirective } from '../../core/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, ModalComponent, AnimateOnScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin.component.html',
  styles: [`
    .admin-page {
      min-height: 100vh;
      background: var(--bg-primary);
      padding-bottom: 3rem;
    }

    .admin-header {
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
      color: white;
      padding: 3rem 0;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .page-subtitle {
      font-size: 1.125rem;
      margin: 0;
      opacity: 0.9;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin: -2rem 0 2rem;
    }

    .stat-card {
      background: var(--bg-secondary);
      padding: 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-label {
      margin: 0 0 0.25rem 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .stat-value {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    /* NEW: Availability Control Card */
    .availability-control-card {
      background: var(--bg-secondary);
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
      margin-bottom: 2rem;
    }

    .availability-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid var(--border-color);
    }

    .availability-info {
      flex: 1;
    }

    .availability-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .availability-title i {
      color: #d4a574;
    }

    .availability-description {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.9375rem;
      line-height: 1.6;
    }

    .availability-status {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      border-radius: 2rem;
      font-weight: 600;
      font-size: 1rem;
      white-space: nowrap;
    }

    .availability-status.available {
      background: #d1fae5;
      color: #065f46;
    }

    .availability-status.unavailable {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    .availability-status.available .status-indicator {
      background: #10b981;
    }

    .availability-status.unavailable .status-indicator {
      background: #ef4444;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .availability-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .btn-toggle-availability {
      padding: 0.875rem 2rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }

    .btn-toggle-availability.make-unavailable {
      background: #fee2e2;
      color: #991b1b;
    }

    .btn-toggle-availability.make-unavailable:hover:not(:disabled) {
      background: #fecaca;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);
    }

    .btn-toggle-availability.make-available {
      background: #d1fae5;
      color: #065f46;
    }

    .btn-toggle-availability.make-available:hover:not(:disabled) {
      background: #a7f3d0;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
    }

    .btn-toggle-availability:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .availability-hint {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .availability-hint i {
      color: #d4a574;
    }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid var(--border-color);
    }

    .tab {
      padding: 1rem 1.5rem;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      color: var(--text-secondary);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: -2px;
    }

    .tab:hover {
      color: #3b82f6;
    }

    .tab.active {
      color: #3b82f6;
      border-bottom-color: #3b82f6;
    }

    /* Tab Content */
    .tab-content {
      background: var(--bg-secondary);
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
      min-height: 400px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    /* Table */
    .table-container {
      overflow-x: auto;
    }

    .bookings-table {
      width: 100%;
      border-collapse: collapse;
    }

    .bookings-table th,
    .bookings-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    .bookings-table th {
      background-color: var(--bg-primary);
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.875rem;
      text-transform: uppercase;
    }

    .bookings-table tbody tr:hover {
      background-color: var(--bg-primary);
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-pending {
      background-color: #fef3c7;
      color: #92400e;
    }

    .status-confirmed,
    .status-approved {
      background-color: #dcfce7;
      color: #166534;
    }

    .status-rejected,
    .status-cancelled {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .status-completed {
      background-color: #dbeafe;
      color: #1e40af;
    }

    /* Buttons */
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.375rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
    }

    .btn-success {
      background-color: #10b981;
      color: white;
    }

    .btn-success:hover {
      background-color: #059669;
    }

    .btn-danger {
      background-color: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background-color: #dc2626;
    }

    .btn-outline {
      background-color: transparent;
      color: #3b82f6;
      border: 1px solid #3b82f6;
    }

    .btn-outline:hover {
      background-color: #eff6ff;
    }

    /* Activity List */
    .activity-list {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-radius: 0.5rem;
      background-color: var(--bg-primary);
      border: 1px solid var(--border-color);
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .icon-APPROVE_BOOKING {
      background-color: #dcfce7;
    }

    .icon-REJECT_BOOKING {
      background-color: #fee2e2;
    }

    .icon-CANCEL_BOOKING {
      background-color: #fef3c7;
    }

    .activity-content {
      flex: 1;
    }

    .activity-title {
      margin: 0 0 0.25rem 0;
      font-weight: 600;
      color: var(--text-primary);
    }

    .activity-meta {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
      display: flex;
      gap: 0.5rem;
    }

    .activity-notes {
      margin: 0.5rem 0 0 0;
      font-size: 0.875rem;
      color: #6b7280;
      font-style: italic;
    }

    /* Empty State */
    .empty-state {
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-text {
      color: #6b7280;
      font-size: 1.125rem;
      margin: 0;
    }

    /* Modal Content */
    .approval-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .approval-question {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .booking-details {
      background-color: #f9fafb;
      padding: 1.5rem;
      border-radius: 0.5rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-label {
      color: #6b7280;
      font-weight: 500;
    }

    .detail-value {
      color: #1f2937;
      font-weight: 600;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-weight: 600;
      color: #374151;
    }

    .form-control {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-family: inherit;
      resize: vertical;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .details-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .details-heading {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .special-requests {
      padding: 1rem;
      background-color: #f9fafb;
      border-radius: 0.5rem;
      color: #374151;
      line-height: 1.6;
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }

      .admin-header {
        padding: 2rem 0;
      }

      .page-title {
        font-size: 2rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .tabs {
        overflow-x: auto;
      }

      .tab {
        white-space: nowrap;
      }

      .table-container {
        font-size: 0.875rem;
      }

      .bookings-table th,
      .bookings-table td {
        padding: 0.75rem 0.5rem;
      }

      .action-buttons {
        flex-direction: column;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  private adminService = inject(AdminService);
  private bookingService = inject(BookingService);
  private simplifiedBookingService = inject(SimplifiedBookingService); // NEW: For single-apartment operations
  private notificationService = inject(NotificationService);

  @ViewChild('approvalModal') approvalModal!: ModalComponent;
  @ViewChild('detailsModal') detailsModal!: ModalComponent;

  // Data signals
  allBookings = signal<Booking[]>([]);
  pendingBookings = signal<Booking[]>([]);
  adminActions = signal<AdminAction[]>([]);
  stats = signal({
    totalBookings: 0,
    pendingApprovals: 0,
    approvedToday: 0,
    rejectedToday: 0
  });

  // NEW: Apartment availability control for single-apartment mode
  isApartmentAvailable = this.simplifiedBookingService.isApartmentAvailable;
  isTogglingAvailability = signal<boolean>(false);

  // UI state signals
  activeTab = signal<string>('pending');
  isLoading = signal<boolean>(false);
  showApprovalModal = signal<boolean>(false);
  showDetailsModal = signal<boolean>(false);
  selectedBooking = signal<Booking | null>(null);
  approvalAction = signal<'approve' | 'reject'>('approve');
  rejectionReason = '';

  // Mock admin ID (in real app, this would come from auth)
  adminId = 'admin-001';
  adminName = 'Admin User';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    
    // Load all bookings
    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        this.allBookings.set(bookings);
        this.updateStats(bookings);
        this.isLoading.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load bookings');
        this.isLoading.set(false);
      }
    });

    // Load pending bookings
    this.bookingService.getPendingBookings().subscribe({
      next: (bookings) => {
        this.pendingBookings.set(bookings);
      }
    });

    // Load admin actions
    this.adminService.getRecentActivity(20).subscribe({
      next: (actions) => {
        this.adminActions.set(actions);
      }
    });
  }

  updateStats(bookings: Booking[]): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      totalBookings: bookings.length,
      pendingApprovals: bookings.filter(b => b.status === 'pending').length,
      approvedToday: bookings.filter(b => 
        b.status === 'approved' && 
        new Date(b.updatedAt) >= today
      ).length,
      rejectedToday: bookings.filter(b => 
        b.status === 'rejected' && 
        new Date(b.updatedAt) >= today
      ).length
    };

    this.stats.set(stats);
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

  openApprovalModal(booking: Booking, action: 'approve' | 'reject'): void {
    this.selectedBooking.set(booking);
    this.approvalAction.set(action);
    this.rejectionReason = '';
    this.showApprovalModal.set(true);
    if (this.approvalModal) {
      const title = action === 'approve' ? 'Approve Booking' : 'Reject Booking';
      this.approvalModal.openModal(title);
    }
  }

  closeApprovalModal(): void {
    this.showApprovalModal.set(false);
    this.selectedBooking.set(null);
    if (this.approvalModal) {
      this.approvalModal.close();
    }
  }

  confirmApproval(): void {
    const booking = this.selectedBooking();
    if (!booking || !booking.id) return;

    const action = this.approvalAction();
    
    if (action === 'approve') {
      this.adminService.approveBooking(booking.id, this.adminId).subscribe({
        next: () => {
          this.notificationService.success('Booking approved successfully');
          this.closeApprovalModal();
          this.loadData();
        },
        error: () => {
          this.notificationService.error('Failed to approve booking');
        }
      });
    } else {
      if (!this.rejectionReason.trim()) {
        this.notificationService.error('Please provide a reason for rejection');
        return;
      }

      this.adminService.rejectBooking(booking.id, this.adminId, this.rejectionReason).subscribe({
        next: () => {
          this.notificationService.success('Booking rejected');
          this.closeApprovalModal();
          this.loadData();
        },
        error: () => {
          this.notificationService.error('Failed to reject booking');
        }
      });
    }
  }

  viewBookingDetails(booking: Booking): void {
    this.selectedBooking.set(booking);
    this.showDetailsModal.set(true);
    if (this.detailsModal) {
      this.detailsModal.openModal('Booking Details');
    }
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
    this.selectedBooking.set(null);
    if (this.detailsModal) {
      this.detailsModal.close();
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending':
        return 'fas fa-clock';
      case 'confirmed':
      case 'approved':
        return 'fas fa-check-circle';
      case 'rejected':
      case 'cancelled':
        return 'fas fa-times-circle';
      case 'completed':
        return 'fas fa-flag-checkered';
      default:
        return 'fas fa-info-circle';
    }
  }

  getActionIconClass(action: string): string {
    switch (action) {
      case 'APPROVE_BOOKING':
        return 'fas fa-check-circle';
      case 'REJECT_BOOKING':
        return 'fas fa-times-circle';
      case 'CANCEL_BOOKING':
        return 'fas fa-ban';
      default:
        return 'fas fa-circle';
    }
  }

  getActionIcon(action: string): string {
    switch (action) {
      case 'APPROVE_BOOKING':
        return '✓';
      case 'REJECT_BOOKING':
        return '✕';
      case 'CANCEL_BOOKING':
        return '⚠';
      default:
        return '•';
    }
  }

  getActionDescription(action: AdminAction): string {
    const actionType = action.action.toLowerCase().replace('_', ' ');
    return `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} - Booking #${action.targetId.slice(0, 8)}`;
  }

  // NEW: Toggle apartment availability for single-apartment mode
  async toggleApartmentAvailability(): Promise<void> {
    this.isTogglingAvailability.set(true);
    try {
      const newStatus = !this.isApartmentAvailable();
      const message = newStatus ? undefined : 'Apartment is currently unavailable for booking';
      
      await this.simplifiedBookingService.toggleApartmentAvailability(
        newStatus,
        message,
        this.adminName
      ).toPromise();
      
      const statusText = newStatus ? 'available' : 'unavailable';
      this.notificationService.success(`Apartment marked as ${statusText}`);
    } catch (error) {
      this.notificationService.error('Failed to update availability');
    } finally {
      this.isTogglingAvailability.set(false);
    }
  }
}

