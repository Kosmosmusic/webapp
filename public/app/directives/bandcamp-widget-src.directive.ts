import { Directive, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';

/**
 * Sets bandcamp widget src.
 */
@Directive({
	selector: '[bcwidgetsrc]'
})
export class BandcampWidgetSrcDirective implements OnInit {

	constructor(
		private el: ElementRef
	) {}

	@Input('bcwidgetsrc') public src: string = 'https://kosmosmusicru.bandcamp.com';

	@Output('loadedcallback') public loadedCallback: EventEmitter<any> = new EventEmitter<any>();

	private emitLoadedEvent(): void {
		this.loadedCallback.emit(true);
	}

	/**
	 * Lifecycle hook called after directive is initialized.
	 */
	public ngOnInit(): void {
		this.el.nativeElement.onload = () => {
			// console.log('this.el', this.el);
			// console.log('this.el.nativeElement', this.el.nativeElement);
			if (this.src) {
				this.el.nativeElement.setAttribute('src', this.src);
				this.emitLoadedEvent();
				// console.log('this.el.nativeElement.getAttribute(\'src\')', this.el.nativeElement.getAttribute('src'));
				this.el.nativeElement.onload = () => true;
			}
		};
	}

}
