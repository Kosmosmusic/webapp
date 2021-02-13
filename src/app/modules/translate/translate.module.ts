import { NgModule } from '@angular/core';

import { AppTranslatePipe } from './translate.pipe';

/**
 * Translate module.
 */
@NgModule({
  declarations: [AppTranslatePipe],
  exports: [AppTranslatePipe],
})
export class AppTranslateModule {}
