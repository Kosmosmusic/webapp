import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Emits spinner stop event when iframe content is loaded.
 */
@Directive({
  selector: '[contentLoaded]',
})
export class AppIframeContentLoadedDirective implements OnInit {
  constructor(private readonly el: ElementRef) {}

  @Input() public contentLoaded = true;

  @Output() public loadedCallback: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();

  private emitLoadedEvent(): void {
    this.loadedCallback.emit(this.el);
  }

  public ngOnInit(): void {
    const nativeElement = this.el.nativeElement as HTMLElement;
    nativeElement.onload = () => {
      // console.log('this.el', this.el);
      this.emitLoadedEvent();
    };
  }
}
