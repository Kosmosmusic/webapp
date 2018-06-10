import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';

import { EventEmitterService } from '../services/event-emitter.service';

@Component({
	selector: 'app-mixes',
	templateUrl: '/app/views/app-mixes.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppMixesComponent implements OnInit, OnDestroy {

	constructor(
		private emitter: EventEmitterService
	) {}

	@HostBinding('fxLayout') public fxLayout: string = 'row';
	@HostBinding('fxLayoutAlign') public fxLayoutAlign: string = 'start stretch';

	/**
	 * Should be called once iframe content finished loading.
	 */
	public contentLoaded(): void {
		console.log('content loaded');
		this.emitter.emitSpinnerStopEvent();
	}

	public ngOnInit(): void {
		console.log('ngOnInit: AppMixesComponent initialized');
		this.emitter.emitSpinnerStartEvent();
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppMixesComponent destroyed');
	}
}
