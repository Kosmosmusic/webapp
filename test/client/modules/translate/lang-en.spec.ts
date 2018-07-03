import { LANG_EN_NAME, LANG_EN_TRANSLATIONS } from '../../../../public/app/modules/translate/lang-en';

describe('TranslateService dictionary: lang-en', () => {

	it('should have translations defined', () => {

		expect(LANG_EN_NAME).toEqual('en');

		expect(LANG_EN_TRANSLATIONS).toEqual(jasmine.any(Object));

		expect(LANG_EN_TRANSLATIONS).toEqual(jasmine.objectContaining({
			title: 'KOS.MOS.MUSIC',
			home: 'Home',
			releases: 'Soundcloud',
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
			services: {
				paragraph1: 'Kos.Mos.Music.Lab is an offshoot of Moscow based independent electronic music label Kos.Mos.Music, co-owned by Andrey Burtaev, better known as Electrosoul System. Since digital media started to become more and more popular, the label decided to do mastering by itself due to low mastering quality from other engineers and, therefore, release delays. That\'s how Kos.Mos.Music.Lab was born.',
				paragraph2: 'At the moment, having solid experience of cooperation with such producers as Subwave, Future Engineers, Roygreen & Protone and Electrosoul System (no, Andrey doesn’t do mastering of his own tracks) Kos.Mos.Music.Lab team is proud to provide you with mastering and mixing services for your musical content. Almost all releases of Kos.Mos.Music, beginning from 11th, were mastered by our crew and the tracks from Kos.Mos.Music are played by such dnb guru as London Elektricity and others from Med School and Hospital labels, to name a few.',
				paragraph3: 'Individual approach to each recording is our way to achive the best possible results.'
			},
			demo: {
				open: 'Send demo',
				title: 'Demo submission',
				requirements: 'Technical requirements: 320 mp3/kbps, full length version, file naming format: atrist_name - track_name (your_email@domain.tld).',
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
