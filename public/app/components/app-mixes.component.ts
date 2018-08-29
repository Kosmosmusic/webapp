import { Component, OnInit, OnDestroy, ElementRef, HostBinding } from '@angular/core';

@Component({
	selector: 'app-mixes',
	templateUrl: '/app/views/app-mixes.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppMixesComponent implements OnInit, OnDestroy {

	constructor(
		private el: ElementRef
	) {}

	@HostBinding('fxLayout') public fxLayout: string = 'row';
	@HostBinding('fxLayoutAlign') public fxLayoutAlign: string = 'start stretch';

	public ngOnInit(): void {
		console.log('ngOnInit: AppMixesComponent initialized', this.el);
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppMixesComponent destroyed');
	}
}
