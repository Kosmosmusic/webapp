import { Inject, Injectable } from '@angular/core';

import { WINDOW } from '../../utils/injection-tokens';

/**
 * Controls Facebook JavaScript SDK.
 */
@Injectable({
  providedIn: 'root',
})
export class AppFacebookService {
  constructor(@Inject(WINDOW) private readonly window: Window) {
    this.initFacebookJsSDK();
  }

  /**
   * Creates Facebook root div.
   * @return Facebook root div reference <div id="fb-root"></div>
   */
  private createFbRoot() {
    const doc = this.window.document;
    let ref = doc.getElementById('fb-root'); // try getting it first
    if (ref !== null) {
      // create 'fb-root' if it does not exist
      ref = doc.createElement('div');
      ref.id = 'fb-root';
      const firstScriptTag = doc.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(ref, firstScriptTag);
    }
    return ref;
  }

  /**
   * Initializes facebook javascript sdk.
   *
   * see:
   * - https://developers.facebook.com/docs/javascript/howto/angularjs
   * - https://blog.brunoscopelliti.com/facebook-authentication-in-your-angularjs-web-app/
   */
  private initFacebookJsSDK(): void {
    const id = 'facebook-jssdk';
    const doc = this.window.document;
    const ref = this.createFbRoot();
    // return if script is already included
    if (doc.getElementById(id)) {
      return;
    }
    const js = doc.createElement('script');
    js.id = id;
    js.async = true;
    js.src =
      'https://connect.facebook.net/en_US/sdk.js#status=1&xfbml=1&version=v3.0&appId=477209839373369&channelUrl=channel.html';

    ref?.parentNode?.insertBefore(js, ref);
  }

  /**
   * Renders facebook widget.
   * Without this widget won't initialize after user navigates to another view and then back to a view the widget is placed
   */
  public renderFacebookWidget(): void {
    const facebookWinKey = 'FB';
    if (Boolean(this.window[facebookWinKey])) {
      const facebookLib: Record<string, { parse: () => void }> = this.window[facebookWinKey];
      facebookLib.XFBML.parse();
    }
  }
}
