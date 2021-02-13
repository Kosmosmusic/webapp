import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { AppGoogleApiService } from '../../services/google-api/google-api.service';
import { httpProgressActions } from '../../state/http-progress/http-progress.store';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppVideosComponent implements OnInit {
  @HostBinding('class.mat-body-1') public readonly matBody1 = true;

  @HostBinding('fxLayout') public fxLayout = 'row';

  @HostBinding('fxLayoutAlign') public fxLayoutAlign = 'start stretch';

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly store: Store,
    private readonly googleAPI: AppGoogleApiService,
    @Inject('Window') private readonly window: Window,
  ) {}

  /**
   * Channel data.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- add youtube channel data interface
  public channelData?: Record<string, any>;

  /**
   * Channel uploads.
   */
  private uploads = '';

  /**
   * Playlist source url.
   */
  public playlistSrc?: SafeUrl;

  /**
   * Gets channel data.
   */
  private getChannelData() {
    void this.store.dispatch(new httpProgressActions.startProgress({ mainView: true }));
    return this.googleAPI.getChannelData().pipe(
      tap(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- add youtube channel data interface
        (data: Record<string, any>) => {
          this.channelData = data;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- add youtube channel data interface
          this.uploads = data.items[0].contentDetails.relatedPlaylists.uploads;
          this.playlistSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://www.youtube.com/embed/?listType=playlist&list=' +
              this.uploads +
              '&enablejsapi=1&origin=' +
              this.window.location.origin,
          );
          /**
           * Don't stop spinner at this point, it will be stopped when iframe loads.
           * this.spinner.stopSpinner();
           */
        },
        (error: string) => {
          void this.store.dispatch(new httpProgressActions.stopProgress({ mainView: false }));
        },
      ),
    );
  }

  /**
   * Youtube iframe widget loaded callback.
   * Stops spinner.
   * @param event iframe widget loaded callback event - iframe ElementRef
   */
  public widgetLoaded(event: ElementRef): void {
    void this.store.dispatch(new httpProgressActions.stopProgress({ mainView: false }));
  }

  public ngOnInit(): void {
    void this.getChannelData().subscribe();
  }
}
