import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, from, of, timer } from 'rxjs';
import { concatMap, first, map, mapTo, takeWhile, tap } from 'rxjs/operators';

import { ISoundcloudPlayer } from '../../interfaces/soundcloud/soundcloud-player.interface';
import {
  ISoundcloudTrack,
  trackDefaultValues,
} from '../../interfaces/soundcloud/soundcloud-track.config';
import { IEventTargetWithPosition, IEventWithPosition } from '../../interfaces/ui/ui.interface';
import { AppHttpProgressState } from '../../state/http-progress/http-progress.store';
import { AppSoundcloudService } from '../../state/soundcloud/soundcloud.service';
import { AppSoundcloudState } from '../../state/soundcloud/soundcloud.store';
import { WINDOW } from '../../utils/injection-tokens';

const waveformProgressTimeout = 500;

const renderPlaylistTracksDefault = 10;
const renderPlaylistTracksIncrement = 25;

export interface ISoundcloudPlayerConfig {
  user: { kosmosmusic: number; kosmoslab: number };
  playlist: {
    mixes: number;
  };
}

export interface ISoundcloudPlayerChanges extends SimpleChanges {
  mode: SimpleChange;
  displayDescription: SimpleChange;
  useId: SimpleChange;
  playlistId: SimpleChange;
}

export type TSoundcloudPlayerMode =
  | 'kosmosmusic'
  | 'kosmoslab'
  | 'playlist'
  | 'user'
  | 'pl-mixes'
  | 'playlist';

/**
 * Soundcloud player component.
 */
