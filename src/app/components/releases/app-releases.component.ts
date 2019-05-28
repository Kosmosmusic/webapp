import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Inject,
  ViewChild,
  Renderer2
} from '@angular/core';

import { MediaChange, ObservableMedia } from '@angular/flex-layout';

import {
  EventEmitterService,
  SoundcloudService
} from 'src/app/services/index';

import { untilDestroyed } from 'ngx-take-until-destroy';

/**
 * Application releases component.
 */
@Component({
  selector: 'app-releases',
  templateUrl: './app-releases.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppReleasesComponent implements OnInit, OnDestroy {

  /**
   * @param media Observable media
   * @param emitter Event emitter service - components interaction
   * @param renderer Application renderer
   * @param soundcloudService Soundcloud API wrapper
   * @param window Window reference
   */
  constructor(
    private media: ObservableMedia,
    private emitter: EventEmitterService,
    private renderer: Renderer2,
    private soundcloudService: SoundcloudService,
    @Inject('Window') private window: Window
  ) {
    // console.log('this.el.nativeElement:', this.el.nativeElement);
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

      // check if should request more data from soundcloud
      const listEndDivider: ElementRef = new ElementRef(this.window.document.getElementById('list-end'));
      // console.log('listEndDivider', listEndDivider);
      const offsetTop: string = 'offsetTop';
      const listEndOffsetTop: number = listEndDivider.nativeElement[offsetTop];
      // console.log('listEndOffsetTop', listEndOffsetTop, 'currentScrollTopValue', currentScrollTopValue);
      if (this.previousScrollTopValue < currentScrollTopValue && currentScrollTopValue >= listEndOffsetTop - (this.window.innerHeight + 1)) {
        console.log('end reached, load more');
        this.emitter.emitEvent({ soundcloud: 'loadMoreTracks' });
        const sidenavContent: ElementRef = new ElementRef(this.window.document.getElementsByClassName('mat-sidenav-content')[0]);
        const scrollTop: string = 'scrollTop';
        // set scrollTop for sidenav content so that it remains the same after tracks loading
        sidenavContent.nativeElement[scrollTop] = currentScrollTopValue;
      }

      this.previousScrollTopValue = currentScrollTopValue;
    });
  }

  /**
   * Lifecycle hook called after component is initialized.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppReleasesComponent initialized');

    this.bindToContentScrollEvent();

    this.emitter.getEmitter().pipe(untilDestroyed(this)).subscribe((event: any) => {
      console.log('AppReleasesComponent consuming event:', event);
    });

    let previousMqAlias: string = '';
    this.media.asObservable().pipe(untilDestroyed(this)).subscribe((event: MediaChange) => {
      console.log('flex-layout media change event', event);

      previousMqAlias = event.mqAlias;
    });
  }

  /**
   * Lifecycle hook called after component is destroyed.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppReleasesComponent destroyed');
    this.soundcloudService.resetServiceData();
  }

}
