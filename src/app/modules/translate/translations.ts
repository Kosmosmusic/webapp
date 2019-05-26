import { InjectionToken } from '@angular/core';

import { LANG_EN_NAME, LANG_EN_TRANSLATIONS } from './en/lang-en';
import { LANG_RU_NAME, LANG_RU_TRANSLATIONS } from './ru/lang-ru';

export const TRANSLATIONS = new InjectionToken('translations');

/**
 * Translate module dictionaries.
 */
export const dictionary = {
  [LANG_EN_NAME]: LANG_EN_TRANSLATIONS,
  [LANG_RU_NAME]: LANG_RU_TRANSLATIONS
};

/**
 * Translate module providers.
 */
export const TRANSLATION_PROVIDERS = [
  { provide: TRANSLATIONS, useValue: dictionary }
];
