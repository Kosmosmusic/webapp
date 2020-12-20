import { Directive, ElementRef, OnInit } from '@angular/core';

/**
 * Replaces image with app logo if its loading results in an error
 */
@Directive({
  selector: '[imageloaded]',
})
export class AppImageLoadedDirective implements OnInit {
  constructor(private readonly el: ElementRef) {}

  /**
   * Image load event listener.
   * Removes event listener only.
   */
  private loadEventListener(event: Event): void {
    const el: ElementRef = new ElementRef((event as Event & { path: HTMLImageElement }).path[0]);
    const nativeElement = el.nativeElement as HTMLImageElement;
    nativeElement.removeEventListener('load', this.loadEventListener);
  }

  /**
   * Image load error event listener.
   * Replaces errored image with default one, and removes event listener.
   */
  private errorEventListener(event: Event): void {
    const el: ElementRef = new ElementRef((event as Event & { path: HTMLImageElement }).path[0]);
    const nativeElement = el.nativeElement as HTMLImageElement;
    nativeElement.src = window.location.origin + '/assets/img/kosmos_square.svg';
    nativeElement.removeEventListener('load', this.loadEventListener);
  }

  public ngOnInit(): void {
    const nativeElement = this.el.nativeElement as HTMLImageElement;
    nativeElement.addEventListener('load', this.loadEventListener);
    nativeElement.addEventListener('error', this.errorEventListener);
  }
}
