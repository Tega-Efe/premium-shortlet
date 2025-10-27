import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPreventDoubleClick]'
})
export class PreventDoubleClickDirective {
  private isDisabled = false;

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.isDisabled = true;
    
    setTimeout(() => {
      this.isDisabled = false;
    }, 500);
  }
}
