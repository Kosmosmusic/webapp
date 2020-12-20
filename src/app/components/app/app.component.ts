import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { AppTranslateService } from '../../modules/translate/translate.service';
import { SUPPORTED_LANGUAGE_KEY } from '../../modules/translate/translations.interface';
import { AppSpinnerService } from '../../services/spinner/spinner.service';
import { AppBookingDialog } from '../booking-dialog/app-booking-dialog.component';
import { AppContactDialog } from '../contact-dialog/app-contact-dialog.component';
import { AppDemoDialog } from '../demo-dialog/app-demo-dialog.component';
import { AppMasteringDialog } from '../mastering-dialog/app-mastering-dialog.component';

/**
 * Application root component.
 */
@UntilDestroy()
@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly dateAdapter: DateAdapter<Date>,
    private readonly dialog: MatDialog,
    private readonly domSanitizer: DomSanitizer,
    private readonly translate: AppTranslateService,
    private readonly media: MediaObserver,
    private readonly spinner: AppSpinnerService,
    @Inject('Window') private readonly window: Window,
  ) {}

  /**
   * Show spinner observable.
   */
  public showSpinner$: Observable<boolean> = this.spinner.showSpinner$.pipe(untilDestroyed(this));

  public sidenavOpened = false;

  /**
   * Sidenav grid configuration object.
   */
  public gridConfig: { cols: string; rowHeight: string } = {
    cols: '3',
    rowHeight: '1:1',
  };

  /**
   * Reusable modal dialog instance.
   */
  private dialogInstance?: MatDialogRef<
    AppDemoDialog | AppMasteringDialog | AppContactDialog | AppBookingDialog
  >;

  /**
   * Checks if selected one is a current language.
   */
  private isCurrentLanguage(key: string): boolean {
    return key === this.translate.currentLanguage;
  }

  /**
   * Selects language.
   */
  private selectLanguage(key: SUPPORTED_LANGUAGE_KEY): void {
    if (!this.isCurrentLanguage(key)) {
      this.translate.use(key); // set current language
      this.setDatepickersLocale(key); // set datepickers locale
    }
  }

  /**
   * Sets datepickers locale.
   * Supported languages: en, ru.
   */
  private setDatepickersLocale(key: SUPPORTED_LANGUAGE_KEY): void {
    if (key === SUPPORTED_LANGUAGE_KEY.RUSSIAN) {
      this.dateAdapter.setLocale(SUPPORTED_LANGUAGE_KEY.RUSSIAN);
    } else {
      this.dateAdapter.setLocale(SUPPORTED_LANGUAGE_KEY.ENGLISH);
    }
  }

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
      data: {},
    });
    void this.dialogInstance
      .afterClosed()
      .pipe(
        take(1),
        tap(() => {
          this.dialogInstance = void 0;
        }),
      )
      .subscribe();
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
      data: {},
    });
    void this.dialogInstance
      .afterClosed()
      .pipe(
        take(1),
        tap(() => {
          this.dialogInstance = void 0;
        }),
      )
      .subscribe();
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
      data: {},
    });
    void this.dialogInstance
      .afterClosed()
      .pipe(
        take(1),
        tap(() => {
          this.dialogInstance = void 0;
        }),
      )
      .subscribe();
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
      data: {},
    });
    void this.dialogInstance
      .afterClosed()
      .pipe(
        take(1),
        tap(() => {
          this.dialogInstance = void 0;
        }),
      )
      .subscribe();
  }

  /**
   * Removes UI initialization object, kind of splashscreen.
   */
  private removeUIinit(): void {
    const initUIobj = this.window.document.getElementById('init');
    if (initUIobj !== null) {
      initUIobj.parentNode?.removeChild(initUIobj);
    }
  }

  /**
   * Sets sidenav config object values.
   */
  private setGridConfig(cols: string, rowHeight?: string): void {
    this.gridConfig.cols = cols;
    this.gridConfig.rowHeight =
      typeof rowHeight !== 'undefined' ? rowHeight : this.gridConfig.rowHeight;
  }

  public ngOnInit(): void {
    this.removeUIinit();

    /*
     * check preferred language, respect preference if dictionary exists
     *	for now there are only dictionaries only: English, Russian
     *	set Russian if it is preferred, else use English
     */
    const nav: Navigator = this.window.navigator;
    const userPreference: string =
      nav.language === 'ru-RU' || nav.language === 'ru' || nav.languages[0] === 'ru' ? 'ru' : 'en';
    this.selectLanguage(userPreference as SUPPORTED_LANGUAGE_KEY); // set default language

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
    this.matIconRegistry.addSvgIcon(
      'logo-round',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/kosmos_circle.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'logo-square',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/img/kosmos_square.svg'),
    );

    // subscribe to media chage events
    void this.media
      .asObservable()
      .pipe(
        untilDestroyed(this),
        tap((event: MediaChange[]) => {
          const mediaEvent = event[0];
          // console.log('flex-layout media change event', event);
          if (/(lg|xl)/.test(mediaEvent.mqAlias)) {
            this.setGridConfig('4', '2:1');
          } else if (/(md)/.test(mediaEvent.mqAlias)) {
            this.setGridConfig('3', '1:1');
          } else if (/(sm)/.test(mediaEvent.mqAlias)) {
            this.setGridConfig('2', '2:1');
          } else {
            this.setGridConfig('1', '2.5:1');
          }
        }),
      )
      .subscribe();
  }
}
