import { Component, Inject, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

/**
 * Bassdrive player component.
 */
@Component({
	selector: 'bassdrive-player',
	templateUrl: '/app/views/bassdrive-player.html',
	host: {
		class: 'mat-body-1'
	}
})
export class BassdrivePlayerComponent implements OnInit, OnDestroy {

	/**
	 * @param el Element reference
	 * @param window Window reference
	 */
	constructor(
		private el: ElementRef,
		private sanitizer: DomSanitizer,
		@Inject('Window') private window: Window
	) {
		console.log('BassdrivePlayerComponent constructor, el', this.el.nativeElement);
	}

	/**
	 * Component subscriptions.
	 */
	private subscriptions: any[] = [];

	/**
	 * Stream url.
	 */
	// public streamUtl: SafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://bassdrive.radioca.st:80/;stream/1');
	public streamUtl: SafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.window.location.origin + '/bassdriveProxy');

	/**
	 * Player view child reference.
	 */
	@ViewChild('player') private player: ElementRef;

	/**
	 * Starts playback.
	 */
	public play(): void {
		if (this.player.nativeElement.paused) {
			this.player.nativeElement.play();
		}
	}

	/**
	 * Pauses playback.
	 */
	public pause(): void {
		if (!this.player.nativeElement.paused) {
			this.player.nativeElement.pause();
		}
	}

	/**
	 * Indicates is player is paused.
	 */
	public isPaused(): boolean {
		return this.player.nativeElement.paused;
	}

	/**
	 * Lifecycle hook called after component is initialized.
	 */
	public ngOnInit(): void {
		console.log('ngOnInit: BassdrivePlayerComponent initialized, player', this.player);
		console.log('player.nativeElement', this.player.nativeElement);
	}
	/**
	 * Lifecycle hook called after component is destroyed.
	 */
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: BassdrivePlayerComponent destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
