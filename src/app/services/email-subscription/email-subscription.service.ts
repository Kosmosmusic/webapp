import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, map, take, timeout } from 'rxjs/operators';
import { CustomHttpHandlersService } from 'src/app/services/http-handlers/custom-http-handlers.service';

@Injectable({
  providedIn: 'root',
})
export class AppEmailSubscriptionService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: CustomHttpHandlersService,
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
        timeout(this.handlers.timeoutValue()),
        take(1),
        map(this.handlers.extractObject),
        catchError(this.handlers.handleError),
      );
  }
}
