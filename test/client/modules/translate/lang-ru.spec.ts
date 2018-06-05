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
			},
			contact: {
				title: 'Контактная форма',
				result: {
					success: 'Ваше сообщение было успешно отправлено.',
					fail: 'Отправка сообщения не удалась. Пожалуйста, попробуй позже.'
				}
			},
			form: {
				email: 'Эл. почта',
				name: 'Имя',
				header: 'Заголовок',
				message: 'Сообщение',
				invalid: {
					email: 'Неправильный адрес эл. почты',
					name: 'Неправильное имя: 2+ знаков',
					header: 'Неправильный заголовок: 3+ знаков',
					message: 'Неправильное сообщеие: 50+ знаков',
				}
			},
			action: {
				confirm: 'Подтвердить',
				cancel: 'Отмеить',
				close: 'Закрыть'
			}
		}));

	});

});
