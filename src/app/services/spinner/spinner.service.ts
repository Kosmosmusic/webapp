import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Spinner service.
 */
@Injectable()
export class AppSpinnerService {

  /**
   * Indicates if progress spinner should be shown.
   */
  private showSpinner: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Show spinner observable.
   */
  public showSpinner$: Observable<boolean> = this.showSpinner.asObservable();

  /**
   * Starts spinner.
   */
  public startSpinner(): void {
    this.showSpinner.next(true);
  }

  /**
   * Stops spinner.
   */
  public stopSpinner(): void {
    this.showSpinner.next(false);
  }

}
