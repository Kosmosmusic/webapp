import { NgModule } from '@angular/core';

import { AppIframeContentLoadedDirective } from './iframe-content-loaded/iframe-content-loaded.directive';
import { AppImageLoadedDirective } from './image-loaded/image-loaded.directive';

@NgModule({
  declarations: [AppIframeContentLoadedDirective, AppImageLoadedDirective],
  exports: [AppIframeContentLoadedDirective, AppImageLoadedDirective],
})
export class AppDirectivesModule {}
