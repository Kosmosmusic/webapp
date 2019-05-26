import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';

import {
  CustomDeferredService,
  SendDemoService,
  AppSpinnerService
} from 'src/app/services/index';

import { TranslateService } from 'src/app/modules/translate/translate.service';
import { IMasteringOrderForm } from 'src/app/interfaces/forms/mastering-order-form.interface';

/**
 * Demo dialog.
 */
@Component({
  selector: 'app-demo',
  templateUrl: './app-demo.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppDemoDialog implements OnInit, OnDestroy {

  /**
   * @param data Dialog data provided by parent controller
   * @param dialogRef Dialog reference
   * @param fb Form builder - user input procession
   * @param translateService Translate service - UI translation to predefined languages
   * @param spinner Application spinner service
   * @param window Window reference
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AppDemoDialog>,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private sendDemoService: SendDemoService,
    private spinner: AppSpinnerService,
    @Inject('Window') private window: Window
  ) {
    console.log('AppDemoDialog constructor', this.data);
  }

  /**
   * Email form.
   */
  public demoForm: IMasteringOrderForm;

  /**
   * Resets email form group.
   */
  private resetForm(): void {
    this.demoForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      link: ['', Validators.compose([Validators.required, Validators.pattern(/http(s)?:\/\/\w+/)])],
      domain: [this.window.location.origin, Validators.compose([Validators.required, Validators.pattern(/.+/)])]
    }) as IMasteringOrderForm;
  }

  /**
   * Submits form.
   */
  public submitForm(): void {
    if (this.demoForm.valid && !this.demoForm.pristine) {
      this.sendDemo()
        .catch((error: any) => {
          console.log('sendDemo, error', error);
        });
    }
  }

  /**
   * UI feedback for user actions.
   */
  public feedback: string;

  /**
   * Sends demo.
   */
  public sendDemo(): Promise<boolean> {
    const def = new CustomDeferredService<boolean>();
    this.spinner.startSpinner();
    const formData: any = this.demoForm.value;
    this.sendDemoService.sendDemo(formData).subscribe(
      (data: any) => {
        console.log('sendDemo, data:', data);
        this.spinner.stopSpinner();
        def.resolve(true);
        this.feedback = this.translateService.instant('demo.result.success');
        setTimeout(() => {
          this.closeDialog();
        }, 1500);
      },
      (error: any) => {
        console.log('sendDemo, error', error);
        this.feedback = this.translateService.instant('demo.result.fail');
        this.spinner.stopSpinner();
        def.reject(false);
      },
      () => {
        console.log('sendDemo: done');
      }
    );
    return def.promise;
  }

  /**
   * Closes dialog.
   * @param [result] result returned to parent component
   * Reports result if it was commonly closed, or modified and closed, deleted,	or optional use result is provided parent controller should listen to this event.
   */
  public closeDialog(result?: any) {
    result = (result) ? result : 'closed';
    this.dialogRef.close(result);
  }

  /**
   * Lifecycle hook called after component is initialized.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppDemoDialog initialized');
    this.resetForm();
  }
  /**
   * Lifecycle hook called after component is destroyed.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppDemoDialog destroyed');
  }
}
