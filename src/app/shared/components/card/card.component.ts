import { Component, input, output, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apartment } from '../../../core/interfaces';
import { fadeIn, scaleIn } from '../../../core/animations';
import { HoverEffectDirective } from '../../../core/directives';
import { PriceUtils } from '../../../core/utils';

@Component({
  selector: 'app-card',
  imports: [CommonModule, HoverEffectDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn, scaleIn],
  templateUrl: './card.component.html',
  styles: [`
    /* ===== Card Container ===== */
    .card {
      background: var(--bg-secondary);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-md), 0 0 0 1px var(--border-color);
      transition: all var(--transition-base);
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--color-burgundy) 0%, var(--color-tan) 50%, var(--color-burgundy) 100%);
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .card:hover {
      box-shadow: var(--shadow-xl), 0 0 0 1px var(--border-color);
      transform: translateY(-8px);
    }

    .card:hover::before {
      opacity: 1;
    }

    /* ===== Image Section ===== */
    .card-image {
      position: relative;
      width: 100%;
      height: 240px;
      overflow: hidden;
      background: linear-gradient(135deg, var(--color-beige) 0%, var(--color-warm-gray) 100%);
    }

    .image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .card:hover .image {
      transform: scale(1.1);
    }

    .image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 0%, rgba(31, 28, 24, 0.4) 100%);
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .card:hover .image-overlay {
      opacity: 1;
    }

    /* ===== Badges ===== */
    .badge {
      position: absolute;
      top: var(--spacing-md);
      right: var(--spacing-md);
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-cream);
      backdrop-filter: blur(8px);
      box-shadow: var(--shadow-sm);
      z-index: 2;
    }

    .badge i {
      font-size: var(--font-size-sm);
    }

    .badge-available {
      background: linear-gradient(135deg, rgba(107, 155, 126, 0.9) 0%, rgba(139, 155, 126, 0.9) 100%);
    }

    .badge-unavailable {
      background: linear-gradient(135deg, rgba(166, 154, 142, 0.9) 0%, rgba(62, 56, 50, 0.9) 100%);
    }

    .badge-maintenance {
      background: linear-gradient(135deg, rgba(212, 164, 96, 0.9) 0%, rgba(201, 169, 97, 0.9) 100%);
    }

    /* ===== Favorite Button ===== */
    .favorite-btn {
      position: absolute;
      top: var(--spacing-md);
      left: var(--spacing-md);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-secondary);
      backdrop-filter: blur(8px);
      border: none;
      border-radius: var(--radius-full);
      color: var(--color-warm-gray);
      font-size: var(--font-size-lg);
      cursor: pointer;
      transition: all var(--transition-base);
      z-index: 2;
    }

    .favorite-btn:hover {
      background: var(--bg-primary);
      color: var(--color-burgundy);
      transform: scale(1.1);
    }

    .favorite-btn.active {
      background: var(--color-burgundy);
      color: var(--color-cream);
    }

    /* ===== Card Content ===== */
    .card-content {
      padding: var(--spacing-xl);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      flex: 1;
    }

    .card-header {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .card-title {
      margin: 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .card-location {
      margin: 0;
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .card-location i {
      color: var(--color-tan);
      font-size: var(--font-size-base);
    }

    /* ===== Specifications ===== */
    .card-specs {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-sm);
    }

    .spec {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm);
      background: var(--bg-primary);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      transition: all var(--transition-fast);
    }

    .spec:hover {
      background: var(--bg-secondary);
      transform: translateY(-2px);
    }

    .spec i {
      color: var(--color-tan);
      font-size: var(--font-size-lg);
    }

    /* ===== Amenities ===== */
    .card-amenities {
      display: flex;
      gap: var(--spacing-xs);
      flex-wrap: wrap;
    }

    .amenity-tag {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-xs) var(--spacing-sm);
      background: var(--bg-primary);
      color: var(--color-burgundy);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      border: 1px solid var(--border-color);
    }

    .amenity-tag i {
      font-size: 0.75rem;
    }

    .amenity-tag.more {
      background: var(--bg-secondary);
      color: var(--text-secondary);
      border-color: var(--border-color);
    }

    /* ===== Rating ===== */
    .card-rating {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-sm);
    }

    .stars {
      display: flex;
      gap: 2px;
    }

    .stars i {
      color: var(--color-beige);
      font-size: var(--font-size-sm);
      transition: color var(--transition-fast);
    }

    .stars i.filled {
      color: var(--color-gold);
    }

    .rating-value {
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .rating-count {
      color: var(--text-secondary);
    }

    /* ===== Footer ===== */
    .card-footer {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      margin-top: auto;
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--border-color);
    }

    .price-section {
      display: flex;
      align-items: baseline;
      gap: var(--spacing-xs);
    }

    .currency {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
    }

    .price {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-burgundy);
    }

    .price-period {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
    }

    .card-actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    /* ===== Buttons ===== */
    .btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all var(--transition-base);
      white-space: nowrap;
    }

    .btn i {
      font-size: var(--font-size-sm);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--color-burgundy) 0%, var(--color-burgundy-light) 100%);
      color: var(--text-inverse);
      box-shadow: 0 4px 12px rgba(125, 25, 53, 0.2);
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--color-burgundy-dark) 0%, var(--color-burgundy) 100%);
      box-shadow: 0 6px 16px rgba(125, 25, 53, 0.3);
      transform: translateY(-2px);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-secondary {
      background: transparent;
      color: var(--color-burgundy);
      border: 2px solid var(--color-burgundy);
    }

    .btn-secondary:hover {
      background: linear-gradient(135deg, rgba(125, 25, 53, 0.1) 0%, rgba(212, 165, 116, 0.15) 100%);
      border-color: var(--color-burgundy-dark);
      transform: translateY(-2px);
    }

    /* ===== Responsive Design ===== */
    @media (max-width: 768px) {
      .card-image {
        height: 200px;
      }

      .card-content {
        padding: var(--spacing-lg);
      }

      .card-title {
        font-size: var(--font-size-lg);
      }

      .card-specs {
        grid-template-columns: repeat(2, 1fr);
      }

      .price {
        font-size: var(--font-size-2xl);
      }

      .card-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .card-specs {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-xs);
      }

      .spec {
        padding: var(--spacing-xs);
        font-size: 0.75rem;
      }

      .spec i {
        font-size: var(--font-size-base);
      }
    }
  `]
})
export class CardComponent {
  // Input signals
  apartment = input.required<Apartment>();
  showBookButton = input<boolean>(true);
  showViewButton = input<boolean>(false);
  
