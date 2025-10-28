import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// import { ApartmentService, NotificationService } from '../../core/services'; // COMMENTED OUT: Using Firestore version
import { ApartmentServiceFirestore, ApartmentFilter } from '../../core/services/apartment.service.firestore'; // NEW: Firestore-based service
import { NotificationService, LoadingService } from '../../core/services';
import { SimplifiedBookingServiceNoStorage } from '../../core/services/simplified-booking-no-storage.service';
import { ThemeService } from '../../core/services/theme.service';
import { Apartment, Booking } from '../../core/interfaces';
import { CardComponent } from '../../shared/components/card/card.component';
// import { FilterComponent } from '../../shared/components/filter/filter.component'; // COMMENTED OUT: Not used in single-apartment mode
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
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
    LoaderComponent,
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

    /* Page Header */
    .page-header {
      position: relative;
      background: linear-gradient(135deg, var(--color-burgundy, #7D1935) 0%, #9B2447 50%, var(--color-terracotta, #C17D5C) 100%);
      color: white;
      padding: 3rem 0 3.5rem;
      overflow: hidden;
    }

    .header-background {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100px;
      opacity: 0.4;
    }

    .header-background svg {
      width: 100%;
      height: 100%;
    }

    .header-content {
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .header-icon {
      width: clamp(52px, 10vw, 60px);
      height: clamp(52px, 10vw, 60px);
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: clamp(1.25rem, 3vw, 1.75rem);
      margin: 0 auto 1rem;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .page-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.75rem, 4.5vw, 2.375rem);
      font-weight: 700;
      margin: 0 0 0.75rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .page-subtitle {
      font-size: clamp(0.9375rem, 2vw, 1.125rem);
      margin: 0;
      opacity: 0.95;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Content Grid - SIMPLIFIED FOR SINGLE APARTMENT */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr;  /* Changed from 320px 1fr - no sidebar */
      gap: 1.75rem;
      margin-top: -1.5rem;
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
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
      background: var(--bg-secondary);
      border-radius: 0.875rem;
      box-shadow: 0 2px 12px rgba(125, 25, 53, 0.08);
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
      padding: 0.75rem 1.5rem;
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
      font-size: 0.875rem;
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
      padding: clamp(0.75rem, 2vw, 0.875rem) clamp(1.5rem, 3vw, 1.75rem); /* Responsive padding */
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.625rem;
      font-family: inherit;
      font-size: clamp(0.875rem, 1.8vw, 1rem); /* Responsive font size */
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

    .apartment-summary {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 2rem;
      padding: 2rem;
      background: var(--bg-secondary);
      border-radius: 1rem;
      border: 1px solid var(--border-color);
    }

    .summary-image-wrapper {
      position: relative;
    }

    .summary-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-radius: 0.75rem;
      box-shadow: 0 4px 12px rgba(125, 25, 53, 0.15);
    }

    .summary-badge {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: var(--color-burgundy, #7D1935);
      color: white;
      padding: 0.375rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.375rem;
      box-shadow: 0 2px 8px rgba(125, 25, 53, 0.3);
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
        margin-top: 2rem;
      }

      .sidebar {
        position: static;
      }

      .page-header {
        padding: 3rem 0 4rem;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }

      .page-header {
        padding: 2.5rem 0 3rem;
      }

      .header-icon {
        width: 60px;
        height: 60px;
        font-size: 1.75rem;
      }

      .page-title {
        font-size: 2.25rem;
      }

      .page-subtitle {
        font-size: 1.0625rem;
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
      }

      .apartment-summary {
        grid-template-columns: 1fr;
        padding: 1.25rem;
      }

      .summary-image {
        width: 100%;
        height: 220px;
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

      .pagination-btn {
        padding: 0.75rem 1.25rem;
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
      .header-icon {
        margin-top: 1.5rem; /* Add more space before icon on mobile */
      }

      .page-header {
        padding: 2rem 0 2.5rem; /* Reduced padding to minimize top margin */
      }

      .container {
        padding: 0 0.625rem;
      }

      .page-title {
        font-size: 1.875rem;
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

      .apartment-summary {
        padding: 1rem;
        gap: 1.25rem;
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

    .unavailable-actions .btn {
      padding: 0.875rem 2rem;
      font-size: 1rem;
    }
  `]
})
export class HomeComponent implements OnInit {
  // private apartmentService = inject(ApartmentService); // COMMENTED OUT: Using Firestore version
  private apartmentService = inject(ApartmentServiceFirestore); // NEW: Firestore-based service
  private simplifiedBookingService = inject(SimplifiedBookingServiceNoStorage);
  private notificationService = inject(NotificationService);
  private loadingService = inject(LoadingService);
  private route = inject(ActivatedRoute);
  protected themeService = inject(ThemeService);

  @ViewChild('bookingModal') bookingModal!: ModalComponent;
  @ViewChild('unavailableModal') unavailableModal!: ModalComponent;

  // Data signals
  allApartments = signal<Apartment[]>([]);
  filteredApartments = signal<Apartment[]>([]);
  selectedApartment = signal<Apartment | null>(null);

  // Availability signals
  availableApartments = computed(() => 
    this.allApartments().filter(apt => apt.availability?.status === 'available')
  );
  hasAvailableApartments = computed(() => this.availableApartments().length > 0);
  showUnavailableModal = signal<boolean>(false);

  // Helper computed properties
  hasAnyApartments = computed(() => this.allApartments().length > 0);

  // UI state signals
  isLoading = signal<boolean>(false);
  showBookingModal = signal<boolean>(false);
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
        // Scale down: keep only the first apartment (main two-bedroom unit)
        const main = apartments && apartments.length > 0 ? apartments[0] : null;
        this.allApartments.set(main ? [main] : []);
        this.filteredApartments.set(main ? [main] : []);
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
    // Check if apartment is available
    if (apartment.availability?.status !== 'available') {
      this.openUnavailableModal();
      return;
    }

    this.selectedApartment.set(apartment);
    this.showBookingModal.set(true);
    if (this.bookingModal) {
      this.bookingModal.openModal('Book ' + apartment.title);
    }
  }

  closeBookingModal(): void {
    this.showBookingModal.set(false);
    this.selectedApartment.set(null);
    // Don't call this.bookingModal.close() here because it creates a recursion loop
    // The modal is already closing (that's why modalClose was emitted)
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
        this.notificationService.success('Booking request submitted successfully!');
        this.closeBookingModal();
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
}

