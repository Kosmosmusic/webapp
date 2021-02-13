import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { WINDOW } from '../../utils/injection-tokens';

@Component({
  selector: 'app-bassdrive-player',
  templateUrl: './bassdrive-player.component.html',
  styleUrls: ['./bassdrive-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBassdrivePlayerComponent {
  @HostBinding('class.mat-body-1') public readonly matBody1 = true;

  constructor(
    private readonly sanitizer: DomSanitizer,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  /**
   * Stream url.
   */
  // public streamUtl: SafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://bassdrive.radioca.st:80/;stream/1');
  public streamUtl: SafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    this.window.location.origin + '/bassdriveProxy',
  );

  /**
   * Player view child reference.
   */
  @ViewChild('player') private readonly player?: ElementRef;

  /**
   * Starts playback.
   */
  public play(): void {
    const nativeElement = this.player?.nativeElement as HTMLElement & {
      paused: boolean;
      play: () => unknown;
      pause: () => unknown;
    };
    if (typeof nativeElement !== 'undefined' && nativeElement.paused) {
      nativeElement.play();
    }
  }

  /**
   * Pauses playback.
   */
  public pause(): void {
    const nativeElement = this.player?.nativeElement as
      | (HTMLElement & {
          paused: boolean;
          play: () => unknown;
          pause: () => unknown;
        })
      | undefined;
    if (typeof nativeElement !== 'undefined' && !nativeElement.paused) {
      nativeElement.pause();
    }
  }

  /**
   * Indicates is player is paused.
   */
  public isPaused(): boolean {
    const nativeElement = this.player?.nativeElement as HTMLElement & {
      paused: boolean;
      play: () => unknown;
      pause: () => unknown;
    };
    return typeof nativeElement !== 'undefined' ? nativeElement.paused : true;
  }
}
