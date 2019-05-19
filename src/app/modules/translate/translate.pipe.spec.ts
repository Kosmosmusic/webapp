import {
  TranslateService,
  TranslatePipe
} from 'src/app/modules/translate/index';

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

describe('TranslatePipe', () => {

  let service: TranslateService;
  let pipe: TranslatePipe;

  beforeEach(() => {
    service = new TranslateService(dictionary);
    pipe = new TranslatePipe(service);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should have variables and methods defined', () => {
    expect(pipe.transform).toBeDefined();
  });

  it('instant() should return provided key if no translation is available', () => {
    expect(pipe.transform('title', [])).toEqual('title');
  });

  it('transform() should return instant translation of a dictionary key', () => {
    expect(pipe.transform('', null)).toBeUndefined();
    service.use('ru');
    expect(pipe.transform('releases', [])).toEqual('Саундклауд');
    service.use('en');
    expect(pipe.transform('releases', [])).toEqual('Soundcloud');
  });

});
