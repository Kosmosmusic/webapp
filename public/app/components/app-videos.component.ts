import { Component, OnInit, OnDestroy, Inject, HostBinding } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { CustomDeferredService } from '../services/custom-deferred.service';
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
		private sanitizer: DomSanitizer,
		private googleAPI: GoogleApiService,
		@Inject('Window') private window: Window
	) {}

	@HostBinding('fxLayout') public fxLayout: string = 'row';
	@HostBinding('fxLayoutAlign') public fxLayoutAlign: string = 'start stretch';

	private channelData: any;
	private uploads: any;
	public playlistSrc: SafeUrl;

	private getChannelData(): Promise<any> {
		const def = new CustomDeferredService<any>();
		this.googleAPI.getChannelData().subscribe(
			(data: any) => {
				this.channelData = data;
				this.uploads = data.items[0].contentDetails.relatedPlaylists.uploads;
				this.playlistSrc = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/?listType=playlist&list=' + this.uploads + '&enablejsapi=1&origin=' + this.window.location.origin);
				def.resolve();
			},
			(error: string) => {
				console.log('getChannelData, error', error);
				def.reject();
			}
		);
		return def.promise;
	}

	public ngOnInit(): void {
		console.log('ngOnInit: AppVideosComponent initialized');
		this.getChannelData();
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppVideosComponent destroyed');
	}
}
