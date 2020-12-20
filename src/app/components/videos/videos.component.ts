import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnInit,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';
import { AppSpinnerService } from 'src/app/services';
import { GoogleApiService } from 'src/app/services/google-api/google-api.service';

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
    private readonly spinner: AppSpinnerService,
    private readonly googleAPI: GoogleApiService,
    @Inject('Window') private readonly window: Window,
  ) {}

  /**
   * Channel data.
   */
  public channelData?: any;

  /**
   * Channel uploads.
   */
  private uploads: any;

  /**
   * Playlist source url.
   */
  public playlistSrc?: SafeUrl;

  /**
   * Gets channel data.
   */
  private getChannelData() {
    this.spinner.startSpinner();
    return this.googleAPI
      .getChannelData()
      .pipe(
        tap(
          (data: any) => {
            this.channelData = data;
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
            this.spinner.stopSpinner();
          },
        ),
      )
      .subscribe();
  }

  /**
   * Youtube iframe widget loaded callback.
   * Stops spinner.
   * @param event iframe widget loaded callback event - iframe ElementRef
   */
  public widgetLoaded(event: ElementRef): void {
    this.spinner.stopSpinner();
  }

  /**
   * Lifecycle hook called on component initialization.
   */
  public ngOnInit(): void {
    void this.getChannelData();
  }
}
