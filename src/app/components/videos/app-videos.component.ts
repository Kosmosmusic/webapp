import { Component, OnInit, OnDestroy, Inject, HostBinding, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { CustomDeferredService } from 'src/app/services/deferred/custom-deferred.service';
import { GoogleApiService } from 'src/app/services/google-api/google-api.service';
import { AppSpinnerService } from 'src/app/services';

@Component({
  selector: 'app-videos',
  templateUrl: './app-videos.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppVideosComponent implements OnInit, OnDestroy {

  constructor(
    private sanitizer: DomSanitizer,
    private spinner: AppSpinnerService,
    private googleAPI: GoogleApiService,
    @Inject('Window') private window: Window
  ) {}

  @HostBinding('fxLayout') public fxLayout: string = 'row';
  @HostBinding('fxLayoutAlign') public fxLayoutAlign: string = 'start stretch';

  /**
   * Channel data.
   */
  private channelData: any;
  /**
   * Channel uploads.
   */
  private uploads: any;
  /**
   * Playlist source url.
   */
  public playlistSrc: SafeUrl;

  /**
   * Gets channel data.
   */
  private getChannelData(): Promise<any> {
    const def = new CustomDeferredService<any>();
    this.spinner.startSpinner();
    this.googleAPI.getChannelData().subscribe(
      (data: any) => {
        this.channelData = data;
        this.uploads = data.items[0].contentDetails.relatedPlaylists.uploads;
        this.playlistSrc = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/?listType=playlist&list=' + this.uploads + '&enablejsapi=1&origin=' + this.window.location.origin);
        /**
         * Don't stop spinner at this point, it will be stopped when iframe loads.
         * this.spinner.stopSpinner();
         */
        def.resolve();
      },
      (error: string) => {
        console.log('getChannelData, error', error);
        this.spinner.stopSpinner();
        def.reject();
      }
    );
    return def.promise;
  }

  /**
   * Youtube iframe widget loaded callback.
   * Stops spinner.
   * @param event iframe widget loaded callback event - iframe ElementRef
   */
  public widgetLoaded(event: ElementRef): void {
    console.log('widgetLoaded', event);
    this.spinner.stopSpinner();
  }

  /**
   * Lifecycle hook called on component initialization.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppVideosComponent initialized');
    this.getChannelData();
  }
  /**
   * Lifecycle hook called on component destruction.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppVideosComponent destroyed');
  }

}
