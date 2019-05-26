import { NgModule, ModuleWithProviders } from '@angular/core';

import { TRANSLATION_PROVIDERS } from './translations';
import { TranslatePipe } from './translate.pipe';
import { TranslateService } from './translate.service';

/**
 * Translate module.
 */
@NgModule({
  declarations: [ TranslatePipe ],
exports: [ TranslatePipe ]
})
export class TranslateModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: TranslateModule,
      providers: [ TRANSLATION_PROVIDERS, TranslateService ]
    };
  }
}