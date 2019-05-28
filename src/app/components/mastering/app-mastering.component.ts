import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';

import { AppSpinnerService } from 'src/app/services';
import { MatDialog } from '@angular/material';
import { AppMasteringDialog } from '../mastering-dialog/app-mastering-dialog.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-mastering',
  templateUrl: './app-mastering.html',
  host: {
    class: 'mat-body-1'
  }
})
export class AppMasteringComponent implements OnInit, OnDestroy {

  /**
   * @param spinner Application spinner service
   * @param dialog Reusable dialog
   */
  constructor(
    private spinner: AppSpinnerService,
    private dialog: MatDialog
  ) {}

  @HostBinding('fxLayout') public fxLayout: string = 'row';
  @HostBinding('fxLayoutAlign') public fxLayoutAlign: string = 'start stretch';

  /**
   * Should be called once iframe content finished loading.
   */
  public contentLoaded(): void {
    console.log('content loaded');
    this.spinner.stopSpinner();
  }

  /**
   * Component details object.
   */
  public details: any = {};

  /**
   * Reusable modal dialog instance.
   */
  private dialogInstance: any;

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
    this.dialogInstance.afterClosed().pipe(take(1)).subscribe((result: any) => {
      console.log('mastering dialog closed with result', result);
      this.dialogInstance = undefined;
    });
  }

  public ngOnInit(): void {
    console.log('ngOnInit: AppMasteringComponent initialized');
    this.spinner.startSpinner();
  }

  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppMasteringComponent destroyed');
  }
}
