import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';

@Component({
	selector: 'app-mastering',
	templateUrl: '/app/views/app-mastering.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppMasteringComponent implements OnInit, OnDestroy {

	@HostBinding('fxLayout') public fxLayout: string = 'row';
	@HostBinding('fxLayoutAlign') public fxLayoutAlign: string = 'start stretch';

	public ngOnInit(): void {
		console.log('ngOnInit: AppMasteringComponent initialized');
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppMasteringComponent destroyed');
	}
}
