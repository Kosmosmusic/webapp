import { Directive, ElementRef, OnInit, Input } from '@angular/core';

/**
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

	@Input('fbwidgetsrc') public src: string = 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FKosMosMusicRU&tabs=timeline&width=340&height=1600&small_header=true&adapt_container_width=true&adapt_container_height=true&hide_cover=true&show_facepile=false&appId=1771962743078907';

	/**
	 * Lifecycle hook called after directive is initialized.
	 */
	public ngOnInit(): void {
		this.el.nativeElement.onload = () => {
			console.log('this.el', this.el);
			console.log('this.el.nativeElement', this.el.nativeElement);
			this.height = (!this.height) ? parseInt(this.el.nativeElement.clientHeight, 10) : this.height;
			console.log('this.height', this.height);
			const currentHeight: number = parseInt(this.src.match(/height=\d+(?=&)/)[0].split('=')[1], 10);
			console.log('currentHeight', currentHeight);
			if (currentHeight !== this.height && this.height) {
				this.src = `https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FKosMosMusicRU&tabs=timeline&width=340&height=${this.height}&small_header=true&adapt_container_width=true&adapt_container_height=true&hide_cover=true&show_facepile=false&appId=1771962743078907`;
				console.log('this.el.nativeElement.getAttribute(\'src\')', this.el.nativeElement.getAttribute('src'));
				this.el.nativeElement.setAttribute('src', this.src);
			}
		};
	}

}
