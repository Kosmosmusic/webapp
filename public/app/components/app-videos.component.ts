import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';

import { GoogleApiService } from '../services/google-api.service';

@Component({
	selector: 'app-videos',
	templateUrl: '/app/views/app-videos.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppVideosComponent implements OnInit, OnDestroy {

	constructor(
		private googleAPI: GoogleApiService
	) {}

	@HostBinding('fxLayout') public fxLayout: string = 'row';
	@HostBinding('fxLayoutAlign') public fxLayoutAlign: string = 'start stretch';

	private channelData: any;
	public uploads: any;
	public playlistSrc: string;

	public ngOnInit(): void {
		console.log('ngOnInit: AppVideosComponent initialized');
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppVideosComponent destroyed');
	}
}
