import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EventEmitterService } from 'src/app/services/event-emitter/event-emitter.service';
import { CustomDeferredService } from 'src/app/services/deferred/custom-deferred.service';
import { SendMasteringOrderService } from 'src/app/services/send-mastering-order/send-mastering-order.service';

import { TranslateService } from 'src/app/modules/translate/translate.service';
import { IMasteringOrderForm } from 'src/app/interfaces/forms/mastering-order-form.interface';

/**
 * Mastering dialog.
 */
@Component({
  selector: 'app-mastering-dialog',
  templateUrl: './app-mastering-dialog.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppMasteringDialog implements OnInit, OnDestroy {

  /**
   * @param data Dialog data provided by parent controller
   * @param dialogRef Dialog reference
   * @param fb Form builder - user input procession
   * @param emitter Event emitter service - components interaction
   * @param translateService Translate service - UI translation to predefined languages
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AppMasteringDialog>,
    private fb: FormBuilder,
    private emitter: EventEmitterService,
    private translateService: TranslateService,
    private sendMasteringOrderService: SendMasteringOrderService,
    @Inject('Window') private window: Window
  ) {
    console.log('AppMasteringDialog constructor', this.data);
  }

  private subscriptions: any[] = [];

  /**
   * Email form.
   */
  public orderForm: IMasteringOrderForm;

  /**
   * Resets email form group.
   */
  private resetForm(): void {
    this.orderForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      link: ['', Validators.compose([Validators.required, Validators.pattern(/http(s)?:\/\/\w+/)])],
      domain: [this.window.location.origin, Validators.compose([Validators.required, Validators.pattern(/.+/)])]
    }) as IMasteringOrderForm;
  }

  /**
   * Submits form.
   */
  public submitForm(): void {
    if (this.orderForm.valid && !this.orderForm.pristine) {
      this.sendOrder()
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
   * Dialog loading state.
   */
  private loading: boolean = false;
  /**
   * Use in templates to get loaded state.
   */
  public loaded(): boolean {
    return !this.loading;
  }

  /**
   * Starts progress.
   */
  private startProgress(): void {
    this.loading = true;
  }
  /**
   * Stops progress.
   */
  private stopProgress(): void {
    this.loading = false;
  }

  /**
   * Sends demo.
   */
  public sendOrder(): Promise<boolean> {
    const def = new CustomDeferredService<boolean>();
    this.emitter.emitProgressStartEvent();
    const formData: any = this.orderForm.value;
    this.sendMasteringOrderService.sendOrder(formData).subscribe(
      (data: any) => {
        console.log('sendOrder, data:', data);
        this.emitter.emitProgressStopEvent();
        def.resolve(true);
        this.feedback = this.translateService.instant('demo.result.success');
        setTimeout(() => {
          this.closeDialog();
        }, 1500);
      },
      (error: any) => {
        console.log('sendOrder, error', error);
        this.feedback = this.translateService.instant('demo.result.fail');
        this.emitter.emitProgressStopEvent();
        def.reject(false);
      },
      () => {
        console.log('sendOrder: done');
      }
    );
    return def.promise;
  }

  /**
   * Closes dialog.
   * @param [result] result returned to parent component
   */
  public closeDialog(result?: any) {
    /*
    *	report result if it was commonly closed, or modified and closed, deleted,
    *	or optional use result is provided
    *	parent controller should listen to this event
    */
    result = (result) ? result : 'closed';
    this.dialogRef.close(result);
  }

  /**
   * Lifecycle hook called after component is initialized.
   */
  public ngOnInit(): void {
    console.log('ngOnInit: AppMasteringDialog initialized');
    this.resetForm();

    const sub: any = this.emitter.getEmitter().subscribe((event: any) => {
      console.log('AppMasteringDialog consuming event:', event);
      if (event.progress) {
        if (event.progress === 'start') {
          console.log('AppMasteringDialog, starting progress');
          this.startProgress();
        } else if (event.progress === 'stop') {
          console.log('AppMasteringDialog, stopping progress');
          this.stopProgress();
        }
      }
    });
    this.subscriptions.push(sub);
  }
  /**
   * Lifecycle hook called after component is destroyed.
   */
  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppMasteringDialog destroyed');
    if (this.subscriptions.length) {
      for (const sub of this.subscriptions) {
        sub.unsubscribe();
      }
    }
  }
}
