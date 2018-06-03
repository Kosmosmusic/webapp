import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';

@Component({
	selector: 'app-releases',
	templateUrl: '/app/views/app-releases.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppReleasesComponent implements OnInit, OnDestroy {

	@HostBinding('fxLayout') public fxLayout: string = 'row';
	@HostBinding('fxLayoutAlign') public fxLayoutAlign: string = 'start stretch';

	public ngOnInit(): void {
		console.log('ngOnInit: AppReleasesComponent initialized');
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppReleasesComponent destroyed');
	}
}
