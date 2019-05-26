import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatIconRegistry, DateAdapter, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { MediaChange, ObservableMedia } from '@angular/flex-layout';

import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { TranslateService } from 'src/app/modules/translate/index';
import { CustomServiceWorkerService } from 'src/app/services/service-worker/custom-service-worker.service';
import { FacebookService } from 'src/app/services/facebook/facebook.service';

import { AppDemoDialog } from 'src/app/components/demo-dialog/app-demo-dialog.component';
import { AppContactDialog } from 'src/app/components/contact-dialog/app-contact-dialog.component';
import { AppBookingDialog } from 'src/app/components/booking-dialog/app-booking-dialog.component';
import { AppMasteringDialog } from 'src/app/components/mastering-dialog/app-mastering-dialog.component';

import { Observable } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AppSpinnerService } from 'src/app/services';

/**
 * Application root component.
 */
@Component({
  selector: 'app',
  templateUrl: './app.html',
  styleUrls: [
    'app.scss'
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  /**
   * @param matIconRegistry Material icons registry
   * @param dateAdapter Material moment date adapter
   * @param dialog Reusable dialog
   * @param domSanitizer DOM sanitizer
   * @param emitter Event emitter service - components interaction
   * @param translateService Translate service - UI translation to predefined languages
   * @param facebookService Facebook service - Facebook JavaScrip SDK wrapper
   * @param serviceWorker Service worker service
   * @param media Observable media
   * @param spinner Application spinner service
   * @param window Browser window reference
   */
  constructor(
    private matIconRegistry: MatIconRegistry,
    private dateAdapter: DateAdapter<any>,
    private dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private emitter: EventEmitterService,
    private translate: TranslateService,
    private facebookService: FacebookService,
    private serviceWorker: CustomServiceWorkerService,
    private media: ObservableMedia,
    private spinner: AppSpinnerService,
    @Inject('Window') private window: Window
  ) {
    this.toggleConsoleOutput();
  }

  private subscriptions: any[] = [];

  /**
   * TODO action
   */
  public activateSomething(): void {
    console.log('TODO activate something');
  }

  /**
   * Show spinner observable.
   */
  public showSpinner$: Observable<boolean> = this.spinner.showSpinner$.pipe(untilDestroyed(this));

  public sidenavOpened: boolean = false;

  private supportedLanguages: any[] = [
    { key: 'en', name: 'English' },
    { key: 'ru', name: 'Russian' }
  ];
  /**
   * Checks if selected one is a current language.
   */
  private isCurrentLanguage(key: string): boolean {
    return key === this.translate.currentLanguage;
  }
  /**
   * Selects language.
   */
  private selectLanguage(key: string): void {
    if (!this.isCurrentLanguage(key)) {
      this.translate.use(key); // set current language
      this.setDatepickersLocale(key); // set datepickers locale
    }
  }
  /**
   * Sets datepickers locale.
   * Supported languages: en, ru.
   */
  private setDatepickersLocale(key: string): void {
    console.log('language change, key', key, 'this.dateAdapter', this.dateAdapter);
    if (key === 'ru') {
      this.dateAdapter.setLocale('ru');
    } else {
      this.dateAdapter.setLocale('en');
    }
  }

  /**
   * Reusable modal dialog instance.
   */
  private dialogInstance: any;

  /**
   * Shows demo dialog.
   */
  public showDemoDialog(): void {
    this.dialogInstance = this.dialog.open(AppDemoDialog, {
      height: '85vh',
      width: '95vw',
      maxWidth: '1680',
      maxHeight: '1024',
      autoFocus: true,
      disableClose: false,
      data: {}
    });
    this.dialogInstance.afterClosed().subscribe((result: any) => {
      console.log('demo dialog closed with result', result);
      this.dialogInstance = undefined;
    });
  }

  /**
   * Shows mastering dialog.
   */
  public showMasteringDialog(): void {
    this.dialogInstance = this.dialog.open(AppMasteringDialog, {
      height: '85vh',
      width: '95vw',
      maxWidth: '1680',
      maxHeight: '1024',
      autoFocus: true,
      disableClose: false,
      data: {}
    });
    this.dialogInstance.afterClosed().subscribe((result: any) => {
      console.log('mastering dialog closed with result', result);
      this.dialogInstance = undefined;
    });
  }

  /**
   * Shows contact dialog.
   */
  public showContactDialog(): void {
    this.dialogInstance = this.dialog.open(AppContactDialog, {
      height: '85vh',
      width: '95vw',
      maxWidth: '1680',
      maxHeight: '1024',
      autoFocus: true,
      disableClose: false,
      data: {}
    });
    this.dialogInstance.afterClosed().subscribe((result: any) => {
      console.log('contact dialog closed with result', result);
      this.dialogInstance = undefined;
    });
  }

  /**
   * Shows booking dialog.
   */
  public showBookingDialog(): void {
    this.dialogInstance = this.dialog.open(AppBookingDialog, {
      height: '85vh',
      width: '95vw',
      maxWidth: '1680',
      maxHeight: '1024',
      autoFocus: true,
      disableClose: false,
      data: {}
    });
    this.dialogInstance.afterClosed().subscribe((result: any) => {
      console.log('booking dialog closed with result', result);
      this.dialogInstance = undefined;
    });
  }

  /**
   * Holds a backup of console.log function.
   */
  private consoleLoggerBackup: any = console.log;
  /**
   * Disables/Enables logging to user's browser console.
   * Logging is automatically disabled when the app is deployed in a domain which name includes a substring 'kosmosmusic'.
   */
  private toggleConsoleOutput(): void {
    if (new RegExp(/.*kosmosmusic.*/, 'i').test(this.window.location.origin)) {
      console.log = (console.log === this.consoleLoggerBackup) ? () => true : this.consoleLoggerBackup;
    }
  }

  /**
   * Removes UI initialization object, kind of splashscreen.
   */
  private removeUIinit(): void {
    const initUIobj: HTMLElement = this.window.document.getElementById('init');
    console.log('initUIobj', initUIobj);
    initUIobj.parentNode.removeChild(initUIobj);
  }

  /**
   * Sidenav grid configuration object.
   */
  public gridConfig: any = {
    cols: '3',
    rowHeight: '1:1'
  };
  /**
   * Sets sidenav config object values.
   */
  private setGridConfig(cols: string, rowHeight?: string): void {
    this.gridConfig.cols = cols;
    this.gridConfig.rowHeight = (rowHeight) ? rowHeight : this.gridConfig.rowHeight;
  }

  public ngOnInit(): void {
    console.log('ngOnInit: AppComponent initialized');

    this.spinner.startSpinner();

    this.removeUIinit();

    let sub: any = this.emitter.getEmitter().subscribe((event: any) => {
      console.log('AppComponent, event:', event);
      if (event.spinner) {
        if (event.spinner === 'start') {
          console.log('AppComponent, starting spinner');
          this.spinner.startSpinner();
        } else if (event.spinner === 'stop') {
          console.log('AppComponent, stopping spinner');
          this.spinner.stopSpinner();
        }
      }
      if (event.lang) {
        console.log('AppComponent, switch language', event.lang);
        if (this.supportedLanguages.filter((item: any) => item.key === event.lang).length) {
          this.selectLanguage(event.lang); // switch language only if it is present in supportedLanguages array
        } else {
          console.log('AppComponent, selected language is not supported');
        }
      }
    });
    this.subscriptions.push(sub);

    sub = this.dateAdapter.localeChanges.subscribe(() => {
      console.log('dateAdapter.localeChanges, changed according to the language');
    });
    this.subscriptions.push(sub);

    /*
    * check preferred language, respect preference if dictionary exists
    *	for now there are only dictionaries only: English, Russian
    *	set Russian if it is preferred, else use English
    */
    const nav: any = this.window.navigator;
    const userPreference: string = (nav.language === 'ru-RU' || nav.language === 'ru' || nav.languages[0] === 'ru') ? 'ru' : 'en';
    this.selectLanguage(userPreference); // set default language

    /*
    *	register fontawesome for usage in mat-icon by adding directives
    *	fontSet="fab" fontIcon="fa-icon"
    *	fontSet="fas" fontIcon="fa-icon"
    *
    *	note: free plan includes only fab (font-awesome-brands) and fas (font-awesome-solid) groups
    *
    *	icons reference: https://fontawesome.com/icons/
    */
    this.matIconRegistry.registerFontClassAlias('fontawesome-all');

    /*
    * add svgs
    */
    this.matIconRegistry.addSvgIcon('logo-round', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/kosmos_circle.svg'));
    this.matIconRegistry.addSvgIcon('logo-square', this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/kosmos_square.svg'));

    // subscribe to media chage events
    sub = this.media.asObservable().subscribe((event: MediaChange) => {
      // console.log('flex-layout media change event', event);
      if (/(lg|xl)/.test(event.mqAlias)) {
        this.setGridConfig('4', '2:1');
      } else if (/(md)/.test(event.mqAlias)) {
        this.setGridConfig('3', '1:1');
      } else if (/(sm)/.test(event.mqAlias)) {
        this.setGridConfig('2', '2:1');
      } else {
        this.setGridConfig('1', '2.5:1');
      }
    });
    this.subscriptions.push(sub);
  }

  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppComponent destroyed');
    this.emitter.emitEvent({serviceWorker: 'deinitialize'});
    if (this.subscriptions.length) {
      for (const sub of this.subscriptions) {
        sub.unsubscribe();
      }
    }
  }

}
