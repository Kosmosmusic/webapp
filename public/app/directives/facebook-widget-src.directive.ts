import { Directive, ElementRef, OnInit, Input } from '@angular/core';

/**
 * Sets facebook widget src.
 * Stretches facebook widget to full container (iframe) height.
 */
@Directive({
	selector: '[fbwidgetsrc]'
})
export class FacebookWidgetSrcDirective implements OnInit {

	constructor(
		private el: ElementRef
	) {}

	private height: number;

	protected widgetHeight: number = 3200;

	@Input('fbwidgetsrc') public src: string = `https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FKosMosMusicRU&tabs=timeline&width=340&height={this.widgetHeight}&small_header=true&adapt_container_width=true&adapt_container_height=false&hide_cover=true&show_facepile=false&appId=1771962743078907`;

	/**
	 * Lifecycle hook called after directive is initialized.
	 */
	public ngOnInit(): void {
		this.el.nativeElement.onload = () => {
			console.log('fbwidgetsrc, this.el', this.el);
			console.log('fbwidgetsrc, this.el.nativeElement', this.el.nativeElement);
			this.height = (!this.height) ? parseInt(this.el.nativeElement.clientHeight, 10) : this.height;
			console.log('fbwidgetsrc, this.height', this.height);
			const currentHeight: number = parseInt(this.src.match(/height=\d+(?=&)/)[0].split('=')[1], 10);
			console.log('fbwidgetsrc, currentHeight', currentHeight);
			if (currentHeight !== this.height && this.height) {
				this.height = currentHeight;
				this.src = `https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FKosMosMusicRU&tabs=timeline&width=340&height=${currentHeight}&small_header=true&adapt_container_width=true&adapt_container_height=false&hide_cover=true&show_facepile=false&appId=1771962743078907`;
				// console.log('this.el.nativeElement.getAttribute(\'src\')', this.el.nativeElement.getAttribute('src'));
				this.el.nativeElement.setAttribute('src', this.src);
				this.el.nativeElement.setAttribute('height', currentHeight + 'px');
			}
		};
	}

}
