import { Component, ViewChild, AfterViewInit, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent, FooterComponent, ToastComponent, LoaderComponent } from './shared/components';
import { ScrollToTopDirective } from './core/directives';
import { LoadingService } from './core/services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent, LoaderComponent, ScrollToTopDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  @ViewChild(LoaderComponent) loader!: LoaderComponent;
  protected loadingService = inject(LoadingService);

  constructor() {
    // Watch loading service state and update loader component
    effect(() => {
      const isLoading = this.loadingService.isLoading();
      const message = this.loadingService.loadingMessage();
      const progress = this.loadingService.loadingProgress();
      
      if (this.loader) {
        if (isLoading) {
          this.loader.show(message);
          if (progress !== null) {
            this.loader.setProgress(progress);
          }
        } else {
          this.loader.hide();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // Trigger initial state
    if (this.loadingService.isLoading()) {
      this.loader.show(this.loadingService.loadingMessage());
    }
  }
}
