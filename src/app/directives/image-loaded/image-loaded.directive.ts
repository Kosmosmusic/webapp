import { Directive, ElementRef, OnInit } from '@angular/core';

/**
 * Replaces image with app logo if its loading results in an error
 */
@Directive({
  selector: '[imageloaded]'
})
export class ImageLoadedDirective implements OnInit {

  /**
   * @param el Element reference
   */
  constructor(
    private el: ElementRef
  ) {}

  /**
   * Image load event listener.
   * Removes event listener only.
   */
  private loadEventListener(event: any): void {
    const el: ElementRef = new ElementRef(event.path[0]);
    el.nativeElement.removeEventListener('load', this.loadEventListener);
  }

  /**
   * Image load error event listener.
   * Replaces errored image with default one, and removes event listener.
   */
  private errorEventListener(event: any): void {
    const el: ElementRef = new ElementRef(event.path[0]);
    el.nativeElement.src = window.location.origin + '/assets/img/kosmos_square.svg';
    el.nativeElement.removeEventListener('load', this.loadEventListener);
  }

  /**
   * Lifecycle hook called after directive is initialized.
   */
  public ngOnInit(): void {
    this.el.nativeElement.addEventListener('load', this.loadEventListener);
    this.el.nativeElement.addEventListener('error', this.errorEventListener);
  }

}