import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, map, take, timeout } from 'rxjs/operators';
import { CustomHttpHandlersService } from 'src/app/services/http-handlers/custom-http-handlers.service';

@Injectable({
  providedIn: 'root',
})
export class AppSendMasteringOrderService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: CustomHttpHandlersService,
    @Inject('Window') private readonly window: Window,
  ) {}

  /**
   * Send mastering order endpoint.
   */
  private readonly endpoint: string = this.window.location.origin + '/sendMasteringOrder';

  /**
   * Sends mastering order.
   */
  public sendOrder(formData: { email: string; link: string; domain: string }) {
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
