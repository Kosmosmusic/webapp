import { TranslateService, TranslatePipe } from '../../../../public/app/modules/translate/index';

// translation definitions
import { LANG_EN_NAME, LANG_EN_TRANSLATIONS } from '../../../../public/app/modules/translate/lang-en';
import { LANG_RU_NAME, LANG_RU_TRANSLATIONS } from '../../../../public/app/modules/translate/lang-ru';

const dictionary = {
	[LANG_EN_NAME]: LANG_EN_TRANSLATIONS,
	[LANG_RU_NAME]: LANG_RU_TRANSLATIONS
};

describe('TranslatePipe', () => {

	beforeEach(() => {
		this.service = new TranslateService(dictionary);
		this.pipe = new TranslatePipe(this.service);
	});

	it('should be defined', () => {
		expect(this.pipe).toBeDefined();
	});

	it('should have variables and methods defined', () => {
		expect(this.pipe.transform).toBeDefined();
	});

	it('instant() should return provided key if no translation is available', () => {
		expect(this.pipe.transform('title', [])).toEqual('title');
	});

	it('transform() should return instant translation of a dictionary key', () => {
		expect(this.pipe.transform('')).toBeUndefined();
		this.service.use('ru');
		expect(this.pipe.transform('releases', [])).toEqual('Саундклауд');
		this.service.use('en');
		expect(this.pipe.transform('releases', [])).toEqual('Soundcloud');
	});

});
