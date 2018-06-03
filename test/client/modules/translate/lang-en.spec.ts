import { LANG_EN_NAME, LANG_EN_TRANSLATIONS } from '../../../../public/app/modules/translate/lang-en';

describe('TranslateService dictionary: lang-en', () => {

	it('should have translations defined', () => {

		expect(LANG_EN_NAME).toEqual('en');

		expect(LANG_EN_TRANSLATIONS).toEqual(jasmine.any(Object));

		expect(LANG_EN_TRANSLATIONS).toEqual(jasmine.objectContaining({
			title: 'KOS.MOS.MUSIC',
			releases: 'Releases',
			mastering: 'Mastering',
			mixes: 'Mixes',
			videos: 'Videos',
			about: 'About'
		}));

	});

});
