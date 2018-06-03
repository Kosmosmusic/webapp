import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';

declare let d3: any;

@Component({
	selector: 'app-index',
	templateUrl: '/app/views/app-index.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppIndexComponent implements OnInit, OnDestroy {

	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService,
	) {
		// console.log('this.el.nativeElement:', this.el.nativeElement);
	}

	private subscriptions: any[] = [];

	/*
	private getPublicData(): Promise<void> {
		const def = new CustomDeferredService<void>();
		this.publicDataService.getData().subscribe(
			(data: any[]) => {
				this.nvd3.clearElement();
				this.appUsageData = data;
				def.resolve();
			},
			(error: any) => null, // service catches error
			() => {
				console.log('getPublicData done');
			}
		);
		return def.promise;
	}
	*/

	public ngOnInit(): void {
		console.log('ngOnInit: AppIndexComponent initialized');
		this.emitter.emitSpinnerStartEvent();

		const sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			console.log('AppIndexComponent consuming event:', event);
		});
		this.subscriptions.push(sub);
/*
		this.getPublicData()
			.then(() => this.getServerStaticData())
			.then(() => {
				this.emitter.emitSpinnerStopEvent();
			})
			.catch((error: any) => console.log('dashboard intro init requests error'));
*/
	}
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppIndexComponent destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
