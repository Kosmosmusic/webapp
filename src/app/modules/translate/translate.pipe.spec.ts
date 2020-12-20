import { LANG_EN_NAME, LANG_EN_TRANSLATIONS } from './lang-en';
import { LANG_RU_NAME, LANG_RU_TRANSLATIONS } from './lang-ru';
import { AppTranslatePipe } from './translate.pipe';
import { AppTranslateService } from './translate.service';
import { SUPPORTED_LANGUAGE_KEY } from './translations.interface';

const dictionary = {
  [LANG_EN_NAME]: LANG_EN_TRANSLATIONS,
  [LANG_RU_NAME]: LANG_RU_TRANSLATIONS,
};

describe('AppTranslatePipe', () => {
  let service: AppTranslateService;
  let pipe: AppTranslatePipe;

  beforeEach(() => {
    service = new AppTranslateService(dictionary);
    pipe = new AppTranslatePipe(service);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should have variables and methods defined', () => {
    expect(pipe.transform).toBeDefined();
  });

  it('instant() should return provided key if no translation is available', () => {
    expect(pipe.transform('title')).toEqual('title');
  });

  it('transform() should return instant translation of a dictionary key', () => {
    expect(pipe.transform('')).toBeUndefined();
    service.use(SUPPORTED_LANGUAGE_KEY.RUSSIAN);
    expect(pipe.transform('releases')).toEqual('Саундклауд');
    service.use(SUPPORTED_LANGUAGE_KEY.ENGLISH);
    expect(pipe.transform('releases')).toEqual('Soundcloud');
  });
});
