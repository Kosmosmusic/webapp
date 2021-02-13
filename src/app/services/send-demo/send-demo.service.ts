import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, timeout } from 'rxjs/operators';
import { AppHttpHandlersService } from 'src/app/services/http-handlers/custom-http-handlers.service';

@Injectable({
  providedIn: 'root',
})
export class AppSendDemoService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: AppHttpHandlersService,
    @Inject('Window') private readonly window: Window,
  ) {}

  /**
   * Send demo endpoint.
   */
  private readonly endpoint: string = this.window.location.origin + '/sendDemo';

  /**
   * Sends demo.
   */
  public sendDemo(formData: { email: string; link: string; domain: string }) {
    return this.http
      .post(this.endpoint, formData)
      .pipe(timeout(this.handlers.defaultHttpTimeout), catchError(this.handlers.handleError));
  }
}
