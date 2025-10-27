import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent, FooterComponent, ToastComponent } from './shared/components';
import { ScrollToTopDirective } from './core/directives';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent, ScrollToTopDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
