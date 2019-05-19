import { NgModule } from "@angular/core";

import { IframeContentLoadedDirective } from 'src/app/directives/iframe-content-loaded/iframe-content-loaded.directive';
import { ImageLoadedDirective } from 'src/app/directives/image-loaded/image-loaded.directive';

/**
 * Application directives module.
 */
@NgModule({
  declarations: [
    IframeContentLoadedDirective,
    ImageLoadedDirective
  ],
  exports: [
    IframeContentLoadedDirective,
    ImageLoadedDirective
  ]
})
export class AppDirectivesModule {}
