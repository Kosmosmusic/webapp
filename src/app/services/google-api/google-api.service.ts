import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, take, timeout } from 'rxjs/operators';
import { IEnvironmentInterface, IGoogleApiENVInterface } from 'src/app/interfaces';
import { CustomHttpHandlersService } from 'src/app/services/http-handlers/custom-http-handlers.service';

@Injectable()
export class GoogleApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly handlers: CustomHttpHandlersService,
    @Inject('ENV') private readonly environment: IEnvironmentInterface,
  ) {
    console.log('GoogleApiService constructor');
  }

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
  private readonly config: IGoogleApiENVInterface = this.environment.gapi;

  /**
   * Gets youtube channel data.
   */
  public getChannelData(): Observable<any[]> {
    let query: HttpParams = new HttpParams().set('key', this.config.browserKey);
    query = query.set('id', this.config.channelId);
    query = query.set('part', this.config.part);
    query = query.set('order', this.config.order);
    query = query.set('maxResults', this.config.maxResults);
    return this.http
      .get(this.endpoints.youtube.search, { params: query, responseType: 'json' })
      .pipe(
        timeout(this.handlers.timeoutValue()),
        take(1),
        map(this.handlers.extractObject),
        catchError(this.handlers.handleError),
      );
  }
}
