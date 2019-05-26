import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';

import {
  CustomDeferredService,
  SendBookingRequestService,
  AppSpinnerService
} from 'src/app/services/index';

import { TranslateService } from 'src/app/modules/translate/translate.service';
import { IBookingForm } from 'src/app/interfaces/forms/booking-form.interface';

/**
 * Booking dialog.
 */
@Component({
  selector: 'app-booking',
  templateUrl: './app-booking.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppBookingDialog implements OnInit, OnDestroy {

  /**
   * @param data Dialog data provided by parent controller
   * @param dialogRef Dialog reference
   * @param fb Form builder - user input procession
   * @param translateService Translate service - UI translation to predefined languages
   * @param sendBookingRequestService Send booking request service - sends a booking request to specified email address by calling cloud functions
   * @param window Window reference
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AppBookingDialog>,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private sendBookingRequestService: SendBookingRequestService,
    private spinner: AppSpinnerService,
    @Inject('Window') private window: Window
  ) {
    console.log('AppBookingDialog constructor', this.data);
  }

  /**
   * Email form.
   */
  public bookingForm: IBookingForm;

  /**
   * Resets email form group.
   */
  private resetEmailForm(): void {
    this.bookingForm = this.fb.group({
      // event details
      date: ['', Validators.compose([Validators.required])],
      venueName: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      venueCapacity: ['', Validators.compose([Validators.required, Validators.min(1)])],
      venueAddress: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      venueWebsite: ['', Validators.compose([Validators.required, Validators.pattern(/http(s)?:\/\/.+/)])],
      eventName: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      eventWebsite: ['', Validators.compose([Validators.required, Validators.pattern(/http(s)?:\/\/.+/)])],
      ticketCost: ['', Validators.compose([Validators.required, Validators.min(0)])],
      lineup: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      start: ['', Validators.compose([Validators.required, Validators.pattern(/[0-9-\:]+/)])],
      end: ['', Validators.compose([Validators.required, Validators.pattern(/[0-9-\:]+/)])],
      stageTime: ['', Validators.compose([Validators.required, Validators.pattern(/[0-9-,\:]+/)])],
      fee: ['', Validators.compose([Validators.required, Validators.min(1)])],
      artistsBookedEarlier: [''],

      // promoter details
      company: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      contact: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern(/\+\d\s[\d\s-]+/)])],
      website: ['', Validators.compose([Validators.required, Validators.pattern(/http(s)?:\/\/.+/)])],
      domain: [this.window.location.origin, Validators.compose([Validators.required])]
    }) as IBookingForm;
  }

  /**
   * Submits form.
   */
  public submitForm(): void {
    if (this.bookingForm.valid && !this.bookingForm.pristine) {
      this.sendBookingRequest()
        .catch((error: any) => {
          console.log('sendBookingRequest, error', error);
        });
    }
  }

  /**
   * UI feedback for user actions.
   */
  public feedback: string;

  /**
   * Sends email.
   */
  public sendBookingRequest(): Promise<boolean> {
    const def = new CustomDeferredService<boolean>();
    this.spinner.startSpinner();
    const formData: any = this.bookingForm.value;
    console.log('formData', formData);
    this.sendBookingRequestService.sendBookingRequest(formData).subscribe(
      (data: any) => {
        console.log('sendBookingRequest, data:', data);
        this.spinner.stopSpinner();

        def.resolve(true);
        this.feedback = this.translateService.instant('booking.result.success');
        setTimeout(() => {
          this.closeDialog();
        }, 1500);
      },
      (error: any) => {
        console.log('sendBookingRequest, error', error);
        this.feedback = this.translateService.instant('booking.result.fail');
        this.spinner.stopSpinner();
        def.reject(false);
      },
      () => {
        console.log('sendBookingRequest: done');
      }
    );
    return def.promise;
  }

  /**
   * Closes dialog.
   * @param [result] result returned to parent component
   * Reports result if it was commonly closed, or modified and closed, deleted, or optional use result is provided parent controller should listen to this event
   */
  public closeDialog(result?: any) {
    /*
    */
    result = (result) ? result : 'closed';
    this.dialogRef.close(result);
  }

  /**
   * Lifecycle hook called after component is initialized.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppBookingDialog initialized');
    this.resetEmailForm();
  }
  /**
   * Lifecycle hook called after component is destroyed.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppBookingDialog destroyed');
  }
}
