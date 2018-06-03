import { TranslateService } from '../../../../public/app/modules/translate/index';

// translation definitions
import { LANG_EN_NAME, LANG_EN_TRANSLATIONS } from '../../../../public/app/modules/translate/lang-en';
import { LANG_RU_NAME, LANG_RU_TRANSLATIONS } from '../../../../public/app/modules/translate/lang-ru';

const dictionary = {
	[LANG_EN_NAME]: LANG_EN_TRANSLATIONS,
	[LANG_RU_NAME]: LANG_RU_TRANSLATIONS
};

describe('TranslateService', () => {

	beforeEach(() => {
		this.service = new TranslateService(dictionary);
	});

	it('should be defined', () => {
		expect(this.service).toBeDefined();
	});

	it('should have variables and methods defined', () => {
		expect(this.service.currentLanguage).toBeUndefined(); // because _currentLanguage is undefined initially
		expect(this.service.use).toBeDefined();
		expect(this.service.instant).toBeDefined();
	});

	it('use() should set current language, currentLanguage() should return current language', () => {
		this.service.use('ru');
		expect(this.service.currentLanguage).toBeDefined();
		expect(this.service.currentLanguage).toEqual('ru');
	});

	it('instant() should return provided key if no translation is available', () => {
		expect(this.service.instant('title')).toEqual('KOS.MOS.MUSIC');
		this.service.use('en');
		expect(this.service.instant('nonexistent_key')).toEqual('nonexistent_key');
		expect(this.service.instant('nonexistent.key')).toEqual('nonexistent.key');
	});

	it('instant() should return instant translation of a dictionary key', () => {
		this.service.use('ru');
		expect(this.service.instant('title')).toEqual('KOS.MOS.MUSIC');
		this.service.use('en');
		expect(this.service.instant('releases')).toEqual('Releases');
		this.service.use('en');
		expect(this.service.instant('mastering')).toEqual('Mastering');
	});

});
