import { Component, Input, Inject, OnInit, OnDestroy, ElementRef, HostBinding } from '@angular/core';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { EventEmitterService } from '../services/event-emitter.service';
import { FirebaseService } from '../services/firebase.service';
import { SoundcloudService } from '../services/soundcloud.service';

/**
 * Demo dialog.
 */
@Component({
	selector: 'soundcloud-player',
	templateUrl: '/app/views/soundcloud-player.html',
	inputs: [ 'mode', 'userId', 'playlistId' ],
	host: {
		class: 'mat-body-1'
	}
})
export class SoundcloudPlayerComponent implements OnInit, OnDestroy {

	/**
	 * @param el Element reference
	 * @param sanitizer DOM danitizer
	 * @param emitter Event emitter service - components interaction
	 * @param firebaseService Service for making firebase requests
	 * @param soundcloudService Soundcloud API wrapper
	 * @param window Window reference
	 */
	constructor(
		private el: ElementRef,
		private sanitizer: DomSanitizer,
		private emitter: EventEmitterService,
		private firebaseService: FirebaseService,
		private soundcloudService: SoundcloudService,
		@Inject('Window') private window: Window
	) {
		console.log('SoundcloudPlayerComponent constructor, el', this.el.nativeElement);
	}

	/**
	 * Component subscriptions.
	 */
	private subscriptions: any[] = [];

	/**
	 * Soundcloud player mode.
	 */
	@Input('mode') private mode: 'user'|'playlist' = 'user';

	/**
	 * Soundcloud user id.
	 */
	@Input('userId') private userId: string = '403059';

	/**
	 * Soundcloud playlist id.
	 */
	@Input('playlistId') private playlistId: string = '1275637';

	/**
	 * Soundcloud user tracks from shared service.
	 */
	public tracks: any[] = this.soundcloudService.data.tracks.collection.slice();

	/**
	 * Soundcloud playlist.
	 */
	public playlist: any = {};

	/**
	 * Soundcloud service for template usage.
	 * @param trackStreamUrl Soundcloud track stream url
	 */
	public scPlayerUrl(trackStreamUrl: string): SafeUrl {
		return this.soundcloudService.getLinkWithId(trackStreamUrl);
	}

	/**
	 * Selected track index.
	 */
	public selectedTrackIndex: number;

	/**
	 * Selects a track.
	 */
	public selectTrack(index: number): void {
		this.selectedTrackIndex = index;
	}

	/**
	 * Gets link with id from Soundcloud Service (public for template usage).
	 */
	public getLinkWithId(href: string): string {
		return this.soundcloudService.getLinkWithId(href);
	}

	/**
	 * Indicated that there's not more tracks left in the list.
	 */
	private noMoreTracks: boolean = false;

	/**
	 * Loading indicator, so that more tracks loading happens sequentially.
	 */
	private loading: boolean = false;

	/**
	 * Loads more soundcloud tracks.
	 */
	private loadMoreTracks(): void {
		if (!this.noMoreTracks && !this.loading) {
			this.loading = true;
			this.emitter.emitSpinnerStartEvent();
			console.log('this.tracks.length', this.tracks.length);
			this.soundcloudService.getUserTracks(this.userId).then(
				(collection: any[]) => {
					console.log('current tracks, this tracks', this.tracks);
					console.log('got more user tracks, collection', collection);
					if (!collection.length) {
						this.noMoreTracks = true;
					}
					this.tracks = this.soundcloudService.data.tracks.collection.slice();
					this.loading = false;
					this.emitter.emitSpinnerStopEvent();
				},
				(error: any) => {
					console.log('soundcloudService.getUserTracks, error', error);
					this.loading = false;
					this.emitter.emitSpinnerStopEvent();
				}
			);
		} else {
			console.log('Soundcloud player: no more tracks');
		}
	}

	/**
	 * Lifecycle hook called after component is initialized.
	 */
	public ngOnInit(): void {
		console.log('ngOnInit: SoundcloudPlayerComponent initialized');

		if (this.mode === 'user') {
			this.loadMoreTracks();
		} else if (this.mode === 'playlist') {
			this.soundcloudService.getPlaylist(this.playlistId).then(
				(playlist: object) => {
					console.log('got playlist', playlist);
					this.playlist = playlist;
				},
				(error: any) => console.log('soundcloudService.getUserTracks, error', error)
			);
		}

		const sub: any = this.emitter.getEmitter().subscribe((event: any) => {
			console.log('SoundcloudPlayerComponent consuming event:', event);
			if (event.soundcloud === 'loadMoreTracks') {
				if (!this.noMoreTracks) {
					this.loadMoreTracks();
				}
			}
		});
		this.subscriptions.push(sub);
	}
	/**
	 * Lifecycle hook called after component is destroyed.
	 */
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: SoundcloudPlayerComponent destroyed');
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
