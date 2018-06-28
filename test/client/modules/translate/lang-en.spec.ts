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
			about: 'About',
			language: {
				title: 'Language',
				en: 'English',
				ru: 'Russian'
			},
			contact: {
				open: 'Send message',
				title: 'Contact form',
				result: {
					success: 'Your message was successfully sent.',
					fail: 'Message sending failed. Please, try again later.'
				}
			},
			subscribe: {
				title: 'Mailing list subscription',
				result: {
					success: 'Provided email address was added to mailing list.',
					fail: 'Mailing list subscription failed. Please, try again later.'
				}
			},
			demo: {
				open: 'Send demo',
				title: 'Demo submission',
				result: {
					success: 'Your demo was successfully sent.',
					fail: 'Demo sending failed. Please, try again later.'
				}
			},
			form: {
				email: 'Email',
				name: 'Name',
				link: 'Link',
				header: 'Header',
				message: 'Message',
				invalid: {
					email: 'Invalid email',
					name: 'Invalid name: 2+ characters',
					link: 'Invalid link, format: http(s)://...',
					header: 'Invalid header: 3+ characters',
					message: 'Invalid message: 50+ characters',
				}
			},
			action: {
				confirm: 'Confirm',
				cancel: 'Cancel',
				close: 'Close'
			}
		}));

	});

});
