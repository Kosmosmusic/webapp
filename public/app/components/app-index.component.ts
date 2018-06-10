import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';

import { EventEmitterService } from '../services/event-emitter.service';
import { CustomDeferredService } from '../services/custom-deferred.service';
import { FirebaseService } from '../services/firebase.service';
import { BandcampService } from '../services/bandcamp.service';

@Component({
	selector: 'app-index',
	templateUrl: '/app/views/app-index.html',
	host: {
		class: 'mat-body-1'
	}
})
export class AppIndexComponent implements OnInit, OnDestroy {

	/**
	 * @param el Element reference
	 * @param sanitizer DOM danitizer
	 * @param media Observable media
	 * @param emitter Event emitter service - components interaction
	 * @param firebaseService Service for making firebase requests
	 * @param bandcampService Service for generating bandcamp urls
	 */
	constructor(
		private el: ElementRef,
		private sanitizer: DomSanitizer,
		private media: ObservableMedia,
		private emitter: EventEmitterService,
		private firebaseService: FirebaseService,
		private bandcampService: BandcampService
	) {
		// console.log('this.el.nativeElement:', this.el.nativeElement);
	}

	private subscriptions: any[] = [];

	/**
	 * Bandcamp albums data.
	 */
	public bandcampAlbumsData: any = {};

	/**
	 * Bandcamp albums ids.
	 */
	public bandcampAlbumsDataKeys: string[] = [];

	private getBandcampAlbumsData(): Promise<any> {
		const def = new CustomDeferredService<any>();
		this.emitter.emitSpinnerStartEvent();
		this.firebaseService.getDB('bandcamp', true).orderByChild('timestamp').once('value')
			.then((snapshot) => {
				console.log('getBandcampAlbumsData, about', snapshot.val());
				this.bandcampAlbumsData = {};
				// to get sorted data should inerate through snapchot
				snapshot.forEach((child: any, index: any) => {
					console.log('child.val()', child.val(), 'index', index);
					const value = child.val();
					const key = value.releaseCode;
					this.bandcampAlbumsData[key] = value;
				});
				this.emitter.emitSpinnerStopEvent();
				def.resolve();
			})
			.catch((error) => {
				console.log('getBandcampAlbumsData, error', error);
				this.emitter.emitSpinnerStopEvent();
				def.reject();
			});
		return def.promise;
	}

	/**
	 * Iframe url for bandcamp album widget.
	 * @param releaseCode album release code which should be used to resolve a bandcamp album id.
	 */
	public bcIframeUrl(releaseCode: string): string {
		const albumId: string = this.bandcampAlbumsData[releaseCode].bandcampAlbumId;
		return this.bandcampService.getIframeUrl(albumId);
	}
	/**
	 * Anchor url for bandcamp album widget.
	 */
	public bcAnchorUrl(releaseCode: string): SafeUrl {
		return this.sanitizer.bypassSecurityTrustUrl(this.bandcampService.getAnchorUrl(releaseCode));
	}

	/**
	 * Responsive grid columns.
	 */
	public gridColumns: number = 3;

	public ngOnInit(): void {
		console.log('ngOnInit: AppIndexComponent initialized');

		this.getBandcampAlbumsData().then(() => {
			this.bandcampAlbumsDataKeys = Object.keys(this.bandcampAlbumsData);
		});

		let sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			console.log('AppIndexComponent consuming event:', event);
		});
		this.subscriptions.push(sub);

		sub = this.media.asObservable().subscribe((event: MediaChange) => {
			console.log('flex-layout media change event', event);
			this.gridColumns = (event.mqAlias === 'xs') ? 1 : (event.mqAlias === 'sm') ? 2 : (event.mqAlias === 'md') ? 3 : (event.mqAlias === 'lg') ? 4 : 5;
		});
		this.subscriptions.push(sub);
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
