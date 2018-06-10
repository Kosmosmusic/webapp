import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';

import { EventEmitterService } from '../services/event-emitter.service';

@Component({
	selector: 'app-releases',
	templateUrl: '/app/views/app-releases.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppReleasesComponent implements OnInit, OnDestroy {

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
		console.log('ngOnInit: AppReleasesComponent initialized');
		this.emitter.emitSpinnerStartEvent();
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppReleasesComponent destroyed');
	}
}
