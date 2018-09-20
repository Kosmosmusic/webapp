import { Component, Input, Inject, OnInit, OnDestroy, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

import { EventEmitterService } from '../services/event-emitter.service';
import { FirebaseService } from '../services/firebase.service';
import { SoundcloudService } from '../services/soundcloud.service';

import { UserInterfaceUtilsService } from '../services/user-interface-utils.service';

import { ISoundcloudPlaylist } from '../interfaces/index';

/**
 * Soundcloud player component.
 */
@Component({
	selector: 'soundcloud-player',
	templateUrl: '/app/views/soundcloud-player.html',
	inputs: [ 'mode', 'userId', 'playlistId' ],
	host: {
		class: 'mat-body-1'
	}
})
export class SoundcloudPlayerComponent implements OnInit, OnDestroy, OnChanges {

	/**
	 * @param el Element reference
	 * @param emitter Event emitter service - components interaction
	 * @param firebaseService Service for making firebase requests
	 * @param soundcloudService Soundcloud API wrapper
	 * @param uiUtils User Interface Utilities Service
	 * @param window Window reference
	 */
	constructor(
		private el: ElementRef,
		private emitter: EventEmitterService,
		private firebaseService: FirebaseService,
		private soundcloudService: SoundcloudService,
		public uiUtils: UserInterfaceUtilsService,
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
	@Input('mode') private mode: 'kosmosmusic'|'kosmoslab'|'playlist' = 'kosmosmusic';

	/**
	 * Predefined ids.
	 */
	private predefinedIDs = {
		user: {
			kosmosmusic: '403059',
			kosmoslab: '217740895'
		},
		playlist: {
			mixes: '24529973'
		}
	};

	/**
	 * Soundcloud user id.
	 */
	@Input('userId') private userId: string = '403059';

	/**
	 * Soundcloud playlist id.
	 */
	@Input('playlistId') private playlistId: string = '24529973';

	/**
	 * Soundcloud user tracks from shared service.
	 */
	public tracks: any[] = (this.soundcloudService.data.tracks.collection) ? this.soundcloudService.data.tracks.collection.slice() : [];

	/**
	 * Soundcloud playlist.
	 */
	public playlist: ISoundcloudPlaylist = this.soundcloudService.data.playlist || new ISoundcloudPlaylist();

	/**
	 * Indicates quantity of playlist tracks to be rendered.
	 */
	public renderPlaylistTracks: number = 15;

	/**
	 * Rendered playlist.
	 */
	public renderedPlaylist: any[] = this.soundcloudService.data.playlist.tracks.slice(0, this.renderPlaylistTracks) || [];

	/**
	 * Renders more playlist tracks.
	 */
	private renderMorePlaylistTracks(): void {
		this.renderPlaylistTracks = (this.playlist.tracks.length - this.renderPlaylistTracks > 25) ? this.renderPlaylistTracks + 25 : this.playlist.tracks.length;
		this.renderedPlaylist = this.soundcloudService.data.playlist.tracks.slice(0, this.renderPlaylistTracks) || [];
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
	 * Loads more soundcloud tracks or a playlist.
	 */
	private loadMoreTracks(): void {
		if (!this.noMoreTracks && !this.loading) {
			this.loading = true;
			this.emitter.emitSpinnerStartEvent();
			if (/(kosmosmusic|kosmoslab)/.test(this.mode)) {
				console.log('this.tracks.length', this.tracks.length);
				this.soundcloudService.getUserTracks(this.userId).then(
					(collection: any[]) => {
						console.log('current tracks', this.tracks);
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
			} else if (/playlist/.test(this.mode)) {
				console.log('this.playlist', this.playlist);
				this.soundcloudService.getPlaylist(this.playlistId).then(
					(playlist: ISoundcloudPlaylist) => {
						console.log('current playlist', this.playlist);
						console.log('new playlist value', playlist);
						this.noMoreTracks = true;
						this.playlist = this.soundcloudService.data.playlist;
						this.renderedPlaylist = this.soundcloudService.data.playlist.tracks.slice(0, this.renderPlaylistTracks) || [];
						this.loading = false;
						this.emitter.emitSpinnerStopEvent();
					},
					(error: any) => {
						console.log('soundcloudService.getUserTracks, error', error);
						this.loading = false;
						this.emitter.emitSpinnerStopEvent();
					}
				);
			} else if (/playlist/.test(this.mode)) {
				this.renderMorePlaylistTracks();
			}
		} else {
			console.log('Soundcloud player: no more tracks');
		}
	}

	/**
	 * Current Soundcloud player object.
	 */
	public player: any;
	/**
	 * Returns if playback is in progress, required for UI.
	 */
	public playbackInProgress(): boolean {
		if (this.player) {
			return (this.player.isActuallyPlaying()) ? true : false;
		}
		return false;
	}
	/**
	 * Kills player.
	 */
	private playerKill(): void {
		if (this.player) {
			this.player.kill();
		}
	}
	/**
	 * Triggers player playback/pause.
	 * @param track Track object
	 * @param trackIndex Track index in view component array
	 */
	public playTrack(track: any, trackIndex: number): void {
		console.log('playTrack, track: ', track, ', trackIndex', trackIndex);
		if (this.selectedTrackIndex !== trackIndex) {
			// kill player if exists
			this.playerKill();
			this.selectTrack(trackIndex);
			this.emitter.emitSpinnerStartEvent();
			this.soundcloudService.streamTrack(track.id).then(
				(player: any) => {
					console.log('soundcloudService.streamTrack, player: ', player);
					/**
					 * Player functions:
					 * - currentTime
					 * - getDuration
					 * - getState
					 * - getVolume
					 * - hasErrored
					 * - isActuallyPlaying
					 * - isBuffering
					 * - isDead
					 * - isEnded
					 * - isPlaying
					 * - kill
					 * - listenTo
					 * - listenToOnce
					 * - off
					 * - on
					 * - once
					 * - pause
					 * - play
					 * - seek
					 * - setVolume
					 * - stopListening
					 * - trigger
					 * - unbind
					 */
					this.player = player;
					setTimeout(() => {
						this.player.play();
						this.reportWaveformProgress();
						this.emitter.emitSpinnerStopEvent();
					}, 1000);
				},
				(error: any) => {
					this.emitter.emitSpinnerStopEvent();
				}
			);
		} else {
			console.log('trigger player, player', this.player);
			if (this.player.isActuallyPlaying()) {
				this.player.pause();
				clearInterval(this.waveformProgressInterval);
			} else {
				this.player.play();
				this.reportWaveformProgress();
			}
		}
	}
	/**
	 * Waveform progress interval.
	 */
	private waveformProgressInterval: any;
	/**
	 * Reports waveform progress to UI.
	 */
	public reportWaveformProgress(): void {
		console.log('reportWaveformProgress');
		this.waveformProgressInterval = setInterval(() => {
			const visibleWaveform: ElementRef = new ElementRef(this.window.document.getElementsByClassName('waveform')[0]);
			console.log('this.player.currentTime', this.player.currentTime());
			console.log('this.player.getDuration', this.player.getDuration());
			const playbackProgress: number = Math.floor(this.player.currentTime() * 100 / this.player.getDuration());
			const nextVal = playbackProgress + 1;
			console.log('playbackProgress', playbackProgress);
			visibleWaveform.nativeElement.style.background = `linear-gradient(to right, rgba(171,71,188,1) 0%,rgba(171,71,188,1) ${playbackProgress}%, rgba(30,87,153,0) ${nextVal}%, rgba(30,87,153,0) 100%)`;
		}, 1000);
	}
	/**
	 * Waveform client event handler.
	 * @param event waveform click event
	 */
	public waveformClick(event: any): void {
		console.log('waveformClick, event', event);
		const waveformWidth: number = event.srcElement.clientWidth;
		const offsetX: number = event.offsetX;
		const percent: number = offsetX * 100 / waveformWidth;
		const newProgress: number = this.player.getDuration() * percent / 100;
		this.player.seek(newProgress).then((data: any) => {
			console.log('player seek success', data);
		});
	}

	/**
	 * Resets player.
	 * Is used when mode Input chanes.
	 * Kills player, resets soundcloud service data.
	 * @param onlyProgress if only progress interval should be reset
	 */
	private resetPlayer(onlyProgress?: boolean): void {
		if (!onlyProgress) {
			this.playerKill();
			this.soundcloudService.resetServiceData();
			this.tracks = [];
			this.playlist = new ISoundcloudPlaylist();
			this.noMoreTracks = false;
		}
		clearInterval(this.waveformProgressInterval);
	}

	/**
	 * Lifecycle hook called after component is initialized.
	 */
	public ngOnInit(): void {
		console.log('ngOnInit: SoundcloudPlayerComponent initialized');

		this.loadMoreTracks();

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
	 * Lifecycle hook called on input changes.
	 */
	public ngOnChanges(changes: SimpleChanges): void {
		console.log('SoundcloudPlayerComponent, changes', changes);
		if (changes.mode.currentValue === 'kosmoslab') {
			this.resetPlayer();
			this.userId = this.predefinedIDs.user.kosmoslab;
			this.loadMoreTracks();
		} else if (changes.mode.currentValue === 'kosmosmusic') {
			this.resetPlayer();
			this.userId = this.predefinedIDs.user.kosmosmusic;
			this.loadMoreTracks();
		}
	}
	/**
	 * Lifecycle hook called after component is destroyed.
	 */
	public ngOnDestroy(): void {
		console.log('ngOnDestroy: SoundcloudPlayerComponent destroyed');
		this.resetPlayer(true);
		if (this.subscriptions.length) {
			for (const sub of this.subscriptions) {
				sub.unsubscribe();
			}
		}
	}
}
