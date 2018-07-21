import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, Inject, ViewChild, Renderer2 } from '@angular/core';
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
export class AppIndexComponent implements OnInit, AfterViewInit, OnDestroy {

	/**
	 * @param el Element reference
	 * @param sanitizer DOM danitizer
	 * @param media Observable media
	 * @param emitter Event emitter service - components interaction
	 * @param renderer Application renderer
	 * @param firebaseService Service for making firebase requests
	 * @param bandcampService Service for generating bandcamp urls
	 * @param window Window reference
	 */
	constructor(
		private el: ElementRef,
		private sanitizer: DomSanitizer,
		private media: ObservableMedia,
		private emitter: EventEmitterService,
		private renderer: Renderer2,
		private firebaseService: FirebaseService,
		private bandcampService: BandcampService,
		@Inject('Window') private window: Window
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
			.then((snapshot: any) => {
				console.log('getBandcampAlbumsData, about', snapshot.val());
				this.bandcampAlbumsData = {};
				// to get sorted data should inerate through snapchot
				snapshot.forEach((child: any) => {
					// console.log('child.val()', child.val());
					const value = child.val();
					const key = value.releaseCode;
					this.bandcampAlbumsData[key] = value;
				});
				this.gridInitialized = true;
				this.initFacebookJsSDK();
				this.emitter.emitSpinnerStopEvent();
				def.resolve();
			})
			.catch((error: any) => {
				console.log('getBandcampAlbumsData, error', error);
				this.emitter.emitSpinnerStopEvent();
				def.reject();
			});
		return def.promise;
	}

	/**
	 * Bandcamp iframe counter.
	 * Needeed for loading sequential iframes, one by one.
	 */
	public bcIframeCounter: number = 0;

	/**
	 * Indicates max bandcamp widgets count to render based on scroll position.
	 */
	public bcMaxCounter: number = 6;

	/**
	 * Resets bandcamp counters.
	 */
	private resetBandcampCounters(): void {
		this.bcIframeCounter = 0;
		this.bcMaxCounter = 6;
	}

