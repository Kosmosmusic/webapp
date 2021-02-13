import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppHttpHandlersService {
  public readonly defaultHttpTimeout = 10000;

  constructor(private readonly snackBar: MatSnackBar) {}

  private displayErrorToast(error: string): void {
    this.snackBar.open(error, void 0, {
      duration: 7000,
    });
  }

  public getErrorMessage(error: HttpErrorResponse & firebase.default.FirebaseError): string {
    const msg: string = Boolean(error.message)
      ? error.message
      : Boolean(error.code)
      ? error.code
      : error.error;
    const errorMessage: string = Boolean(msg)
      ? msg
      : Boolean(error.status)
      ? `${error.status} - ${error.statusText}`
      : 'Server error';
    return errorMessage;
  }

  /**
   * Handles error.
   * @param error error object
   */
  public handleError(error: HttpErrorResponse & firebase.default.FirebaseError): Observable<never> {
    const errorMessage = this.getErrorMessage(error);
    this.displayErrorToast(errorMessage);
    return throwError(errorMessage);
  }

  /**
   * Pipes request with object response.
   * @param observable request observable
   */
  public pipeHttpRequest<T>(observable: Observable<T>): Observable<T> {
    return observable.pipe(
      timeout(this.defaultHttpTimeout),
      catchError(error => this.handleError(error)),
    );
  }
}
