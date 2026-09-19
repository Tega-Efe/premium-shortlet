import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// import { ApartmentService, NotificationService } from '../../core/services'; // REMOVED: Old HTTP API version
import { ApartmentBrowsingService, ApartmentFilter } from '../../core/services/apartment-browsing.service'; // PUBLIC: Read-only browsing
import { NotificationService, LoadingService } from '../../core/services';
import { SimplifiedBookingService } from '../../core/services/simplified-booking.service';
import { ThemeService } from '../../core/services/theme.service';
import { Apartment } from '../../core/interfaces';
import { CardComponent } from '../../shared/components/card/card.component';
// import { FilterComponent } from '../../shared/components/filter/filter.component'; // COMMENTED OUT: Not used in single-apartment mode
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { DynamicFormComponent, FormSubmitEvent } from '../../shared/forms';
import { simplifiedBookingFormConfig } from '../../shared/forms/simplified-form-configs';
import { AnimateOnScrollDirective } from '../../core/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    CardComponent, 
    // FilterComponent,  // COMMENTED OUT: Not used in single-apartment mode
    ModalComponent,
    DynamicFormComponent,
    AnimateOnScrollDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styles: [`
    .home-page {
      min-height: 100vh;
      background: var(--bg-primary);
    }

    /* NOTE: .page-header and its hero markup (icon/title/subtitle) were
       removed from the template a while back for the single-apartment
       layout, but the CSS was left behind — including a negative margin on
       .content-grid meant to pull it up under a hero that no longer exists.
       Removed below; .container is the only thing still in use here. */
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Content Grid - SIMPLIFIED FOR SINGLE APARTMENT
       No .page-header exists in the template anymore, so this only needs a
       small, deliberate top gap (not the old negative-margin-to-clear-a-hero
       trick, which flipped to a much larger positive margin on mobile and
       is what was pushing the "Apartments Available" card down under the
       navbar). */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr;  /* Changed from 320px 1fr - no sidebar */
      gap: 1.75rem;
      margin-top: 1.25rem;
      position: relative;
      z-index: 10;
    }

    .sidebar {
      position: sticky;
      top: 2rem;
      height: fit-content;
      /* COMMENTED OUT - Not displayed for single apartment */
      display: none;
    }

    .main-content {
      background: transparent;
      min-height: 600px;
    }

    /* Results Header */
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.75rem;
      padding: 1.5rem;
      background: var(--bg-secondary);
      border-radius: 0.875rem;
      box-shadow: 0 2px 12px rgba(125, 25, 53, 0.08);
      border: 1px solid var(--border-color);
      flex-wrap: wrap;
      gap: 1rem;
    }

    .results-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .results-count-badge {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, var(--color-tan, #D4A574) 0%, var(--color-terracotta, #C17D5C) 100%);
      border-radius: 0.875rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.2rem;
      color: white;
      box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
    }

    .results-count-badge i {
      font-size: clamp(0.9375rem, 2vw, 1.125rem);
    }

    .count-number {
      font-size: clamp(1.125rem, 2.5vw, 1.375rem);
      font-weight: 700;
      line-height: 1;
    }

    .results-text {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .results-count {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.125rem, 2.5vw, 1.375rem);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .btn-text {
      background: none;
      border: none;
      color: var(--color-burgundy, #7D1935);
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: clamp(0.8125rem, 1.6vw, 0.875rem);
      transition: all 0.2s ease;
    }

    .btn-text:hover {
      color: #9B2447;
      gap: 0.5rem;
    }

    .btn-text i {
      font-size: 1rem;
    }

    .sort-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .sort-label {
      color: var(--color-warm-gray, #6B6B6B);
      font-weight: 600;
      font-size: 0.9375rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sort-label i {
      color: var(--color-tan, #D4A574);
    }

    .sort-select {
      padding: 0.75rem 1.25rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      background: var(--bg-secondary);
      cursor: pointer;
      font-weight: 500;
      color: var(--text-primary);
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .sort-select:hover {
      border-color: var(--color-tan, #D4A574);
    }

    .sort-select:focus {
      outline: none;
      border-color: var(--color-burgundy, #7D1935);
      box-shadow: 0 0 0 3px rgba(125, 25, 53, 0.1);
    }

    /* Loading */
    .apartments-loading {
      position: relative;
      margin: 0 auto 2rem;
      min-height: 400px;
      background: var(--bg-secondary);
      border-radius: var(--radius-xl);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      box-shadow: 0 8px 32px rgba(125, 25, 53, 0.12);
    }

    .apartments-loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(125, 25, 53, 0.1);
      border-top-color: var(--color-burgundy, #7D1935);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .apartments-loading-text {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      font-weight: 500;
    }

    /* Apartments Grid */
    .apartments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
      margin-top: 2.5rem;
      padding: 1.5rem 0;
    }

    .pagination-btn {
      border: 2px solid var(--border-color);
      border-radius: 0.5rem;
      background: var(--bg-secondary);
      color: var(--color-burgundy, #7D1935);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-family: inherit;
    }

    .pagination-btn:hover:not(:disabled) {
      background: var(--color-burgundy, #7D1935);
      color: white;
      border-color: var(--color-burgundy, #7D1935);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(125, 25, 53, 0.2);
    }

    .pagination-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .pagination-pages {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .pagination-page {
      width: 40px;
      height: 40px;
      border: 2px solid var(--border-color);
      border-radius: 0.5rem;
      background: var(--bg-secondary);
      color: var(--text-primary);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
      font-size: 0.875rem;
    }

    .pagination-page:hover {
      background: var(--bg-secondary);
      border-color: var(--color-tan, #D4A574);
      transform: translateY(-2px);
    }

    .pagination-page.active {
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, #9B2447 100%);
      border-color: var(--color-burgundy, #7D1935);
      color: white;
      box-shadow: 0 4px 12px rgba(125, 25, 53, 0.3);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 3.5rem 1.5rem;
      background: var(--bg-secondary);
      border-radius: 0.875rem;
      box-shadow: 0 4px 20px rgba(125, 25, 53, 0.08);
      border: 1px solid var(--border-color);
    }

    .empty-illustration {
      width: 250px;
      height: 200px;
      margin: 0 auto 2rem;
      opacity: 0.7;
    }

    .empty-illustration svg {
      width: 100%;
      height: 100%;
    }

    .empty-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.375rem, 3vw, 1.75rem); /* Responsive title */
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .empty-title i {
      color: var(--color-tan, #D4A574);
    }

    .empty-text {
      color: var(--text-secondary);
      margin: 0 0 2.5rem 0;
      font-size: clamp(0.9375rem, 1.8vw, 1.0625rem); /* Responsive text */
      line-height: 1.6;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .btn {
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.625rem;
      font-family: inherit;
    }

    .btn i {
      font-size: clamp(1rem, 2vw, 1.125rem); /* Responsive icon */
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, #9B2447 100%);
      color: white;
      box-shadow: 0 4px 14px rgba(125, 25, 53, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(125, 25, 53, 0.4);
    }

    /* Booking Modal */
    .booking-modal-content {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    /* Each block keeps its full content height. If a browser ever treats this
       column as height-constrained, blocks then scroll instead of shrinking
       and overlapping the next block. */
    .booking-modal-content > * {
      flex-shrink: 0;
      min-width: 0;
    }

    .apartment-summary {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 1.5rem;
      padding: 1.5rem;
      background: var(--bg-secondary);
      border-radius: 1rem;
      border: 1px solid var(--border-color);
    }

    /* Image slider — deliberately square-cornered (no border-radius) and
       with no label overlay, per the modal's own look; the landing page
       gallery is the visual reference for slide/track/dot mechanics only. */
    .summary-slider {
      position: relative;
      width: 100%;
      /* The slider owns its height. Photos are absolutely positioned inside,
         so their natural size / load timing can never change the height of
         the summary card (or push the form below it around). */
      aspect-ratio: 4/3;
      overflow: hidden;
      border: 1px solid var(--border-color);
      touch-action: pan-y; /* let vertical scroll through, capture horizontal swipes ourselves */
    }

    .summary-track {
      position: absolute;
      inset: 0;
      display: flex;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .summary-slide {
      position: relative;
      flex: 0 0 100%;
      min-width: 100%;
      height: 100%;
    }

    .summary-slide-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .summary-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.95);
      border: none;
      color: var(--color-burgundy, #7D1935);
      font-size: 0.9375rem;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: none; /* Arrows are desktop/tablet only — see the ≥768px override below */
      align-items: center;
      justify-content: center;
    }

    .summary-nav:hover {
      background: white;
      transform: translateY(-50%) scale(1.1);
    }

    .summary-nav-prev {
      left: 0.5rem;
    }

    .summary-nav-next {
      right: 0.5rem;
    }

    @media (min-width: 768px) {
      .summary-nav {
        display: flex;
      }
    }

    .summary-dots {
      position: absolute;
      bottom: 0.625rem;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      gap: 0.375rem;
      z-index: 10;
    }

    .summary-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 2px solid white;
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    }

    .summary-dot.active {
      background: white;
      transform: scale(1.2);
    }

    .summary-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .summary-badge {
      flex-shrink: 0;
      background: var(--color-burgundy, #7D1935);
      color: white;
      padding: 0.25rem 0.625rem;
      border-radius: 0.375rem;
      font-size: 0.6875rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.3125rem;
    }

    .summary-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .summary-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .summary-location {
      color: var(--text-secondary);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
    }

    .summary-location i {
      color: var(--color-burgundy, #7D1935);
    }

    .summary-specs {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .spec {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-charcoal, #2C2C2C);
      font-weight: 500;
      font-size: 0.9375rem;
    }

    .spec i {
      color: var(--color-tan, #D4A574);
      font-size: 1.125rem;
    }

    .summary-price-block {
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid rgba(212, 165, 116, 0.2);
    }

    .price-amount {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.5rem, 3vw, 2rem); /* Responsive price */
      font-weight: 700;
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, var(--color-tan, #D4A574) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .price-period {
      color: var(--color-warm-gray, #6B6B6B);
      font-size: clamp(0.875rem, 1.6vw, 1rem); /* Responsive period text */
      margin-left: 0.375rem;
    }

    .booking-form-container {
      padding: 0 1rem;
    }

    .form-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(212, 165, 116, 0.2);
    }

    .form-header i {
      font-size: clamp(1.25rem, 2.5vw, 1.5rem); /* Responsive icon */
      color: var(--color-burgundy, #7D1935);
    }

    .form-heading {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.125rem, 2.2vw, 1.375rem); /* Responsive heading */
      font-weight: 700;
      color: var(--color-charcoal, #2C2C2C);
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }

      .results-header {
        padding: 1.5rem;
        flex-direction: column;
        align-items: flex-start;
      }

      .results-info {
        width: 100%;
      }

      .sort-section {
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
      }

      .sort-select {
        width: 100%;
      }

      .apartments-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
        margin-bottom: 1.5rem;
      }

      .apartment-summary {
        grid-template-columns: 1fr;
        padding: 1rem;
        gap: 1rem;
      }

      .summary-slider {
        aspect-ratio: 16/10;
      }

      /* Beds / Baths / Guests stay on one row on phones */
      .summary-specs {
        flex-wrap: nowrap;
        justify-content: space-between;
        gap: 0.5rem;
      }

      .spec {
        white-space: nowrap;
        gap: 0.375rem;
        font-size: 0.875rem;
      }

      .spec i {
        font-size: 1rem;
      }

      .summary-info {
        gap: 0.75rem;
      }

      .summary-title {
        font-size: 1.25rem;
      }

      .summary-location {
        font-size: 0.9375rem;
      }

      .pagination {
        flex-wrap: wrap;
      }


      .pagination-pages {
        order: 3;
        width: 100%;
      }

      .pagination-page {
        width: 40px;
        height: 40px;
      }

      .empty-illustration {
        width: 200px;
        height: 150px;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 0 0.625rem;
      }

      .results-header {
        padding: 1rem; /* Reduced from 1.5rem */
        gap: 0.75rem; /* Reduced from 1rem */
        margin-bottom: 1.25rem; /* Reduced from 1.75rem */
      }

      .results-info {
        gap: 0.75rem; /* Reduced from 1rem */
      }

      .results-count-badge {
        width: 60px;
        height: 60px;
      }

      .count-number {
        font-size: 1.25rem;
      }

      .results-count {
        font-size: 1.25rem;
      }

      .apartments-grid {
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .apartment-summary {
        padding: 0.75rem;
        gap: 0.875rem;
      }

      .summary-specs {
        gap: 0.375rem;
      }

      .spec {
        font-size: 0.8125rem;
        gap: 0.3125rem;
      }

      .spec i {
        font-size: 0.9375rem;
      }

      .summary-info {
        gap: 0.625rem;
      }

      .summary-title {
        font-size: 1.125rem;
      }

      .summary-location {
        font-size: 0.875rem;
      }

      .booking-modal-content {
        gap: 1.5rem;
      }
    }

    /* Very small phones (320px class): keep Beds / Baths / Guests on one row */
    @media (max-width: 340px) {
      .summary-specs {
        gap: 0.25rem;
      }

      .spec {
        font-size: 0.75rem;
        gap: 0.25rem;
      }

      .spec i {
        font-size: 0.875rem;
      }
    }

    /* The modal body already insets content by 1.5rem on phones; drop the
       extra 1rem here so the form lines up with the apartment summary card. */
    @media (max-width: 480px) {
      .booking-form-container {
        padding: 0;
      }
    }

    /* Unavailable Modal Styles */
    .unavailable-modal-content {
      text-align: center;
      padding: 2rem 1rem;
    }

    .unavailable-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .unavailable-icon i {
      font-size: 2.5rem;
      color: #ef4444;
    }

    .unavailable-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 1rem 0;
    }

    .unavailable-message {
      font-size: 1rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0 0 1rem 0;
    }

    .unavailable-suggestion {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0 0 2rem 0;
      font-style: italic;
    }

    .unavailable-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }


    /* Booking Confirmation Modal Styles */
    .confirmation-modal-content {
      padding: 2rem 1.5rem;
      text-align: center;
    }

    .confirmation-icon {
      width: 90px;
      height: 90px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(168, 180, 165, 0.2), rgba(139, 155, 126, 0.2));
      display: flex;
      align-items: center;
      justify-content: center;
      animation: scaleIn 0.5s ease-out;
    }

    .confirmation-icon i {
      font-size: 3rem;
      color: var(--color-sage);
    }

    .confirmation-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
      font-family: 'Playfair Display', serif;
    }

    .confirmation-subtitle {
      font-size: 1rem;
      color: var(--text-secondary);
      margin: 0 0 2rem 0;
    }

    .booking-summary-box {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      text-align: left;
    }

    .summary-heading {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .summary-heading i {
      color: var(--color-burgundy);
    }

    .summary-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border-color);
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .detail-value {
      font-size: 0.9375rem;
      color: var(--text-primary);
      font-weight: 600;
    }

    .total-row {
      margin-top: 0.5rem;
      padding-top: 1rem;
      border-top: 2px solid var(--border-color);
    }

    .total-amount {
      font-size: 1.25rem;
      color: var(--color-burgundy);
      font-weight: 700;
    }

    .payment-instructions {
      background: rgba(168, 180, 165, 0.1);
      border: 1px solid rgba(168, 180, 165, 0.3);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      text-align: left;
    }

    .payment-heading {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.75rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .payment-heading i {
      color: var(--color-sage);
    }

    .payment-intro {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      margin: 0 0 1.25rem 0;
      line-height: 1.6;
    }

    .bank-details {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      margin-bottom: 1rem;
    }

    :host-context(.dark-theme) .bank-details {
      background: var(--bg-primary);
    }

    .bank-detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.625rem 0;
      border-bottom: 1px dashed var(--border-color);
      position: relative;
    }

    .bank-detail-item:last-child {
      border-bottom: none;
    }

    .bank-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .bank-value {
      font-size: 0.9375rem;
      color: var(--text-primary);
      font-weight: 600;
      font-family: 'Courier New', monospace;
    }

    .amount-highlight {
      font-size: 1.125rem;
      color: var(--color-burgundy);
    }

    .copy-value {
      padding-right: 2.5rem;
    }

    .btn-copy {
      position: absolute;
      right: 0;
      background: var(--color-sage);
      color: white;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-copy:hover {
      background: var(--color-burgundy);
      transform: translateY(-1px);
    }

    .payment-note {
      display: flex;
      gap: 0.75rem;
      background: rgba(251, 191, 36, 0.1);
      border-left: 3px solid #fbbf24;
      padding: 1rem;
      border-radius: var(--radius-sm);
      margin-top: 1rem;
    }

    .payment-note i {
      color: #fbbf24;
      margin-top: 0.25rem;
      flex-shrink: 0;
    }

    .payment-note p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--text-primary);
      line-height: 1.6;
    }

    .reference-code {
      background: rgba(0, 0, 0, 0.1);
      padding: 0.125rem 0.5rem;
      border-radius: var(--radius-sm);
      font-family: 'Courier New', monospace;
      font-weight: 600;
      color: var(--color-burgundy);
    }

    .notification-info {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      margin-bottom: 1.5rem;
      text-align: left;
    }

    .notification-item {
      display: flex;
      gap: 0.875rem;
      align-items: flex-start;
      padding: 0.75rem 0;
    }

    .notification-item:not(:last-child) {
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 0.75rem;
    }

    .notification-item i {
      color: var(--color-sage);
      font-size: 1.125rem;
      margin-top: 0.125rem;
      flex-shrink: 0;
    }

    .notification-item p {
      margin: 0;
      font-size: 0.9375rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .notification-item strong {
      color: var(--text-primary);
    }

    .confirmation-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;
    }


    @keyframes scaleIn {
      from {
        transform: scale(0);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    @media (max-width: 640px) {
      .confirmation-modal-content {
        padding: 1.5rem 1rem;
      }

      .confirmation-title {
        font-size: 1.5rem;
      }

      .bank-details {
        padding: 1rem;
      }

      .bank-detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }

      .btn-copy {
        position: static;
        margin-top: 0.5rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  // private apartmentService = inject(ApartmentService); // REMOVED: Old HTTP API version
  private apartmentService = inject(ApartmentBrowsingService); // PUBLIC: Read-only browsing service
  private simplifiedBookingService = inject(SimplifiedBookingService);
  private notificationService = inject(NotificationService);
  private loadingService = inject(LoadingService);
  private route = inject(ActivatedRoute);
  protected themeService = inject(ThemeService);

  @ViewChild('bookingModal') bookingModal!: ModalComponent;
  @ViewChild('unavailableModal') unavailableModal!: ModalComponent;
  @ViewChild('confirmationModal') confirmationModal!: ModalComponent;

  // Data signals
  allApartments = signal<Apartment[]>([]);
  filteredApartments = signal<Apartment[]>([]);
  selectedApartment = signal<Apartment | null>(null);
  summarySlide = signal(0);

  // Availability signals
  // Note: allApartments already filtered by isAvailable in loadApartments
  // This computed is here for backward compatibility and additional filtering if needed
  availableApartments = computed(() => 
    this.allApartments().filter(apt => apt.availability?.isAvailable === true)
  );
  hasAvailableApartments = computed(() => this.availableApartments().length > 0);
  showUnavailableModal = signal<boolean>(false);

  // Helper computed properties
  hasAnyApartments = computed(() => this.allApartments().length > 0);

  // UI state signals
  isLoading = signal<boolean>(false);
  showBookingModal = signal<boolean>(false);
  showConfirmationModal = signal<boolean>(false);
  bookingConfirmationData = signal<any>(null);
  currentFilter = signal<ApartmentFilter>({});
  currentSort = signal<string>('price-asc');
  currentPage = signal<number>(1);
  itemsPerPage = 9;

  // Computed values
  totalPages = computed(() => {
    return Math.ceil(this.filteredApartments().length / this.itemsPerPage);
  });

  paginatedApartments = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredApartments().slice(start, end);
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range: number[] = [];
    
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift(-1);
    }
    if (current + delta < total - 1) {
      range.push(-1);
    }

    range.unshift(1);
    if (total > 1) {
      range.push(total);
    }

    return range.filter(n => n > 0);
  });

  hasActiveFilters = computed(() => {
    const filter = this.currentFilter();
    return Object.keys(filter).length > 0;
  });

  bookingFormConfig = simplifiedBookingFormConfig;

  ngOnInit(): void {
    this.loadApartments();
    this.checkQueryParams();
  }

  loadApartments(): void {
    this.isLoading.set(true);
    this.apartmentService.getApartments().subscribe({
      next: (apartments) => {
        // Filter apartments by isAvailable (manual admin toggle) and hiddenUntil date
        // This ensures only apartments that admin has marked as available are shown
        // Also checks if the hide duration has expired
        const now = new Date();
        const availableApartments = (apartments || []).filter(apt => {
          // Check manual toggle
          if (!apt.availability?.isAvailable) {
            return false;
          }
          
          // Check if apartment is hidden temporarily
          if (apt.availability?.hiddenUntil) {
            const hiddenUntilDate = apt.availability.hiddenUntil instanceof Date 
              ? apt.availability.hiddenUntil 
              : apt.availability.hiddenUntil.toDate();
            
            // If hiddenUntil is in the future, apartment is still hidden
            if (hiddenUntilDate > now) {
              return false;
            }
          }
          
          return true;
        });
        
        this.allApartments.set(availableApartments);
        this.filteredApartments.set(availableApartments);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.notificationService.error('Failed to load apartments');
        this.isLoading.set(false);
      }
    });
  }

  checkQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['apartmentId']) {
        const apartment = this.allApartments().find(a => a.id === params['apartmentId']);
        if (apartment) {
          this.openBookingModal(apartment);
        }
      }
    });
  }

  onFilterChange(filter: ApartmentFilter): void {
    this.currentFilter.set(filter);
    this.currentPage.set(1);
    this.applyFiltersAndSort();
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.currentSort.set(select.value);
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    let apartments = [...this.allApartments()];

    // Apply filters
    const filter = this.currentFilter();
    apartments = this.apartmentService.filterApartments(apartments, filter);

    // Apply sort
    apartments = this.apartmentService.sortApartments(apartments, this.currentSort() as any);

    this.filteredApartments.set(apartments);
  }

  clearFilters(): void {
    this.currentFilter.set({});
    this.applyFiltersAndSort();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openBookingModal(apartment: Apartment): void {
    // Check if apartment is manually set as available (admin toggle)
    // Note: We check isAvailable, not status, because status changes when there are bookings
    // Users can still book for other available dates even if some dates are booked
    if (!apartment.availability?.isAvailable) {
      this.openUnavailableModal();
      return;
    }

    this.selectedApartment.set(apartment);
    this.summarySlide.set(0);
    this.showBookingModal.set(true);
    if (this.bookingModal) {
      this.bookingModal.openModal('Book ' + apartment.title);
    }
  }

  // Booking modal image slider — same slide/dots mechanism as the landing
  // page gallery, adapted per the apartment currently selected for booking.
  summaryNextSlide(): void {
    const images = this.selectedApartment()?.images ?? [];
    if (images.length < 2) return;
    this.summarySlide.update(current => current === images.length - 1 ? 0 : current + 1);
  }

  summaryPrevSlide(): void {
    const images = this.selectedApartment()?.images ?? [];
    if (images.length < 2) return;
    this.summarySlide.update(current => current === 0 ? images.length - 1 : current - 1);
  }

  summaryGoToSlide(index: number): void {
    this.summarySlide.set(index);
  }

  // Touch swipe support for the slider on mobile, where the nav arrows are
  // hidden below 768px — this is the only way to navigate slides there.
  private summaryTouchStartX = 0;
  private summaryTouchStartY = 0;
  private readonly SWIPE_THRESHOLD = 40; // px

  onSummaryTouchStart(event: TouchEvent): void {
    this.summaryTouchStartX = event.touches[0].clientX;
    this.summaryTouchStartY = event.touches[0].clientY;
  }

  onSummaryTouchEnd(event: TouchEvent): void {
    const deltaX = event.changedTouches[0].clientX - this.summaryTouchStartX;
    const deltaY = event.changedTouches[0].clientY - this.summaryTouchStartY;

    // Ignore mostly-vertical swipes so scrolling the modal still works
    if (Math.abs(deltaX) < this.SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      this.summaryNextSlide();
    } else {
      this.summaryPrevSlide();
    }
  }

  closeBookingModal(): void {
    this.showBookingModal.set(false);
    this.selectedApartment.set(null);
    // Don't call this.bookingModal.close() here - it creates a recursion loop
    // when called from (modalClose) event
  }

  // Close booking modal programmatically (e.g., after successful submission)
  private closeBookingModalProgrammatically(): void {
    this.showBookingModal.set(false);
    this.selectedApartment.set(null);
    if (this.bookingModal) {
      this.bookingModal.close();
    }
  }

  openUnavailableModal(): void {
    this.showUnavailableModal.set(true);
    if (this.unavailableModal) {
      this.unavailableModal.openModal('Apartment Unavailable');
    }
  }

  closeUnavailableModal(): void {
    this.showUnavailableModal.set(false);
    if (this.unavailableModal) {
      this.unavailableModal.close();
    }
  }

  onBookingSubmit(event: FormSubmitEvent): void {
    if (!event.valid || !this.selectedApartment()) {
      this.notificationService.error('Please fill in all required fields');
      return;
    }
    // Use simplified booking flow (single apartment)
    const formData = event.value;

    // map dynamic form fields to BookingFormData expected by SimplifiedBookingService
    const bookingFormData = {
      name: formData.guestName,
      email: formData.guestEmail,
      phone: formData.guestPhone,
      address: formData.guestAddress,
      idPhoto: formData.idPhoto,
      bookingOption: formData.bookingOption,
      checkInDate: formData.checkInDate || formData.checkIn,
      checkOutDate: formData.checkOutDate || formData.checkOut,
      numberOfNights: formData.numberOfNights,
      numberOfGuests: formData.numberOfGuests
    };

    this.loadingService.show('Submitting booking request...');

    // Get the selected apartment ID
    const apartmentId = this.selectedApartment()?.id;
    if (!apartmentId) {
      this.loadingService.hide();
      this.notificationService.error('Apartment not found. Please try again.');
      return;
    }

    // Get the price per night based on booking option
    const apartment = this.selectedApartment()!;
    const pricePerNight = bookingFormData.bookingOption === 'one-room' 
      ? apartment.pricing.oneRoomPrice 
      : apartment.pricing.entireApartmentPrice;

    this.simplifiedBookingService.createBooking(bookingFormData, apartmentId, pricePerNight).subscribe({
      next: (booking) => {
        this.loadingService.hide();
        this.closeBookingModalProgrammatically();
        
        // Prepare confirmation data
        this.bookingConfirmationData.set({
          bookingId: booking.id,
          apartmentTitle: apartment.title,
          guestName: bookingFormData.name,
          guestEmail: bookingFormData.email,
          checkInDate: bookingFormData.checkInDate,
          checkOutDate: bookingFormData.checkOutDate,
          numberOfNights: bookingFormData.numberOfNights,
          totalPrice: pricePerNight * bookingFormData.numberOfNights,
          bookingOption: bookingFormData.bookingOption
        });
        
        // Show confirmation modal with payment instructions
        this.openConfirmationModal();
      },
      error: (error) => {
        this.loadingService.hide();
        console.error('Booking submission error', error);
        
        // Check for specific error messages
        if (error.message && error.message.includes('not available')) {
          this.notificationService.error('Sorry, this apartment is not available for the selected dates. Please choose different dates.');
        } else {
          this.notificationService.error('Failed to submit booking. Please try again.');
        }
      }
    });
  }

  // Helper methods for apartment data
  getApartmentMaxGuests(apartment: Apartment): number {
    const specs = apartment.specifications as any;
    return specs.maxGuestsEntireApartment || specs.maxGuests || 0;
  }

  getApartmentPrice(apartment: Apartment): string {
    const pricing = apartment.pricing as any;
    if (pricing.oneRoomPrice) {
      return `from ${pricing.currency}${pricing.oneRoomPrice.toLocaleString()}`;
    }
    if (pricing.basePrice) {
      return `${pricing.currency}${pricing.basePrice.toLocaleString()}`;
    }
    return 'Price not available';
  }

  // Confirmation modal methods
  openConfirmationModal(): void {
    this.showConfirmationModal.set(true);
    if (this.confirmationModal) {
      this.confirmationModal.openModal('Booking Confirmation');
    }
  }

  closeConfirmationModal(): void {
    this.showConfirmationModal.set(false);
    this.bookingConfirmationData.set(null);
    if (this.confirmationModal) {
      this.confirmationModal.close();
    }
  }

  // Copy account number to clipboard
  copyAccountNumber(): void {
    const accountNumber = '0123456789';
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(accountNumber).then(
        () => {
          this.notificationService.success('Account number copied to clipboard!');
        },
        (err) => {
          console.error('Failed to copy account number:', err);
          this.notificationService.error('Failed to copy account number. Please copy manually.');
        }
      );
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = accountNumber;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        this.notificationService.success('Account number copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy account number:', err);
        this.notificationService.error('Failed to copy account number. Please copy manually.');
      }
      
      document.body.removeChild(textArea);
    }
  }
}