	/**
	 * Increments Bandcamp iframe counter.
	 */
	public incrementLoadingCounter(): void {
		if (this.bcIframeCounter <= this.bcMaxCounter) {
			this.bcIframeCounter++;
			console.log('this.bcIframeCounter', this.bcIframeCounter);
		}
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

	/**
	 * Indicates if bandcamp grid should be shown or not.
	 */
	public showBandcampGrid: boolean = true;

	/**
	 * Indicates if grid data model is initialized.
	 * Is used to correctly render facebook widget.
	 */
	public gridInitialized: boolean = false;

	/**
	 * Creates Facebook root div.
	 * @return Facebook root div reference <div id="fb-root"></div>
	 */
	private createFbRoot(): any {
		const doc: Document = this.window.document;
		let ref: any = doc.getElementById('fb-root'); // try getting it first
		if (!ref) {
			// create 'fb-root' if it does not exist
			ref = doc.createElement('div');
			ref.id = 'fb-root';
			const firstScriptTag: any = doc.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(ref, firstScriptTag);
		}
		return ref;
	}

	/**
	 * Initializes facebook javascript sdk.
	 *
	 * see:
	 * - https://developers.facebook.com/docs/javascript/howto/angularjs
	 * - https://blog.brunoscopelliti.com/facebook-authentication-in-your-angularjs-web-app/
	 */
	private initFacebookJsSDK(): void {
		const id: string = 'facebook-jssdk';
		const doc: Document = this.window.document;
		const ref: any = this.createFbRoot();
		console.log('ref', ref);
		// return if script is already included
		if (doc.getElementById(id)) {
			return;
		}
		const js: any = doc.createElement('script');
		js.id = id;
		js.async = true;
		js.src = 'https://connect.facebook.net/en_US/sdk.js#status=1&xfbml=1&version=v3.0&appId=477209839373369&channelUrl=channel.html';

		ref.parentNode.insertBefore(js, ref);
	}

	/**
	 * Removes facebook sdk, and optionally fb-root (not used for now, see ngOnDestroy hook).
	 */
	private removeFbJsSDK(): void {
		const id: string = 'facebook-jssdk';
		const doc: Document = this.window.document;
		const ref: any = doc.getElementById('fb-root');
		const js: any = doc.getElementById('facebook-jssdk');
		// removed both script and fb-root
		if (js) {
			ref.parentNode.removeChild(js); // sdk script
			// ref.parentNode.removeChild(ref); // fb-root
		}
	}

	@ViewChild('content') private content: ElementRef;

	/**
	 * Renderer2 listener instance.
	 */
	private rendererListener: any;
	/**
	 * Scroll top value.
	 */
	private previousScrollTopValue: number = 0;
	/**
	 * Binds to mat-sidenav-content scroll event.
	 */
	private bindToContentScrollEvent(): void {
		// let previousScrollTopValue: number = 0;
		this.rendererListener = this.renderer.listen(this.content.nativeElement.parentNode.parentNode, 'scroll', (event) => {
			// console.log('mat-sidenav-content scroll, event', event);
			const currentScrollTopValue: number = event.target.scrollTop;
			// increment bandcamp max counter when user scrolls down
			const currentBcMaxCounterValue: number = Math.floor(1.3 * this.gridColumns * Math.ceil((currentScrollTopValue / event.target.scrollHeight) * Math.pow(this.gridColumns, 2)));
			console.log('currentBcMaxCounterValue', currentBcMaxCounterValue);
			if (this.previousScrollTopValue < currentScrollTopValue && currentBcMaxCounterValue > this.bcMaxCounter) {
				this.bcMaxCounter = currentBcMaxCounterValue;
				console.log('this.bcMaxCounter', this.bcMaxCounter);
			}
			this.previousScrollTopValue = currentScrollTopValue;
		});
	}

	/**
	 * Since bandcamp widgets lag in Google chrome, use this method to use alternative soundcloud widget.
	 */
	public isGoogleChrome(): boolean {
		// see https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome#13348618
		// please note,
		// that IE11 now returns undefined again for window.chrome
		// and new Opera 30 outputs true for window.chrome
		// but needs to check if window.opr is not undefined
		// and new IE Edge outputs to true now for window.chrome
		// and if not iOS Chrome check
		// so use the below updated condition
		const chrome: string = 'chrome';
		const isChromium = this.window[chrome] !== null && typeof this.window[chrome] !== 'undefined';
		const navigator = this.window.navigator;
		const vendorName = navigator.vendor;
		const opr: string = 'opr';
		const isOpera = typeof this.window[opr] !== 'undefined';
		const isIEedge = navigator.userAgent.indexOf('Edge') > -1;
		const isIOSChrome = navigator.userAgent.match('CriOS');

		if (isIOSChrome) {
			// is Google Chrome on IOS
			return true;
		} else if (isChromium && vendorName === 'Google Inc.' && isOpera === false && isIEedge === false) {
			// is Google Chrome
			return true;
		} else {
			// not Google Chrome
			return false;
		}
	}

	/**
	 * Lifecycle hook called after component is initialized.
	 */
	public ngOnInit(): void {
		console.log('ngOnInit: AppIndexComponent initialized');

		this.bindToContentScrollEvent();

		this.createFbRoot();

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

			if (event.mqAlias === 'xs' || event.mqAlias === 'sm') {
				this.showBandcampGrid = false;
				this.gridInitialized = false;
				// reset bandcamp counters
				this.resetBandcampCounters();
				this.previousScrollTopValue = 0;
			} else {
				this.showBandcampGrid = true;
				this.gridInitialized = true;
			}
		});
		this.subscriptions.push(sub);
	}
	public ngAfterViewInit(): void {
		this.initFacebookJsSDK();
	}
	/**
	 * Lifecycle hook called after component is destroyed.
	 */
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: AppIndexComponent destroyed');
		// this.removeFbJsSDK();
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
