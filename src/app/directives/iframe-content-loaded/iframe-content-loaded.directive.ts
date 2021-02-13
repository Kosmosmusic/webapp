import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Emits spinner stop event when iframe content is loaded.
 */
@Directive({
  selector: '[appContentLoaded]',
})
export class AppIframeContentLoadedDirective implements OnInit {
  constructor(private readonly el: ElementRef) {}

  @Input() public contentLoaded = true;

  @Output() public readonly loadedCallback = new EventEmitter<ElementRef>();

  private emitLoadedEvent(): void {
    this.loadedCallback.emit(this.el);
  }

  public ngOnInit(): void {
    const nativeElement = this.el.nativeElement as HTMLElement;
    nativeElement.onload = () => {
      this.emitLoadedEvent();
    };
  }
}
