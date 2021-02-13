import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, take, timeout } from 'rxjs/operators';
import { AppHttpHandlersService } from 'src/app/services/http-handlers/custom-http-handlers.service';

@Injectable({
  providedIn: 'root',
})
export class AppEmailSubscriptionService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: AppHttpHandlersService,
    @Inject('Window') private readonly window: Window,
  ) {}

  /**
   * Mailing list subscription endpoint.
   */
  private readonly endpoint: string = this.window.location.origin + '/saveEmailSubscription';

  /**
   * Sends mailing list subscription request.
   */
  public subscribe(formData: { email: string; domain: string }) {
    return this.http
      .post(this.endpoint, formData)
      .pipe(
        timeout(this.handlers.defaultHttpTimeout),
        take(1),
        catchError(this.handlers.handleError),
      );
  }
}
