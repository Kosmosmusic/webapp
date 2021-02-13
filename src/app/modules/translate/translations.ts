import { InjectionToken } from '@angular/core';

import { LANG_EN_NAME, LANG_EN_TRANSLATIONS } from './lang-en';
import { LANG_RU_NAME, LANG_RU_TRANSLATIONS } from './lang-ru';
import { ISupportedLanguage, SUPPORTED_LANGUAGE_KEY } from './translations.interface';

/**
 * Translate module dictionaries.
 */
export const dictionary = {
  [LANG_EN_NAME]: LANG_EN_TRANSLATIONS,
  [LANG_RU_NAME]: LANG_RU_TRANSLATIONS,
};

export const TRANSLATIONS = new InjectionToken<typeof dictionary>('translations', {
  providedIn: 'root',
  factory: () => ({ ...dictionary }),
});

/**
 * Translate module providers.
 */
export const TRANSLATION_PROVIDERS = [{ provide: TRANSLATIONS, useValue: dictionary }];

export const supportedLanguages: ISupportedLanguage[] = [
  { key: SUPPORTED_LANGUAGE_KEY.ENGLISH, name: 'English' },
  { key: SUPPORTED_LANGUAGE_KEY.RUSSIAN, name: 'Russian' },
];