@Component({
  selector: 'app-soundcloud-player',
  templateUrl: './soundcloud-player.html',
  styleUrls: ['./soundcloud-player.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSoundcloudPlayerComponent implements OnDestroy, OnChanges {
  @HostBinding('class.mat-body-1') public matBody1 = true;

  /**
   * Predefined ids.
   */
  private readonly defaultConfig: ISoundcloudPlayerConfig = {
    user: {
      kosmosmusic: 403059,
      kosmoslab: 217740895,
    },
    playlist: {
      mixes: 24529973,
    },
  };

  /**
   * Soundcloud player mode.
   */
  @Input() public mode: TSoundcloudPlayerMode = 'kosmosmusic';

  /**
   * Indicates if description should be shown.
   */
  @Input() public displayDescription = false;

  /**
   * Soundcloud user id.
   */
  @Input() private userId: number = this.defaultConfig.user.kosmoslab;

  /**
   * Soundcloud playlist id.
   */
  @Input() private playlistId: number = this.defaultConfig.playlist.mixes;

  private readonly loading$ = this.store.select(AppHttpProgressState.mainViewProgress);

  constructor(
    private readonly store: Store,
    private readonly soundcloud: AppSoundcloudService,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  private readonly renderPlaylistTracks = new BehaviorSubject<number>(renderPlaylistTracksDefault);

  public readonly renderPlaylistTracks$ = this.renderPlaylistTracks.asObservable();

  /**
   * Soundcloud user tracks.
   */
  public tracks$ = this.store
    .select(AppSoundcloudState.getTracks)
    .pipe(map(tracks => tracks.collection));

  /**
   * Soundcloud playlist.
   */
  public playlist$ = this.store
    .select(AppSoundcloudState.allPlaylists)
    .pipe(map(playlists => playlists.find(item => item.id === this.playlistId)));

  public readonly playlistTracks$ = combineLatest([
    this.playlist$,
    this.renderPlaylistTracks$,
  ]).pipe(
    map(([playlist, renderPlaylistTracks]) => {
      const tracks = Boolean(playlist)
        ? [...(playlist?.tracks ?? [])].slice(0, renderPlaylistTracks)
        : [];
      return tracks;
    }),
  );

  private readonly playerMode = new BehaviorSubject<TSoundcloudPlayerMode>(this.mode);

  public readonly playerMode$ = this.playerMode.asObservable();

  public readonly renderTracks$ = this.playerMode$.pipe(
    concatMap(mode => {
      return mode === 'kosmosmusic' || mode === 'user' ? this.tracks$ : this.playlistTracks$;
    }),
  );

  private readonly selectedTrack = new BehaviorSubject<ISoundcloudTrack>({ ...trackDefaultValues });

  public readonly selectedTrack$ = this.selectedTrack.asObservable();

  /**
   * Indicated that there's not more tracks left in the list.
   */
  private readonly noMoreTracks = new BehaviorSubject<boolean>(false);

  /**
   * Current Soundcloud player object.
   */
  public player?: ISoundcloudPlayer;

  /**
   * Waveform progress timer.
   */
  private readonly waveformProgressTimer$ = timer(waveformProgressTimeout, waveformProgressTimeout);

  /**
   * Gets link with id from Soundcloud Service (public for template usage).
   */
  public getLinkWithId(href: string = ''): string {
    return this.soundcloud.getLinkWithId(href);
  }

  /**
   * Loads more soundcloud tracks.
   */
  private loadMoreTracks() {
    void this.loading$
      .pipe(
        first(),
        concatMap(loading => {
          if (!this.noMoreTracks.value) {
            if (/(komosmusic|kosmoslab|user)/.test(this.mode)) {
              return this.soundcloud.getTracks(this.userId).pipe(
                tap(data => {
                  if (!Boolean(data.next_href)) {
                    this.noMoreTracks.next(true);
                  }
                }),
              );
            } else if (/(pl-mixes|playlist)/.test(this.mode)) {
              return this.soundcloud.getPlaylist(this.playlistId).pipe(
                tap(() => {
                  this.noMoreTracks.next(true);
                }),
              );
            }
          } else if (/(pl-|playlist)/.test(this.mode)) {
            this.renderMorePlaylistTracks();
            return of();
          }
          return of();
        }),
      )
      .subscribe();
  }

  /**
   * Renders more playlist tracks.
   */
  private renderMorePlaylistTracks(): void {
    const nextValue = this.renderPlaylistTracks.value + renderPlaylistTracksIncrement;
    this.renderPlaylistTracks.next(nextValue);
  }

  /**
   * Kills player.
   */
  private playerKill(): void {
    if (typeof this.player !== 'undefined') {
      this.player.kill();
    }
  }

  /**
   * Triggers player playback/pause.
   * @param track Track object
   */
  public playTrack(track: ISoundcloudTrack): void {
    if (typeof this.player !== 'undefined') {
      if (this.selectedTrack.value.id !== track.id) {
        this.playerKill();
        this.selectedTrack.next(track);

        void this.soundcloud
          .streamTrack(track.id ?? 0)
          .pipe(
            concatMap((player: ISoundcloudPlayer) => {
              this.player = player;
              const promise = this.player.play();
              return from(promise).pipe(mapTo(player));
            }),
            tap(() => {
              /**
               * @note TODO: refactor, remove nested subscription, remove rule override for this file in .eslintrc.js
               */
              void this.reportWaveformProgress().subscribe();
            }),
          )
          .subscribe();
      } else if (Boolean(this.player.isActuallyPlaying())) {
        void this.player.pause();
      } else {
        const promise = this.player.play();
        void from(promise)
          .pipe(concatMap(() => this.reportWaveformProgress()))
          .subscribe();
      }
    }
  }

  /**
   * Renders waveform progress in UI.
   */
  public reportWaveformProgress() {
    return this.waveformProgressTimer$.pipe(
      tap(() => {
        const id = this.selectedTrack.value.id;
        const visibleWaveform: ElementRef = new ElementRef(
          this.window.document.getElementsByClassName(`waveform-${id}`)[0],
        );
        const visibleWaveformElement: HTMLElement = visibleWaveform.nativeElement;
        if (Boolean(visibleWaveformElement) && typeof this.player !== 'undefined') {
          const dividend = 100;
          const playbackProgress: number = Math.floor(
            (this.player.currentTime() * dividend) / this.player.getDuration(),
          );
          const nextVal = playbackProgress + 1;
          visibleWaveformElement.style.background = `linear-gradient(to right, rgba(171,71,188,1) 0%,rgba(171,71,188,1) ${playbackProgress}%, rgba(30,87,153,0) ${nextVal}%, rgba(30,87,153,0) 100%)`;
        }
      }),
      takeWhile(
        () =>
          typeof this.player !== 'undefined' &&
          this.player.isActuallyPlaying() &&
          !this.player.isDead() &&
          !this.player.isEnded(),
      ),
    );
  }

  /**
   * Waveform client event handler.
   * @param event waveform click event
   * @param id soundcloud track id
   */
  public waveformClick(event: IEventWithPosition, id: number = 0): void {
    if (this.selectedTrack.value.id === id && typeof this.player !== 'undefined') {
      const srcElement = event.srcElement as IEventTargetWithPosition;
      const waveformWidth: number = srcElement?.clientWidth;
      const offsetX: number = event.offsetX;
      const dividend = 100;
      const percent: number = (offsetX * dividend) / waveformWidth;
      const newProgress: number = (this.player.getDuration() * percent) / dividend;
      void this.player.seek(newProgress);
    }
  }

  /**
   * Resets player.
   * Is used when mode Input chanes.
   * Kills player, resets soundcloud service data, local data, local flags.
   * @param onlyProgress if only progress interval should be reset
   */
  private resetPlayer(onlyProgress?: boolean): void {
    if (!Boolean(onlyProgress)) {
      this.playerKill();
      this.soundcloud.resetData();
      this.noMoreTracks.next(false);
      this.renderPlaylistTracks.next(renderPlaylistTracksDefault);
    }
  }

  /**
   * Should be used in ngOnChanges handler.
   * @param changes input changes
   */
  private modeChangeHandler(changes: ISoundcloudPlayerChanges): void {
    if (changes.mode.currentValue === 'kosmosmusic') {
      this.resetPlayer();
      this.userId = this.defaultConfig.user.kosmosmusic;
      this.loadMoreTracks();
    } else if (changes.mode.currentValue === 'kosmoslab') {
      this.resetPlayer();
      this.userId = this.defaultConfig.user.kosmoslab;
      this.loadMoreTracks();
    } else if (Boolean((changes.mode.currentValue as string).includes('pl-'))) {
      this.resetPlayer();
      const prefixLength = 3;
      const playlistKey = (changes.mode.currentValue as TSoundcloudPlayerMode).slice(prefixLength);
      this.playlistId = this.defaultConfig.playlist[playlistKey];
      this.loadMoreTracks();
    }
  }

  /**
   * Should be used in ngOnChanges handler.
   * @param changes input changes
   */
  private userIdChangeHandler(changes: ISoundcloudPlayerChanges): void {
    if (this.mode === 'user' && Boolean(changes.userId.currentValue)) {
      this.resetPlayer();
      this.userId = changes.userId.currentValue;
      this.loadMoreTracks();
    }
  }

  /**
   * Should be used in ngOnChanges handler.
   * @param changes input changes
   */
  private playlistIdChangeHandler(changes: ISoundcloudPlayerChanges): void {
    if (this.mode === 'playlist' && Boolean(changes.playlistId.currentValue)) {
      this.resetPlayer();
      this.playlistId = changes.playlistId.currentValue;
      this.loadMoreTracks();
    }
  }

  public ngOnChanges(changes: ISoundcloudPlayerChanges): void {
    if (Boolean(changes.mode)) {
      this.playerMode.next(changes.mode.currentValue);
    }
    if (Boolean(changes.mode) && !Boolean(changes.playlistId) && !Boolean(changes.userId)) {
      this.modeChangeHandler(changes);
    } else if (Boolean(changes.userId)) {
      this.userIdChangeHandler(changes);
    } else if (Boolean(changes.playlistId)) {
      this.playlistIdChangeHandler(changes);
    }
  }

  public ngOnDestroy(): void {
    this.resetPlayer();
  }

  /**
   * Host element scroll listener.
   * @param event scroll event
   */
  @HostListener('scroll', ['$event'])
  public scrollHandler(event: Event): void {
    const target = event.target as IEventTargetWithPosition;
    const scrollFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    const loadMoreOffset = 20;
    if (scrollFromBottom < loadMoreOffset) {
      this.loadMoreTracks();
    }
  }
}
