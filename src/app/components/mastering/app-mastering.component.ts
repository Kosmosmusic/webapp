import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';

import { AppSpinnerService } from 'src/app/services';

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
   */
  constructor(
    private spinner: AppSpinnerService
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

  public details: any = {};

  public ngOnInit(): void {
    console.log('ngOnInit: AppMasteringComponent initialized');
    this.spinner.startSpinner();
  }

  public ngOnDestroy(): void {
    console.log('ngOnDestroy: AppMasteringComponent destroyed');
  }
}
