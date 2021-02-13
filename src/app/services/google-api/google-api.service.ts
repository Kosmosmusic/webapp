import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, take, timeout } from 'rxjs/operators';
import { AppHttpHandlersService } from 'src/app/services/http-handlers/custom-http-handlers.service';

import {
  IEnvironmentInterface,
  IGoogleApiEnvInterface,
} from '../../interfaces/app-environment/app-environment.interface';

@Injectable({
  providedIn: 'root',
})
export class AppGoogleApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: AppHttpHandlersService,
    @Inject('ENV') private readonly environment: IEnvironmentInterface,
  ) {}

  /**
   * Google API endpoints.
   */
  private readonly endpoints: { youtube: { search: string } } = {
    youtube: {
      search: 'https://www.googleapis.com/youtube/v3/channels',
    },
  };

  /**
   * Google API authentication data.
   */
  private readonly config: IGoogleApiEnvInterface = this.environment.gapi;

  /**
   * Gets youtube channel data.
   */
  public getChannelData() {
    let query: HttpParams = new HttpParams().set('key', this.config.browserKey);
    query = query.set('id', this.config.channelId);
    query = query.set('part', this.config.part);
    query = query.set('order', this.config.order);
    query = query.set('maxResults', this.config.maxResults);
    return this.http
      .get(this.endpoints.youtube.search, { params: query, responseType: 'json' })
      .pipe(
        timeout(this.handlers.defaultHttpTimeout),
        take(1),
        catchError(this.handlers.handleError),
      );
  }
}
