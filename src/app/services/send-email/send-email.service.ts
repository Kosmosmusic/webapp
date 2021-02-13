import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, timeout } from 'rxjs/operators';
import { AppHttpHandlersService } from 'src/app/services/http-handlers/http-handlers.service';

import { WINDOW } from '../../utils/injection-tokens';

@Injectable({
  providedIn: 'root',
})
export class AppSendEmailService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: AppHttpHandlersService,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  /**
   * Send email endpoint.
   */
  private readonly endpoint: string = this.window.location.origin + '/sendEmail';

  /**
   * Sends email.
   */
  public sendEmail(formData: {
    name: string;
    email: string;
    header: string;
    message: string;
    domain: string;
  }) {
    return this.http
      .post(this.endpoint, formData)
      .pipe(timeout(this.handlers.defaultHttpTimeout), catchError(this.handlers.handleError));
  }
}
