import { TranslateService } from 'src/app/modules/translate/index';

// translation definitions
import {
  LANG_EN_NAME,
  LANG_EN_TRANSLATIONS
} from 'src/app/modules/translate/lang-en';

import {
  LANG_RU_NAME,
  LANG_RU_TRANSLATIONS
} from 'src/app/modules/translate/lang-ru';

const dictionary = {
  [LANG_EN_NAME]: LANG_EN_TRANSLATIONS,
  [LANG_RU_NAME]: LANG_RU_TRANSLATIONS
};

describe('TranslateService', () => {

  let service: TranslateService;

  beforeEach(() => {
    service = new TranslateService(dictionary);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have variables and methods defined', () => {
    expect(service.currentLanguage).toBeUndefined(); // because _currentLanguage is undefined initially
    expect(service.use).toBeDefined();
    expect(service.instant).toBeDefined();
  });

  it('use() should set current language, currentLanguage() should return current language', () => {
    service.use('ru');
    expect(service.currentLanguage).toBeDefined();
    expect(service.currentLanguage).toEqual('ru');
  });

  it('instant() should return provided key if no translation is available', () => {
    service.use('en');
    expect(service.instant('nonexistent_key')).toEqual('nonexistent_key');
    expect(service.instant('nonexistent.key')).toEqual('nonexistent.key');
  });

  it('instant() should return instant translation of a dictionary key', () => {
    service.use('ru');
    expect(service.instant('title')).toEqual('KOS.MOS.MUSIC');
    service.use('en');
    expect(service.instant('releases')).toEqual('Soundcloud');
    service.use('en');
    expect(service.instant('mastering')).toEqual('Mastering');
  });

});
