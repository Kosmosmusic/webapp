import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import {
  EventEmitterService,
  CustomDeferredService,
  FirebaseService,
  EmailSubscriptionService,
  AppSpinnerService
} from 'src/app/services/index';

import { AppContactDialog } from 'src/app/components/contact-dialog/app-contact-dialog.component';

import { TranslateService } from 'src/app/modules/translate/translate.service';
import { IEmailSubscriptionForm } from 'src/app/interfaces';

@Component({
  selector: 'app-about',
  templateUrl: './app-about.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppAboutComponent implements OnInit, OnDestroy {

  /**
   * @param dialog Reusable dialog
   * @param fb Form builder
   * @param emitter Event emitter service
   * @param translateService Translate service - UI translation to predefined languages
   * @param firebaseService Firebase interaction service
   * @param emailSubscriptionService Email subscription service - saves subscribers' email to database
   * @param spinner Application spinner service
   * @param window Window reference
   */
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private emitter: EventEmitterService,
    private translateService: TranslateService,
    private firebaseService: FirebaseService,
    private emailSubscriptionService: EmailSubscriptionService,
    private spinner: AppSpinnerService,
    @Inject('Window') private window: Window
  ) {}

  /**
   * Company details object.
   */
  public details: {
    links?: {
      soundcloud: string;
      rss: string;
      mixcloud: string;
      twitter: string;
      facebook: string;
      youtube: string;
      instagram: string;
      bandcamp: string;
      vkontakte: string;
      telegram: string;
    },
    soundcloudUserId?: number,
    text?: string,
    title?: string,
    widgetLink?: string
  } = {};

  /**
   * Gets company details from firebase.
   */
  private getDetails(): Promise<any> {
    const def = new CustomDeferredService<any>();
    this.spinner.startSpinner();
    this.firebaseService.getDB('about', false)
      .then((snapshot) => {
        console.log('getDetails, about', snapshot.val());
        const response = snapshot.val();
        this.details = {};
        const keys = Object.keys(response);
        keys.forEach((key) => {
          this.details[key] = response[key];
        });
        this.spinner.stopSpinner();
        def.resolve();
      })
      .catch((error) => {
        console.log('getDetails, error', error);
        this.spinner.stopSpinner();
        def.reject();
      });
    return def.promise;
  }

  /**
   * Reusable modal dialog instance.
   */
  private dialogInstance: any;

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
      console.log('contact doalog closed with result', result);
      this.dialogInstance = undefined;
    });
  }

  /**
   * Subscription form.
   */
  public subscriptionForm: IEmailSubscriptionForm;

  /**
   * Resets email signup form.
   */
  private resetEmailSignupForm(): void {
    this.subscriptionForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      domain: [this.window.location.origin, Validators.compose([Validators.required, Validators.pattern(/.+/)])],
      b_3eeba7cfe8388b91c662bdf95_8cca3229c8: ['']
    }) as IEmailSubscriptionForm;
  }

  /**
   * UI feedback for user actions.
   */
  public feedback: string;

  /**
   * Subscribes user to mailing list.
   */
  public subscribeToMailingList(): Promise<boolean> {
    const def = new CustomDeferredService<boolean>();
    this.spinner.startSpinner();
    const formData: any = this.subscriptionForm.value;
    this.emailSubscriptionService.subscribe(formData).subscribe(
      (data: any) => {
        console.log('subscribeToMailingList, data:', data);
        this.spinner.stopSpinner();
        this.feedback = this.translateService.instant('subscribe.result.success');
        def.resolve(true);
      },
      (error: any) => {
        console.log('subscribeToMailingList, error', error);
        this.spinner.stopSpinner();
        this.feedback = this.translateService.instant('subscribe.result.fail');
        setTimeout(() => {
          this.feedback = '';
        }, 3000);
        def.reject(false);
      },
      () => {
        console.log('subscribeToMailingList: done');
      }
    );
    return def.promise;
  }

  /**
   * Lifecycle hook called after component is initialized.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppAboutComponent initialized');
    this.getDetails();
    this.resetEmailSignupForm();
  }
  /**
   * Lifecycle hook called after component is destroyed.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppAboutComponent destroyed');
    this.firebaseService.getDB('about', true).off();
  }
}
