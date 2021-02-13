import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, timeout } from 'rxjs/operators';
import { AppHttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';

import { WINDOW } from '../../utils/injection-tokens';

@Injectable({
  providedIn: 'root',
})
export class AppSendMasteringOrderService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: AppHttpHandlersService,
    @Inject(WINDOW) private readonly window: Window,
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
      .pipe(timeout(this.handlers.defaultHttpTimeout), catchError(this.handlers.handleError));
  }
}
