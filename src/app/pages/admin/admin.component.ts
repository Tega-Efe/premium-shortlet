import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService, LoadingService } from '../../core/services';
import { SimplifiedBookingService } from '../../core/services/simplified-booking.service'; // For single-apartment operations
import { ApartmentManagementService } from '../../core/services/apartment-management.service';
import { SimplifiedBooking, AdminAction, Apartment } from '../../core/interfaces';
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
    /* Global Icon Alignment */
    i {
      vertical-align: middle;
    }

    .admin-page {
      min-height: 100vh;
      background: var(--bg-primary);
      padding-bottom: 2rem;
    }

    .admin-header {
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
      color: white;
      padding: 2rem 0;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.25rem;
    }

    .page-title {
      font-size: clamp(1.5rem, 4vw, 2.125rem);
      font-weight: 700;
      margin: 0 0 0.375rem 0;
      color: white;
    }

    .page-subtitle {
      font-size: clamp(0.8125rem, 1.8vw, 1rem);
      margin: 0;
      opacity: 0.9;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin: -1.5rem 0 1.5rem;
    }

    .stat-card {
      background: var(--bg-secondary);
      padding: 1rem;
      border-radius: 0.625rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(125, 25, 53, 0.05) 0%, rgba(212, 165, 116, 0.05) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      border-color: var(--color-burgundy);
    }

    .stat-card:hover::before {
      opacity: 1;
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .stat-content {
      flex: 1;
      position: relative;
      z-index: 1;
      min-width: 0;
    }

    .stat-label {
      margin: 0 0 0.25rem 0;
      color: var(--text-secondary);
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .stat-value {
      margin: 0 0 0.125rem 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.6875rem;
      color: var(--text-secondary);
      margin-top: 0.25rem;
    }

    .stat-trend i {
      font-size: 0.75rem;
    }

    .stat-trend.positive {
      color: var(--color-sage, #A8B4A5);
    }

    .stat-trend.negative {
      color: var(--color-terracotta, #C17D5C);
    }

    /* NEW: Availability Control Card */
    .availability-control-card {
      background: var(--bg-secondary);
      padding: 1.25rem;
      border-radius: 0.625rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
      margin-bottom: 1.5rem;
    }

    .availability-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.25rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--border-color);
    }

    .availability-info {
      flex: 1;
    }

    .availability-title {
      font-size: clamp(1.125rem, 2.5vw, 1.375rem);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.375rem 0;
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }

    .availability-title i {
      color: #d4a574;
    }

    .availability-description {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .availability-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      border-radius: 2rem;
      font-weight: 600;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    .availability-status.available {
      background: rgba(168, 180, 165, 0.2); /* Sage color theme */
      color: var(--color-sage, #8B9B7E);
      border: 1px solid rgba(168, 180, 165, 0.3);
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
      background: var(--color-sage, #A8B4A5);
    }

    .availability-status.unavailable .status-indicator {
      background: var(--color-terracotta, #C17D5C);
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .availability-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .btn-toggle-availability {
      padding: 0.625rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-manage-availability {
      padding: 0.625rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.625rem;
      background: linear-gradient(135deg, var(--color-burgundy), #9d2449);
      color: white;
    }

    .btn-manage-availability:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(125, 25, 53, 0.3);
    }

    .btn-manage-availability:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .text-warning {
      color: var(--color-gold, #D4AF37);
      font-weight: 600;
    }

    .btn-toggle-availability.make-unavailable {
      background: rgba(193, 125, 92, 0.15);
      color: var(--color-terracotta, #C17D5C);
    }

    .btn-toggle-availability.make-unavailable:hover:not(:disabled) {
      background: rgba(193, 125, 92, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(193, 125, 92, 0.2);
    }

    .btn-toggle-availability.make-available {
      background: rgba(168, 180, 165, 0.15);
      color: var(--color-sage, #A8B4A5);
    }

    .btn-toggle-availability.make-available:hover:not(:disabled) {
      background: rgba(168, 180, 165, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(168, 180, 165, 0.2);
    }

    .btn-toggle-availability:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .availability-hint {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .availability-hint i {
      color: #d4a574;
    }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 0.375rem;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid var(--border-color);
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
    }

    .tabs::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }

    .tab {
      padding: 0.75rem 1.125rem;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      color: var(--text-secondary);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: -2px;
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
    }

    .tab i {
      font-size: 0.875rem;
      width: 1rem;
      text-align: center;
    }

    .tab:hover {
      color: var(--color-burgundy, #7D1935);
    }

    .tab.active {
      color: var(--color-burgundy, #7D1935);
      border-bottom-color: var(--color-burgundy, #7D1935);
    }

    .tab-badge {
      background: var(--color-burgundy, #7D1935);
      color: white;
      font-size: 0.75rem;
      padding: 0.125rem 0.5rem;
      border-radius: 1rem;
      font-weight: 600;
      margin-left: 0.25rem;
    }

    /* Tab Content */
    .tab-content {
      background: var(--bg-secondary);
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
      min-height: 400px;
      animation: fadeIn 0.3s ease-out;
      overflow: visible;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .empty-state {
      animation: fadeIn 0.4s ease-out;
    }

    /* Table */
    .table-wrapper {
      animation: fadeIn 0.4s ease-out;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      gap: 0;
    }

    .table-header {
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--border-color);
    }

    .table-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.375rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .table-title i {
      color: var(--color-burgundy);
      font-size: 1rem;
    }

    .table-subtitle {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.4;
    }

    .table-container {
      position: relative;
      height: 500px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      background: white;
      animation: fadeIn 0.4s ease-out;
      flex-shrink: 0;
    }

    .table-scroll {
      height: 100%;
      overflow-y: auto;
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(125, 25, 53, 0.3) transparent;
    }

    .table-scroll::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    .table-scroll::-webkit-scrollbar-track {
      background: transparent;
    }

    .table-scroll::-webkit-scrollbar-thumb {
      background-color: rgba(125, 25, 53, 0.3);
      border-radius: 3px;
    }

    .table-scroll::-webkit-scrollbar-thumb:hover {
      background-color: rgba(125, 25, 53, 0.5);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .bookings-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .bookings-table thead {
      position: sticky;
      top: 0;
      z-index: 10;
      background: var(--bg-primary);
    }

    .bookings-table th,
    .bookings-table td {
      padding: 0.625rem 0.5rem;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
      font-size: 0.8125rem;
      background: white;
    }

    .bookings-table th {
      background-color: var(--bg-primary);
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.75rem;
      text-transform: uppercase;
      border-bottom: 2px solid var(--border-color);
    }

    .bookings-table th i {
      vertical-align: middle;
      margin-right: 0.1875rem;
      color: var(--text-secondary);
      font-size: 0.6875rem;
    }

    /* Alternating row colors */
    .bookings-table tbody tr:nth-child(even) {
      background-color: rgba(249, 250, 251, 0.5);
    }

    .bookings-table tbody tr {
      transition: all 0.2s ease;
    }

    .bookings-table tbody tr:hover {
      background-color: var(--bg-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transform: translateY(-1px);
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
      flex-wrap: nowrap;
    }

    .status-badge {
      padding: 0.1875rem 0.625rem;
      border-radius: 0.375rem;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: capitalize;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      transition: all 0.2s ease;
    }

    .status-badge i {
      vertical-align: middle;
      font-size: 0.6875rem;
    }

    .status-badge:hover {
      transform: scale(1.05);
    }

    .status-pending {
      background-color: #fef3c7;
      color: #92400e;
    }

    .status-confirmed,
    .status-approved {
      background-color: rgba(168, 180, 165, 0.2);
      color: var(--color-sage, #6B7A68);
      border: 1px solid rgba(168, 180, 165, 0.3);
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
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn i {
      vertical-align: middle;
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
    }

    .btn-success {
      background-color: var(--color-sage, #A8B4A5);
      color: white;
    }

    .btn-success:hover {
      background-color: #8B9986;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(168, 180, 165, 0.3);
    }

    .btn-danger {
      background-color: var(--color-terracotta, #C17D5C);
      color: white;
    }

    .btn-danger:hover {
      background-color: #A86849;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(193, 125, 92, 0.3);
    }

    .btn-outline {
      background-color: transparent;
      color: var(--color-burgundy, #7D1935);
      border: 1px solid var(--color-burgundy, #7D1935);
    }

    .btn-outline:hover {
      background-color: rgba(125, 25, 53, 0.05);
      transform: translateY(-1px);
    }

    /* Icon-only Action Buttons */
    .btn-icon {
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.75rem;
      transition: all 0.2s ease;
    }

    .btn-icon:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .btn-icon.btn-success {
      background-color: var(--color-sage, #A8B4A5);
      color: white;
    }

    .btn-icon.btn-success:hover {
      background-color: #8B9986;
    }

    .btn-icon.btn-danger {
      background-color: var(--color-terracotta, #C17D5C);
      color: white;
    }

    .btn-icon.btn-danger:hover {
      background-color: #A86849;
    }

    .btn-icon.btn-view {
      background-color: var(--color-tan, #D4A574);
      color: white;
    }

    .btn-icon.btn-view:hover {
      background-color: var(--color-gold, #D4AF37);
    }

    .nights-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.625rem;
      background: rgba(125, 25, 53, 0.1);
      color: var(--color-burgundy);
      border-radius: 0.375rem;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .nights-badge:hover {
      transform: scale(1.05);
      background: rgba(125, 25, 53, 0.15);
    }

    .nights-badge i {
      display: none; /* Hide icon in badge since it's already in column header */
    }

    .booking-option-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      border-radius: 0.375rem;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .booking-option-badge:hover {
      transform: scale(1.05);
    }

    .booking-option-badge i {
      vertical-align: middle;
    }

    .booking-option-badge.one-room {
      background: rgba(59, 130, 246, 0.1);
      color: #2563eb;
    }

    .booking-option-badge.entire-apartment {
      background: rgba(212, 165, 116, 0.15);
      color: var(--color-gold);
    }

    /* Guest Cell Styling */
    .guest-cell {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      min-width: 0;
    }

    .guest-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-burgundy), var(--color-gold));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .guest-info {
      display: flex;
      flex-direction: column;
      gap: 0.0625rem;
      min-width: 0;
    }

    .guest-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .guest-email {
      font-size: 0.75rem;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .price-cell {
      font-weight: 600;
      color: var(--color-burgundy);
      font-size: 0.875rem;
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
      transition: all 0.2s ease;
    }

    .activity-item:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border-color: rgba(212, 165, 116, 0.3);
    }

    .activity-icon {
      width: clamp(36px, 7vw, 40px); /* Responsive icon */
      height: clamp(36px, 7vw, 40px);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: clamp(1.125rem, 2vw, 1.25rem); /* Responsive icon size */
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
      font-size: clamp(0.8125rem, 1.5vw, 0.875rem); /* Responsive meta text */
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
      padding: 3rem 1.5rem;
      text-align: center;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 0.75rem;
    }

    .empty-icon.success {
      color: var(--color-sage, #A8B4A5);
    }

    .empty-icon.info {
      color: var(--color-tan, #D4A574);
    }

    .empty-icon.warning {
      color: var(--color-gold, #D4AF37);
    }

    .empty-state-box {
      padding: 3rem 1.5rem;
      text-align: center;
      background: var(--bg-secondary);
      border-radius: 0.75rem;
      border: 2px dashed var(--border-color);
    }

    .empty-state-box .empty-icon {
      color: var(--color-tan, #D4A574);
      opacity: 0.6;
    }

    .empty-state-box .empty-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0.75rem 0 0.375rem 0;
    }

    .empty-state-box .empty-message {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0 0 1.25rem 0;
    }

    .empty-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.375rem 0;
    }

    .empty-text {
      color: #6b7280;
      font-size: 0.9375rem;
      margin: 0;
    }

    /* Listings Management */
    .listings-wrapper {
      padding: 1.25rem;
      animation: fadeIn 0.4s ease-out;
    }

    .listings-header {
      margin-bottom: 1.5rem;
    }

    .listings-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.375rem 0;
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }

    .listings-subtitle {
      color: var(--text-secondary);
      font-size: 0.8125rem;
      margin: 0;
    }

    .add-apartment-section {
      border-bottom: 2px solid var(--border-color);
    }

    /* Apartments List Section */
    .apartments-list-section {
      background: var(--bg-primary);
      border-radius: 0.75rem;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
      border: 1px solid var(--border-color);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 0.875rem;
      border-bottom: 2px solid var(--border-color);
    }

    .apartments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }

    .apartment-card {
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 0.75rem;
      padding: 1.25rem;
      transition: all 0.3s ease;
    }

    .apartment-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      border-color: var(--color-burgundy);
    }

    .apartment-card.editing {
      border-color: var(--color-gold);
      background: linear-gradient(135deg, rgba(212, 165, 116, 0.05) 0%, rgba(255, 255, 255, 1) 100%);
    }

    .apartment-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.875rem;
      margin-bottom: 0.875rem;
    }

    .apartment-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      flex: 1;
      line-height: 1.3;
    }

    .apartment-status-badge {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.625rem;
      border-radius: 1rem;
      font-size: 0.6875rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .apartment-status-badge.available {
      background: rgba(168, 180, 165, 0.2); /* Sage color theme */
      color: var(--color-sage, #8B9B7E);
      border: 1px solid rgba(168, 180, 165, 0.3);
    }

    .apartment-status-badge.unavailable {
      background: #fee2e2;
      color: #991b1b;
    }

    .apartment-location {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      color: var(--text-secondary);
      font-size: 0.8125rem;
      margin-bottom: 0.875rem;
    }

    .apartment-location i {
      color: var(--color-burgundy);
    }

    .apartment-pricing {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      background: var(--bg-primary);
      padding: 0.875rem;
      border-radius: 0.5rem;
      margin-bottom: 0.875rem;
    }

    .price-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price-label {
      color: var(--text-secondary);
      font-size: 0.75rem;
      font-weight: 500;
    }

    .price-value {
      color: var(--color-burgundy);
      font-weight: 700;
      font-size: 0.875rem;
    }

    .apartment-specs {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 0.875rem;
      padding-bottom: 0.875rem;
      border-bottom: 1px solid var(--border-color);
    }

    .spec-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--text-secondary);
      font-size: 0.75rem;
    }

    .spec-item i {
      color: var(--color-gold);
    }

    .apartment-actions {
      display: flex;
      gap: 0.375rem;
      flex-wrap: wrap;
    }

    /* Form Container */
    .listing-form-container {
      background: var(--bg-secondary);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      border: 1px solid var(--border-color);
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 0.875rem;
      border-bottom: 2px solid var(--border-color);
    }

    .form-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .form-title i {
      color: var(--color-burgundy);
    }

    .listing-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .form-section:last-of-type {
      border-bottom: none;
      padding-bottom: 0;
    }

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .section-title i {
      color: var(--color-burgundy);
      font-size: 0.875rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }

    .form-label {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.8125rem;
    }

    .form-input,
    .form-textarea {
      padding: 0.625rem 0.875rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s ease;
      font-family: inherit;
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--color-burgundy);
      box-shadow: 0 0 0 3px rgba(125, 25, 53, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 90px;
    }

    .input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-prefix {
      position: absolute;
      left: 1rem;
      color: var(--text-secondary);
      font-weight: 600;
      pointer-events: none;
    }

    .input-group .form-input {
      padding-left: 2.5rem;
    }

    .form-hint {
      color: var(--text-secondary);
      font-size: 0.8125rem;
      font-style: italic;
    }

    .form-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding-top: 1.5rem;
    }

    .btn-save {
      background: linear-gradient(135deg, var(--color-burgundy), #9d2449);
      color: white;
      padding: 0.75rem 1.75rem;
      font-size: 0.875rem;
      font-weight: 600;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-save:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(125, 25, 53, 0.3);
    }

    .btn-save:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .save-success {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      color: var(--color-sage, #A8B4A5);
      font-weight: 600;
      animation: slideInRight 0.3s ease-out;
    }

    .save-success i {
      font-size: 1.125rem;
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
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
      padding: 0.625rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-label {
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 0.8125rem;
    }

    .detail-value {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.8125rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-label {
      font-weight: 600;
      color: #374151;
      font-size: 0.8125rem;
    }

    .form-control {
      padding: 0.625rem;
      border: 1px solid var(--border-light, #d1d5db);
      border-radius: 0.375rem;
      font-family: inherit;
      resize: vertical;
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--color-burgundy, #7D1935);
      box-shadow: 0 0 0 3px rgba(125, 25, 53, 0.1);
    }

    .details-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .details-heading {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--border-light);
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
      background-color: var(--bg-secondary);
      border-radius: 0.5rem;
      color: var(--text-primary);
      line-height: 1.6;
      margin: 0;
    }

    .admin-notes {
      padding: 1rem;
      background-color: #fef3c7;
      border-left: 4px solid var(--color-gold);
      border-radius: 0.375rem;
      color: #78350f;
      line-height: 1.6;
      margin: 0;
    }

    .price-highlight {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-burgundy);
    }

    .id-photo-container {
      display: flex;
      justify-content: center;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 0.5rem;
    }

    .id-photo {
      max-width: 100%;
      max-height: 400px;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    /* Pagination */
    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.25rem;
      padding: 0.875rem 1rem;
      border-top: 2px solid var(--border-color);
      background: var(--bg-primary);
      flex-shrink: 0;
    }

    .pagination-info {
      color: var(--text-secondary);
      font-size: 0.8125rem;
      font-weight: 500;
    }

    .pagination-controls {
      display: flex;
      gap: 0.375rem;
      align-items: center;
    }

    .pagination-btn {
      padding: 0.4375rem 0.875rem;
      border: 1px solid var(--border-color);
      background: white;
      color: var(--text-primary);
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.8125rem;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .pagination-btn:hover:not(:disabled) {
      background: var(--color-burgundy);
      color: white;
      border-color: var(--color-burgundy);
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(125, 25, 53, 0.2);
    }

    .pagination-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      background: var(--bg-secondary);
    }

    .pagination-pages {
      display: flex;
      gap: 0.25rem;
    }

    .pagination-page {
      width: 32px;
      height: 32px;
      border: 1px solid var(--border-color);
      background: white;
      color: var(--text-primary);
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.8125rem;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pagination-page:hover:not(.active) {
      background: rgba(125, 25, 53, 0.1);
      border-color: var(--color-burgundy);
      color: var(--color-burgundy);
    }

    .pagination-page.active {
      background: var(--color-burgundy);
      color: white;
      border-color: var(--color-burgundy);
      box-shadow: 0 2px 4px rgba(125, 25, 53, 0.3);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.875rem;
      }

      .availability-header {
        flex-direction: column;
        align-items: stretch;
      }

      .availability-status {
        align-self: flex-start;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 0.875rem;
      }

      .admin-header {
        padding: 1.5rem 0;
      }

      .page-title {
        font-size: 1.5rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
        margin: -1.25rem 0 1.25rem;
      }

      .stat-card {
        padding: 0.875rem;
      }

      .stat-icon {
        width: 40px;
        height: 40px;
        font-size: 1.125rem;
      }

      .stat-label {
        font-size: 0.6875rem;
      }

      .stat-value {
        font-size: 1.25rem;
      }

      .stat-trend {
        font-size: 0.625rem;
      }

      .availability-control-card {
        padding: 1rem;
      }

      .availability-title {
        font-size: 1rem;
      }

      .availability-description {
        font-size: 0.8125rem;
      }

      .availability-actions {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
      }

      .btn-toggle-availability,
      .btn-manage-availability {
        width: 100%;
        justify-content: center;
        padding: 0.625rem 1.25rem;
        font-size: 0.8125rem;
      }

      .tabs {
        overflow-x: auto;
        gap: 0.25rem;
        margin-bottom: 1.25rem;
      }

      .tab {
        white-space: nowrap;
        padding: 0.625rem 1rem;
        font-size: 0.8125rem;
      }

      .table-container {
        font-size: 0.8125rem;
        overflow-x: auto;
      }

      .bookings-table {
        min-width: 800px;
      }

      .bookings-table th,
      .bookings-table td {
        padding: 0.625rem 0.375rem;
        font-size: 0.75rem;
      }

      .action-buttons {
        flex-direction: row;
        gap: 0.25rem;
        flex-wrap: nowrap;
      }

      .guest-avatar {
        width: 28px;
        height: 28px;
        font-size: 0.875rem;
      }

      .guest-name {
        font-size: 0.8125rem;
      }

      .guest-email {
        font-size: 0.6875rem;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }

      .listing-form-container {
        padding: 1.5rem;
      }

      .listings-wrapper {
        padding: 1rem;
      }

      .form-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .btn-save {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 0.625rem;
      }

      .stat-card {
        padding: 0.75rem;
      }

      .stat-icon {
        width: 36px;
        height: 36px;
        font-size: 1rem;
      }

      .stat-label {
        font-size: 0.6875rem;
      }

      .stat-value {
        font-size: 1.125rem;
      }

      .stat-trend {
        font-size: 0.625rem;
      }

      .availability-control-card {
        padding: 0.875rem;
      }

      .availability-hint {
        font-size: 0.75rem;
      }

      .container {
        padding: 0 0.75rem;
      }

      .admin-header {
        padding: 1.25rem 0;
      }

      .page-title {
        font-size: 1.375rem;
      }

      .page-subtitle {
        font-size: 0.75rem;
      }

      .tabs {
        gap: 0.125rem;
      }

      .tab {
        padding: 0.5rem 0.75rem;
        font-size: 0.75rem;
      }

      .empty-state,
      .empty-state-box {
        padding: 2rem 1rem;
      }

      .empty-icon {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }

      .empty-title,
      .empty-state-box .empty-title {
        font-size: 1rem;
        margin: 0.5rem 0 0.25rem 0;
      }

      .empty-text,
      .empty-state-box .empty-message {
        font-size: 0.8125rem;
      }

      .listings-wrapper {
        padding: 1rem;
      }

      .listings-header {
        margin-bottom: 1rem;
      }

      .table-header {
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
      }

      .table-title {
        font-size: 1rem;
        gap: 0.375rem;
      }

      .table-title i {
        font-size: 0.875rem;
      }

      .table-subtitle {
        font-size: 0.75rem;
      }

      .table-container {
        position: relative;
        height: 400px;
        overflow: hidden;
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
      }

      .table-scroll {
        height: 100%;
        overflow-y: auto;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
      }

      .table-scroll::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      .table-scroll::-webkit-scrollbar-thumb {
        background-color: rgba(125, 25, 53, 0.3);
        border-radius: 2px;
      }

      .bookings-table th,
      .bookings-table td {
        padding: 0.625rem 0.375rem;
        font-size: 0.75rem;
      }

      .pagination-container {
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.75rem;
        margin-top: 0.75rem;
      }

      .pagination-info {
        font-size: 0.75rem;
        text-align: center;
      }

      .pagination-controls {
        width: 100%;
        justify-content: center;
        gap: 0.25rem;
      }

      .pagination-btn {
        padding: 0.375rem 0.625rem;
        font-size: 0.75rem;
        gap: 0.1875rem;
      }

      .pagination-btn span {
        display: none;
      }

      .pagination-pages {
        gap: 0.1875rem;
      }

      .pagination-page {
        width: 28px;
        height: 28px;
        font-size: 0.75rem;
      }

      .listing-form-container {
        padding: 1rem;
      }

      .form-header {
        margin-bottom: 1rem;
        padding-bottom: 0.625rem;
      }

      .form-title {
        font-size: 1rem;
        gap: 0.25rem;
      }

      .listing-form {
        gap: 1rem;
      }

      .form-section {
        gap: 0.75rem;
        padding-bottom: 1rem;
      }

      .section-title {
        font-size: 0.9375rem;
      }

      .form-row {
        gap: 0.875rem;
      }

      .form-group {
        gap: 0.25rem;
      }

      .form-label {
        font-size: 0.75rem;
      }

      .form-input,
      .form-textarea,
      .form-control {
        padding: 0.5rem 0.75rem;
        font-size: 0.8125rem;
      }

      .detail-row {
        padding: 0.5rem 0;
      }

      .detail-label,
      .detail-value {
        font-size: 0.75rem;
      }

      .details-content {
        gap: 1rem;
      }

      .details-heading {
        font-size: 0.9375rem;
      }

      .apartment-card {
        padding: 1rem;
      }

      .apartment-location {
        font-size: 0.75rem;
        margin-bottom: 0.625rem;
      }

      .apartment-pricing {
        padding: 0.75rem;
        margin-bottom: 0.625rem;
      }

      .price-label {
        font-size: 0.6875rem;
      }

      .price-value {
        font-size: 0.8125rem;
      }

      .apartment-specs {
        gap: 0.5rem;
        margin-bottom: 0.625rem;
        padding-bottom: 0.625rem;
      }

      .spec-item {
        font-size: 0.6875rem;
      }
    }

    /* Availability Modal Styles */
    .availability-modal-content {
      padding: 1rem 0;
    }

    .modal-description {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      font-size: 0.9375rem;
      line-height: 1.6;
    }

    .apartments-availability-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .availability-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      border-radius: 0.75rem;
      border: 2px solid var(--border-color);
      background: var(--bg-primary);
      transition: all 0.3s ease;
    }

    .availability-item:hover {
      border-color: rgba(125, 25, 53, 0.3);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .availability-item.unavailable {
      background: rgba(239, 68, 68, 0.05);
      border-color: rgba(239, 68, 68, 0.2);
    }

    .apartment-info {
      flex: 1;
    }

    .apartment-name {
      margin: 0 0 0.375rem 0;
      font-size: 1.0625rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .apartment-location {
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .apartment-location i {
      color: var(--color-burgundy);
    }

    .availability-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.8125rem;
      font-weight: 600;
    }

    .availability-badge.badge-available {
      background: rgba(168, 180, 165, 0.2); /* Sage color theme */
      color: var(--color-sage, #8B9B7E);
      border: 1px solid rgba(168, 180, 165, 0.3);
    }

    .availability-badge.badge-unavailable {
      background: #fee2e2;
      color: #991b1b;
    }

    .btn-toggle {
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
    }

    .btn-toggle.btn-make-unavailable {
      background: #fee2e2;
      color: #991b1b;
    }

    .btn-toggle.btn-make-unavailable:hover:not(:disabled) {
      background: #fecaca;
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(239, 68, 68, 0.2);
    }

    .btn-toggle.btn-make-available {
      background: rgba(168, 180, 165, 0.2); /* Sage color theme */
      color: var(--color-sage, #8B9B7E);
      border: 1px solid rgba(168, 180, 165, 0.3);
    }

    .btn-toggle.btn-make-available:hover:not(:disabled) {
      background: rgba(168, 180, 165, 0.3);
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);
    }

    .btn-toggle:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .empty-state-small {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }

    .empty-state-small i {
      font-size: 3rem;
      color: var(--color-burgundy);
      margin-bottom: 0.75rem;
    }

    .empty-state-small p {
      margin: 0;
      font-size: 0.9375rem;
    }
  `]
})
export class AdminComponent implements OnInit {
  private simplifiedBookingService = inject(SimplifiedBookingService); // For single-apartment operations
  private apartmentService = inject(ApartmentManagementService);
  private notificationService = inject(NotificationService);
  private loadingService = inject(LoadingService);

  @ViewChild('approvalModal') approvalModal!: ModalComponent;
  @ViewChild('detailsModal') detailsModal!: ModalComponent;
  @ViewChild('availabilityModal') availabilityModal!: ModalComponent;

  // Data signals
  allBookings = signal<SimplifiedBooking[]>([]);
  pendingBookings = signal<SimplifiedBooking[]>([]);
  adminActions = signal<AdminAction[]>([]);
  stats = signal({
    totalBookings: 0,
    pendingApprovals: 0,
    approvedToday: 0,
    rejectedToday: 0
  });

  // Apartment management signals
  apartments = this.apartmentService.apartments;
  isLoadingApartments = this.apartmentService.isLoading;
  selectedApartmentId = signal<string | null>(null);

  // Availability management
  showAvailabilityModal = signal<boolean>(false);
  isTogglingAvailability = signal<boolean>(false);
  availableApartmentsCount = computed(() => 
    this.apartments().filter(apt => apt.availability.isAvailable).length
  );

  // UI state signals
  activeTab = signal<string>('pending');
  isLoading = signal<boolean>(false);
  showApprovalModal = signal<boolean>(false);
  showDetailsModal = signal<boolean>(false);
  selectedBooking = signal<SimplifiedBooking | null>(null);
  approvalAction = signal<'approve' | 'reject'>('approve');
  rejectionReason = '';

  // Listing management signals
  isLoadingListing = signal<boolean>(false);
  isSavingListing = signal<boolean>(false);
  listingSaveSuccess = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  editingApartmentId = signal<string | null>(null);
  showApartmentForm = signal<boolean>(false);
  listingData: Partial<Apartment> = {
    title: '',
    description: '',
    location: {
      address: '',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria'
    },
    pricing: {
      oneRoomPrice: 25000,
      entireApartmentPrice: 45000,
      currency: 'NGN'
    },
    specifications: {
      bedrooms: 1,
      bathrooms: 1,
      maxGuestsOneRoom: 4,
      maxGuestsEntireApartment: 5
    },
    amenities: [],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800',
      'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800'
    ],
    availability: {
      isAvailable: true,
      status: 'available'
    },
    featured: false
  };
  amenitiesText = '';

  // Pagination signals
  pendingPage = signal<number>(1);
  allBookingsPage = signal<number>(1);
  activityPage = signal<number>(1);
  itemsPerPage = 5;

  // Computed paginated data
  paginatedPendingBookings = computed(() => {
    const bookings = this.pendingBookings();
    const page = this.pendingPage();
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return bookings.slice(start, end);
  });

  paginatedAllBookings = computed(() => {
    const bookings = this.allBookings();
    const page = this.allBookingsPage();
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return bookings.slice(start, end);
  });

  paginatedAdminActions = computed(() => {
    const actions = this.adminActions();
    const page = this.activityPage();
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return actions.slice(start, end);
  });

  // Total pages
  pendingTotalPages = computed(() => Math.ceil(this.pendingBookings().length / this.itemsPerPage));
  allBookingsTotalPages = computed(() => Math.ceil(this.allBookings().length / this.itemsPerPage));
  activityTotalPages = computed(() => Math.ceil(this.adminActions().length / this.itemsPerPage));

  // Mock admin ID (in real app, this would come from auth)
  adminId = 'admin-001';
  adminName = 'Admin User';

  // Expose Math for template
  Math = Math;

  ngOnInit(): void {
    this.loadData();
    this.loadApartments();
  }

  loadData(): void {
    this.isLoading.set(true);
    
    // Load all bookings using SimplifiedBookingService
    this.simplifiedBookingService.getAllBookings().subscribe({
      next: (bookings: any[]) => {
        this.allBookings.set(bookings as any);
        this.updateStats(bookings as any);
        this.isLoading.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load bookings');
        this.isLoading.set(false);
      }
    });

    // Load pending bookings
    this.simplifiedBookingService.getPendingBookings().subscribe({
      next: (bookings: any[]) => {
        this.pendingBookings.set(bookings as any);
      }
    });

    // Admin actions - commented out as not needed for simplified booking
    // this.adminService.getRecentActivity(20).subscribe({
    //   next: (actions) => {
    //     this.adminActions.set(actions);
    //   }
    // });
  }

  loadApartments(): void {
    this.apartmentService.getAllApartments().subscribe({
      next: () => {
        // Apartments loaded via service signals
      },
      error: () => {
        this.notificationService.error('Failed to load apartments');
      }
    });
  }

  updateStats(bookings: SimplifiedBooking[]): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      totalBookings: bookings.length,
      pendingApprovals: bookings.filter(b => b.status === 'pending').length,
      approvedToday: bookings.filter(b => 
        b.status === 'approved' && 
        b.approvedAt && new Date(b.approvedAt) >= today
      ).length,
      rejectedToday: bookings.filter(b => 
        b.status === 'rejected' && 
        b.rejectedAt && new Date(b.rejectedAt) >= today
      ).length
    };

    this.stats.set(stats);
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

  openApprovalModal(booking: SimplifiedBooking, action: 'approve' | 'reject'): void {
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
    const message = action === 'approve' ? 'Approving booking...' : 'Rejecting booking...';
    
    if (action === 'approve') {
      this.loadingService.show(message);
      this.simplifiedBookingService.approveBooking(booking.id, this.rejectionReason).subscribe({
        next: () => {
          this.notificationService.success('Booking approved successfully');
          this.closeApprovalModal();
          this.loadData();
          this.loadingService.hide();
        },
        error: () => {
          this.notificationService.error('Failed to approve booking');
          this.loadingService.hide();
        }
      });
    } else {
      if (!this.rejectionReason.trim()) {
        this.notificationService.error('Please provide a reason for rejection');
        return;
      }

      this.loadingService.show(message);
      this.simplifiedBookingService.rejectBooking(booking.id, this.rejectionReason).subscribe({
        next: () => {
          this.notificationService.success('Booking rejected');
          this.closeApprovalModal();
          this.loadData();
          this.loadingService.hide();
        },
        error: () => {
          this.notificationService.error('Failed to reject booking');
          this.loadingService.hide();
        }
      });
    }
  }

  viewBookingDetails(booking: SimplifiedBooking): void {
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

  // Availability Management Methods
  openAvailabilityModal(): void {
    if (this.apartments().length === 0) {
      this.notificationService.error('No apartments available. Please add an apartment first.');
      return;
    }
    this.showAvailabilityModal.set(true);
    if (this.availabilityModal) {
      this.availabilityModal.openModal('Manage Apartment Availability');
    }
  }

  closeAvailabilityModal(): void {
    this.showAvailabilityModal.set(false);
    // Don't call this.availabilityModal.close() here because it creates a recursion loop
    // The modal is already closing (that's why modalClose was emitted)
  }

  async toggleApartmentAvailabilityById(apartmentId: string, currentStatus: boolean): Promise<void> {
    this.isTogglingAvailability.set(true);
    try {
      await this.apartmentService.toggleAvailability(apartmentId, !currentStatus).toPromise();
      const statusText = !currentStatus ? 'available' : 'unavailable';
      this.notificationService.success(`Apartment marked as ${statusText}`);
      this.loadApartments();
    } catch (error) {
      this.notificationService.error('Failed to update apartment availability');
    } finally {
      this.isTogglingAvailability.set(false);
    }
  }

  // Pagination methods
  goToPendingPage(page: number): void {
    if (page >= 1 && page <= this.pendingTotalPages()) {
      this.pendingPage.set(page);
    }
  }

  goToAllBookingsPage(page: number): void {
    if (page >= 1 && page <= this.allBookingsTotalPages()) {
      this.allBookingsPage.set(page);
    }
  }

  goToActivityPage(page: number): void {
    if (page >= 1 && page <= this.activityTotalPages()) {
      this.activityPage.set(page);
    }
  }

  previousPendingPage(): void {
    this.goToPendingPage(this.pendingPage() - 1);
  }

  nextPendingPage(): void {
    this.goToPendingPage(this.pendingPage() + 1);
  }

  previousAllBookingsPage(): void {
    this.goToAllBookingsPage(this.allBookingsPage() - 1);
  }

  nextAllBookingsPage(): void {
    this.goToAllBookingsPage(this.allBookingsPage() + 1);
  }

  previousActivityPage(): void {
    this.goToActivityPage(this.activityPage() - 1);
  }

  nextActivityPage(): void {
    this.goToActivityPage(this.activityPage() + 1);
  }

  // Listing management methods
  selectApartmentForEdit(apartment: Apartment): void {
    this.isEditMode.set(true);
    this.editingApartmentId.set(apartment.id || null);
    this.showApartmentForm.set(true);
    this.listingData = { ...apartment };
    this.amenitiesText = apartment.amenities.join('\n');
    
    // Scroll to form
    setTimeout(() => {
      const form = document.querySelector('.listing-form-container');
      form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  showAddApartmentForm(): void {
    this.resetListingForm();
    this.showApartmentForm.set(true);
    setTimeout(() => {
      const form = document.querySelector('.listing-form-container');
      form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  resetListingForm(): void {
    this.isEditMode.set(false);
    this.editingApartmentId.set(null);
    this.showApartmentForm.set(false);
    this.listingData = {
      title: '',
      description: '',
      location: {
        address: '',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria'
      },
      pricing: {
        oneRoomPrice: 25000,
        entireApartmentPrice: 45000,
        currency: '₦'
      },
      specifications: {
        bedrooms: 1,
        bathrooms: 1,
        maxGuestsOneRoom: 4,
        maxGuestsEntireApartment: 5
      },
      amenities: [],
      images: [],
      availability: {
        isAvailable: true,
        status: 'available'
      },
      featured: false
    };
    this.amenitiesText = '';
    this.listingSaveSuccess.set(false);
  }

  async saveListing(): Promise<void> {
    this.isSavingListing.set(true);
    this.listingSaveSuccess.set(false);

    const message = this.isEditMode() ? 'Updating apartment...' : 'Adding new apartment...';
    this.loadingService.show(message);

    try {
      // Convert amenities text to array
      const amenities = this.amenitiesText
        .split('\n')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      // Prepare apartment data with explicit integer conversion for prices
      const apartmentData: Omit<Apartment, 'id' | 'createdAt' | 'updatedAt'> = {
        title: this.listingData.title || '',
        description: this.listingData.description || '',
        location: this.listingData.location || {
          address: '',
          city: 'Lagos',
          state: 'Lagos',
          country: 'Nigeria'
        },
        pricing: {
          oneRoomPrice: Math.round(Number(this.listingData.pricing?.oneRoomPrice) || 25000),
          entireApartmentPrice: Math.round(Number(this.listingData.pricing?.entireApartmentPrice) || 45000),
          currency: this.listingData.pricing?.currency || 'NGN'
        },
        specifications: {
          bedrooms: Math.round(Number(this.listingData.specifications?.bedrooms) || 1),
          bathrooms: Math.round(Number(this.listingData.specifications?.bathrooms) || 1),
          maxGuestsOneRoom: Math.round(Number(this.listingData.specifications?.maxGuestsOneRoom) || 4),
          maxGuestsEntireApartment: Math.round(Number(this.listingData.specifications?.maxGuestsEntireApartment) || 5)
        },
        amenities: amenities,
        images: this.listingData.images || [],
        availability: this.listingData.availability || {
          isAvailable: true,
          status: 'available'
        },
        featured: this.listingData.featured || false
      };

      if (this.isEditMode() && this.editingApartmentId()) {
        // Update existing apartment
        await this.apartmentService.updateApartment(
          this.editingApartmentId()!,
          apartmentData
        ).toPromise();
        this.notificationService.success('Apartment updated successfully!');
      } else {
        // Create new apartment
        await this.apartmentService.createApartment(apartmentData).toPromise();
        this.notificationService.success('New apartment added successfully!');
        this.resetListingForm();
      }

      this.listingSaveSuccess.set(true);
      this.loadApartments();

      // Hide success message after 3 seconds
      setTimeout(() => {
        this.listingSaveSuccess.set(false);
      }, 3000);
    } catch (error) {
      this.notificationService.error('Failed to save apartment');
    } finally {
      this.isSavingListing.set(false);
      this.loadingService.hide();
    }
  }

  async deleteApartment(apartmentId: string, apartmentTitle: string): Promise<void> {
    if (!confirm(`Are you sure you want to delete "${apartmentTitle}"? This action cannot be undone.`)) {
      return;
    }

    this.loadingService.show('Deleting apartment...');

    try {
      await this.apartmentService.deleteApartment(apartmentId).toPromise();
      this.notificationService.success('Apartment deleted successfully');
      this.loadApartments();
      
      // Reset form if deleted apartment was being edited
      if (this.editingApartmentId() === apartmentId) {
        this.resetListingForm();
      }
    } catch (error) {
      this.notificationService.error('Failed to delete apartment');
    } finally {
      this.loadingService.hide();
    }
  }
}

