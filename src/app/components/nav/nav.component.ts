import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

import { AppTranslateService } from '../../modules/translate/translate.service';
import { supportedLanguages } from '../../modules/translate/translations';
import {
  ISupportedLanguage,
  SUPPORTED_LANGUAGE_KEY,
} from '../../modules/translate/translations.interface';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppNavComponent {
  @HostBinding('class.mat-body-1') public readonly matBody1 = true;

  constructor(private readonly translate: AppTranslateService) {}

  /**
   * Supported languages list.
   */
  public supportedLanguages: ISupportedLanguage[] = [...supportedLanguages];

  /**
   * Selects language.
   */
  public selectLanguage(key: SUPPORTED_LANGUAGE_KEY = SUPPORTED_LANGUAGE_KEY.ENGLISH): void {
    void this.translate.use(key);
  }
}
