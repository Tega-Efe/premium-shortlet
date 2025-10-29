import { Component, Output, EventEmitter, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApartmentFilter } from '../../../core/services/apartment-browsing.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter.component.html',
    
  styles: [`
    .filter-container {
      background: var(--bg-secondary);
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      border-bottom: 1px solid var(--border-color);
    }

    .filter-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-icon {
      font-size: 1.5rem;
    }

    .btn-clear {
      background: none;
      border: none;
      color: #ef4444;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      transition: background-color 0.2s;
    }

    .btn-clear:hover {
      background-color: #fef2f2;
    }

    .filter-content {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-label {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    .filter-input,
    .filter-select {
      padding: 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.875rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .filter-input:focus,
    .filter-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .filter-range {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: var(--bg-primary);
      outline: none;
      -webkit-appearance: none;
    }

    .filter-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #3b82f6;
      cursor: pointer;
    }

    .filter-range::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #3b82f6;
      cursor: pointer;
      border: none;
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .filter-chips {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-chip {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-chip:hover {
      border-color: #3b82f6;
      color: #3b82f6;
    }

    .filter-chip.active {
      background-color: #3b82f6;
      border-color: #3b82f6;
      color: white;
    }

    .amenity-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      color: #374151;
      font-size: 0.875rem;
    }

    .checkbox-input {
      width: 1.125rem;
      height: 1.125rem;
      cursor: pointer;
    }

    .filter-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }

    .active-count {
      color: #3b82f6;
      font-weight: 600;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .filter-header,
      .filter-content,
      .filter-footer {
        padding: 1rem;
      }

      .filter-chips {
        justify-content: space-between;
      }

      .filter-chip {
        flex: 1;
        text-align: center;
      }
    }
  `]
})
export class FilterComponent {
  @Output() filterChange = new EventEmitter<ApartmentFilter>();

  // Form controls
  searchControl = new FormControl('');
  cityControl = new FormControl('');
  maxPriceControl = new FormControl(0);
  bedroomsControl = new FormControl(0);
  guestsControl = new FormControl(0);
  statusControl = new FormControl('');

  // Signals
  selectedAmenities = signal<string[]>([]);

  // Options
  cities = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano'];
  bedroomOptions = [0, 1, 2, 3, 4];
  guestOptions = [0, 2, 4, 6, 8];
  commonAmenities = ['WiFi', 'Pool', 'Parking', 'AC', 'Kitchen', 'TV'];

  // Computed
  hasActiveFilters = computed(() => {
    return this.activeFiltersCount() > 0;
  });

  activeFiltersCount = computed(() => {
    let count = 0;
    if (this.searchControl.value) count++;
    if (this.cityControl.value) count++;
    if (this.maxPriceControl.value && this.maxPriceControl.value > 0) count++;
    if (this.bedroomsControl.value && this.bedroomsControl.value > 0) count++;
    if (this.guestsControl.value && this.guestsControl.value > 0) count++;
    if (this.statusControl.value) count++;
    if (this.selectedAmenities().length > 0) count += this.selectedAmenities().length;
    return count;
  });

  constructor() {
    // Subscribe to form changes
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.emitFilters());

    this.cityControl.valueChanges.subscribe(() => this.emitFilters());
    this.maxPriceControl.valueChanges.subscribe(() => this.emitFilters());
    this.bedroomsControl.valueChanges.subscribe(() => this.emitFilters());
    this.guestsControl.valueChanges.subscribe(() => this.emitFilters());
    this.statusControl.valueChanges.subscribe(() => this.emitFilters());
  }

  toggleAmenity(amenity: string): void {
    const current = this.selectedAmenities();
    if (current.includes(amenity)) {
      this.selectedAmenities.set(current.filter(a => a !== amenity));
    } else {
      this.selectedAmenities.set([...current, amenity]);
    }
    this.emitFilters();
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.cityControl.setValue('');
    this.maxPriceControl.setValue(0);
    this.bedroomsControl.setValue(0);
    this.guestsControl.setValue(0);
    this.statusControl.setValue('');
    this.selectedAmenities.set([]);
    this.emitFilters();
  }

  private emitFilters(): void {
    const filter: ApartmentFilter = {};

    // Note: search functionality would need to be handled in the parent component
    // as it's not part of ApartmentFilter interface

    if (this.cityControl.value) {
      filter.city = this.cityControl.value;
    }

    if (this.maxPriceControl.value && this.maxPriceControl.value > 0) {
      filter.maxPrice = this.maxPriceControl.value;
    }

    if (this.bedroomsControl.value && this.bedroomsControl.value > 0) {
      filter.bedrooms = this.bedroomsControl.value;
    }

    if (this.guestsControl.value && this.guestsControl.value > 0) {
      filter.minGuests = this.guestsControl.value;
    }

    // Note: status filter would need to be handled separately
    // as it's not part of ApartmentFilter interface

    if (this.selectedAmenities().length > 0) {
      filter.amenities = this.selectedAmenities();
    }

    this.filterChange.emit(filter);
  }
}