  // Output signals
  book = output<Apartment>();
  view = output<Apartment>();
  favorite = output<Apartment>();

  // State
  isFavorite = signal<boolean>(false);
  Math = Math;

  getFormattedPrice(): string {
    const apartment = this.apartment();
    const pricing = apartment.pricing as any;
    
    // Handle new apartment structure with oneRoomPrice and entireApartmentPrice
    if (pricing && 'oneRoomPrice' in pricing && 'entireApartmentPrice' in pricing) {
      // Display the lower price (one room) with "from" indicator
      const price = pricing.oneRoomPrice;
      return `from ${PriceUtils.formatPrice(price, pricing.currency || '₦')}`;
    }
    
    // Handle legacy structure with basePrice
    if (pricing && 'basePrice' in pricing) {
      return PriceUtils.formatPrice(
        pricing.basePrice,
        pricing.currency || '₦'
      );
    }
    
    // Fallback
    return 'Price not available';
  }

  getMaxGuests(): number {
    const specs = this.apartment().specifications as any;
    
    // Handle new structure with maxGuestsEntireApartment
    if ('maxGuestsEntireApartment' in specs) {
      return specs.maxGuestsEntireApartment;
    }
    
    // Handle legacy structure with maxGuests
    if ('maxGuests' in specs) {
      return specs.maxGuests;
    }
    
    return 0;
  }

  getDisplayAmenities(): string[] {
    return this.apartment().amenities.slice(0, 4);
  }

  getAmenityIcon(amenity: string): string {
    const iconMap: Record<string, string> = {
      'WiFi': 'fas fa-wifi',
      'Parking': 'fas fa-square-parking',
      'Pool': 'fas fa-water-ladder',
      'Gym': 'fas fa-dumbbell',
      'AC': 'fas fa-snowflake',
      'Kitchen': 'fas fa-kitchen-set',
      'TV': 'fas fa-tv',
      'Washer': 'fas fa-jug-detergent',
      'Balcony': 'fas fa-tree',
      'Pet Friendly': 'fas fa-paw',
    };

    return iconMap[amenity] || 'fas fa-check';
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.isFavorite.update(val => !val);
    this.favorite.emit(this.apartment());
  }

  onBook(event: Event): void {
    event.stopPropagation();
    this.book.emit(this.apartment());
  }

  onView(event: Event): void {
    event.stopPropagation();
    this.view.emit(this.apartment());
  }
}
