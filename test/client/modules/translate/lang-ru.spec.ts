import { LANG_RU_NAME, LANG_RU_TRANSLATIONS } from '../../../../public/app/modules/translate/lang-ru';

describe('TranslateService dictionary: lang-ru', () => {

	it('should have translations defined', () => {

		expect(LANG_RU_NAME).toEqual('ru');

		expect(LANG_RU_TRANSLATIONS).toEqual(jasmine.any(Object));

		expect(LANG_RU_TRANSLATIONS).toEqual(jasmine.objectContaining({
			title: 'KOS.MOS.MUSIC',
			releases: 'Релизы',
			mastering: 'Мастеринг',
			mixes: 'Миксы',
			videos: 'Видео',
			about: 'Информация',
			language: {
				title: 'Язык',
				en: 'Английский',
				ru: 'Русский'
			}
		}));

	});

});
