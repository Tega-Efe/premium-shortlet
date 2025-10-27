import { Directive, ElementRef, Input, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface TypingEffectConfig {
  typingSpeed?: number; // Duration in seconds
  blinkSpeed?: number; // Blink duration in seconds
  cursorColor?: string;
  cursorWidth?: string;
  autoStart?: boolean;
  loop?: boolean;
  loopDelay?: number; // Delay between loops in seconds
}

@Directive({
  selector: '[appTypingEffect]',
  standalone: true
})
export class TypingEffectDirective implements OnInit, AfterViewInit, OnDestroy, OnChanges {
 
  @Input() config: TypingEffectConfig = {}

  defaultConfig: TypingEffectConfig = {
    typingSpeed: 2, 
    blinkSpeed: 0.5,
    cursorColor: 'currentColor',
    cursorWidth: '2px',
    autoStart: true,
    loop: false,
    loopDelay: 3
  }

  activeConfig: TypingEffectConfig = {};

  private originalText: string = '';
  private textLength: number = 0;
  private isInitialized: boolean = false;
  private restartDelay: number = 1; // Fixed 1s delay between untype and type again
  private cursorElement: HTMLElement | null = null;
  private animationInterval: any = null;
  private blinkInterval: any = null;
  private cursorVisible: boolean = true;

  isBrowser!: boolean;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {    
    if (!this.isBrowser) return;
    this.setupConfig();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isBrowser) return;
    
    if (changes['config']) {
      this.setupConfig();
      this.updateTextContent();
      
      if (this.isInitialized && this.activeConfig.autoStart) {
        this.startTypingEffect();
      }
    }
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    
    this.updateTextContent();
    this.isInitialized = true;
    
    if (this.activeConfig.autoStart && this.textLength > 0) {
      // Small delay to ensure DOM is fully ready
      setTimeout(() => {
        this.startTypingEffect();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    // Removed cursor cleanup - no cursor element created
  }

  private setupConfig() {
    this.activeConfig = {
      typingSpeed: this.config.typingSpeed ?? this.defaultConfig.typingSpeed, 
      blinkSpeed: this.config.blinkSpeed ?? this.defaultConfig.blinkSpeed,
      cursorColor: this.config.cursorColor ?? this.defaultConfig.cursorColor,
      cursorWidth: this.config.cursorWidth ?? this.defaultConfig.cursorWidth,
      autoStart: this.config.autoStart ?? this.defaultConfig.autoStart,
      loop: this.config.loop ?? this.defaultConfig.loop,
      loopDelay: this.config.loopDelay ?? this.defaultConfig.loopDelay
    }
  }

  private updateTextContent() {
    const element = this.el.nativeElement;
    this.originalText = element.textContent?.trim() || '';
    this.textLength = this.originalText.length;
  }

  public startTypingEffect() {
    if (!this.isBrowser || this.textLength === 0) {
      return;
    }
    
    this.setupElementStyles();
    // Removed cursor creation - no visible cursor needed
    this.startAnimation();
  }

  private setupElementStyles() {
    if (!this.isBrowser) return;

    const element = this.el.nativeElement;
    
    // Clear element content
    element.textContent = '';
    
    // Ensure inline display to keep cursor next to text
    this.renderer.setStyle(element, 'display', 'inline');
  }

  private createCursor() {
    if (!this.isBrowser) return;

    // Remove existing cursor if any
    if (this.cursorElement) {
      this.renderer.removeChild(this.el.nativeElement.parentNode, this.cursorElement);
    }

    // Create cursor element
    this.cursorElement = this.renderer.createElement('span');
    this.renderer.addClass(this.cursorElement, 'typing-cursor');
    
    // Apply cursor styles
    this.renderer.setStyle(this.cursorElement, 'border-right', `${this.activeConfig.cursorWidth} solid ${this.activeConfig.cursorColor}`);
    this.renderer.setStyle(this.cursorElement, 'display', 'inline-block');
    this.renderer.setStyle(this.cursorElement, 'width', '0');
    this.renderer.setStyle(this.cursorElement, 'height', '1em');
    this.renderer.setStyle(this.cursorElement, 'margin-left', '2px');
    this.renderer.setStyle(this.cursorElement, 'animation', `none`);
    
    // Insert cursor after the element
    const parent = this.el.nativeElement.parentNode;
    const nextSibling = this.el.nativeElement.nextSibling;
    if (nextSibling) {
      this.renderer.insertBefore(parent, this.cursorElement, nextSibling);
    } else {
      this.renderer.appendChild(parent, this.cursorElement);
    }
    
    // Start cursor blink
    this.startCursorBlink();
  }

  private startCursorBlink() {
    if (!this.isBrowser || !this.cursorElement) return;
    
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
    }
    
    const blinkDuration = (this.activeConfig.blinkSpeed! * 1000) / 2; // Half for visible, half for hidden
    
    this.blinkInterval = setInterval(() => {
      this.cursorVisible = !this.cursorVisible;
      if (this.cursorElement) {
        this.renderer.setStyle(
          this.cursorElement, 
          'border-color', 
          this.cursorVisible ? this.activeConfig.cursorColor : 'transparent'
        );
      }
    }, blinkDuration);
  }

  private startAnimation() {
    if (!this.isBrowser) return;

    const element = this.el.nativeElement;
    let currentIndex = 0;
    const typingSpeed = (this.activeConfig.typingSpeed! * 1000) / this.textLength; // Convert to ms per character

    const typeCharacter = () => {
      if (currentIndex <= this.textLength) {
        if (currentIndex < this.textLength) {
          element.textContent = this.originalText.substring(0, currentIndex + 1);
        }
        
        currentIndex++;
      } else {
        // Typing complete
        clearInterval(this.animationInterval);
        
        if (this.activeConfig.loop) {
          // Start delay phase
          setTimeout(() => {
            this.startUntypingAnimation();
          }, this.activeConfig.loopDelay! * 1000);
        }
      }
    };

    this.animationInterval = setInterval(typeCharacter, typingSpeed);
  }

  private startUntypingAnimation() {
    if (!this.isBrowser) return;

    const element = this.el.nativeElement;
    let currentLength = this.textLength;
    const typingSpeed = (this.activeConfig.typingSpeed! * 1000) / this.textLength;

    const untypeCharacter = () => {
      if (currentLength > 0) {
        currentLength--;
        element.textContent = this.originalText.substring(0, currentLength);
      } else {
        // Untyping complete
        clearInterval(this.animationInterval);
        
        // Start restart delay then type again
        setTimeout(() => {
          this.startAnimation();
        }, this.restartDelay * 1000);
      }
    };

    this.animationInterval = setInterval(untypeCharacter, typingSpeed);
  }
}
