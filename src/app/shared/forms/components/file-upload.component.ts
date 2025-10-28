import { Component, Input, forwardRef, signal, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ],
  template: `
    <div class="file-upload-container">
      <input
        #fileInput
        type="file"
        [accept]="accept"
        (change)="onFileSelected($event)"
        class="file-input-hidden"
        [id]="inputId"
        [disabled]="disabled"
      />
      
      <label [for]="inputId" class="file-upload-label" [class.disabled]="disabled">
        <div class="upload-content">
          @if (!selectedFile()) {
            <div class="upload-placeholder">
              <div class="upload-icon">
                <i class="fas fa-cloud-upload-alt"></i>
              </div>
              <div class="upload-text">
                <p class="upload-title">{{ placeholder || 'Click to upload or drag and drop' }}</p>
                <p class="upload-hint">{{ hint || 'JPG, PNG up to 5MB' }}</p>
              </div>
            </div>
          } @else {
            <div class="file-preview">
              <div class="preview-icon">
                <i class="fas fa-file-image"></i>
              </div>
              <div class="file-info">
                <p class="file-name">{{ selectedFile()?.name }}</p>
                <p class="file-size">{{ getFileSize(selectedFile()!) }}</p>
              </div>
              <button
                type="button"
                class="remove-file"
                (click)="removeFile($event)"
                [disabled]="disabled"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          }
        </div>
      </label>
      
      @if (error()) {
        <div class="upload-error">
          <small>{{ error() }}</small>
        </div>
      }
    </div>
  `,
  styles: [`
    .file-upload-container {
      width: 100%;
    }

    .file-input-hidden {
      display: none;
    }

    .file-upload-label {
      display: block;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .file-upload-label.disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .upload-content {
      border: 2px dashed var(--border-color, #d1d5db);
      border-radius: 0.75rem;
      padding: 2rem;
      text-align: center;
      background: var(--bg-primary, white);
      transition: all 0.3s ease;
    }

    .file-upload-label:not(.disabled):hover .upload-content {
      border-color: var(--color-burgundy, #7D1935);
      background: rgba(125, 25, 53, 0.02);
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .upload-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, rgba(125, 25, 53, 0.1) 0%, rgba(212, 165, 116, 0.1) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: var(--color-burgundy, #7D1935);
      transition: transform 0.3s ease;
    }

    .file-upload-label:not(.disabled):hover .upload-icon {
      transform: scale(1.1);
    }

    .upload-icon i {
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .upload-text {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .upload-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary, #374151);
      margin: 0;
    }

    .upload-hint {
      font-size: 0.875rem;
      color: var(--text-secondary, #6b7280);
      margin: 0;
    }

    .file-preview {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: linear-gradient(135deg, rgba(125, 25, 53, 0.05) 0%, rgba(212, 165, 116, 0.05) 100%);
      border-radius: 0.5rem;
    }

    .preview-icon {
      width: 48px;
      height: 48px;
      background: var(--color-burgundy, #7D1935);
      color: white;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .file-info {
      flex: 1;
      text-align: left;
      min-width: 0;
    }

    .file-name {
      font-weight: 600;
      color: var(--text-primary, #374151);
      margin: 0 0 0.25rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .file-size {
      font-size: 0.875rem;
      color: var(--text-secondary, #6b7280);
      margin: 0;
    }

    .remove-file {
      width: 32px;
      height: 32px;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .remove-file:hover:not(:disabled) {
      background: #ef4444;
      color: white;
      transform: scale(1.1);
    }

    .remove-file:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .upload-error {
      margin-top: 0.5rem;
    }

    .upload-error small {
      color: #ef4444;
      font-size: 0.875rem;
    }

    @media (max-width: 640px) {
      .upload-content {
        padding: 1.5rem 1rem;
      }

      .upload-icon {
        width: 52px;
        height: 52px;
        font-size: 1.5rem;
      }

      .upload-title {
        font-size: 0.875rem;
      }

      .upload-hint {
        font-size: 0.75rem;
      }
    }
  `]
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() accept = 'image/jpeg,image/png,image/jpg';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() maxSize = 5 * 1024 * 1024; // 5MB default
  
  inputId = `file-upload-${Math.random().toString(36).substring(7)}`;
  selectedFile = signal<File | null>(null);
  error = signal<string>('');
  disabled = false;

  private onChange: (value: File | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: File | null): void {
    this.selectedFile.set(value);
    this.error.set('');
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // Validate file size
    if (file.size > this.maxSize) {
      this.error.set(`File size must be less than ${this.getFileSize({ size: this.maxSize } as File)}`);
      input.value = '';
      return;
    }

    // Validate file type
    const acceptedTypes = this.accept.split(',').map(t => t.trim());
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }
      return file.type === type || file.type.match(new RegExp(type.replace('*', '.*')));
    });

    if (!isValidType) {
      this.error.set('Invalid file type. Please select a valid image file.');
      input.value = '';
      return;
    }

    this.error.set('');
    this.selectedFile.set(file);
    this.onChange(file);
  }

  removeFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.selectedFile.set(null);
    this.error.set('');
    this.onChange(null);
  }

  getFileSize(file: File): string {
    const bytes = file.size;
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
