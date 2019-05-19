import {
  LANG_EN_NAME,
  LANG_EN_TRANSLATIONS
} from 'src/app/modules/translate/lang-en';

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
      booking: {
        open: 'Booking',
        title: 'Booking',
        form: {
          date: 'Date',
          venue: {
            title: 'Venue details',
            name: 'Venue name',
            capacity: 'Venue capacity',
            address: 'Venue address',
            website: 'Venue website'
          },
          event: {
            title: 'Event details',
            name: 'Event name',
            website: 'Event website',
            ticket: 'Ticket cost',
            lineup: 'Event Line up'
          },
          time: {
            start: 'Event start time',
            end: 'Event end time',
            stage: 'Stage time'
          },
          fee: 'Offered fee',
          booked: 'Atrists booked earlier',
          promoter: {
            title: 'Promoter details',
            company: 'Company name',
            contact: 'Contact name',
            email: 'Contact email',
            phone: 'Contact phone',
            website: 'Promoter website'
          },
          invalid: {
            venue: {
              name: 'Min length: 1 symbol',
              capacity: 'Min value: 1',
              address: 'Min length: 1 symbol',
              website: 'Valid input example: http://domain.tld'
            },
            event: {
              name: 'Min length: 1 symbol',
              website: 'Valid input example: http://domain.tld'
            },
            ticketCost: 'Min value: 0',
            lineup: 'Min length: 1 symbol',
            time: {
              start: 'Valid input example: 20:00 or 20:00-21:00',
              end: 'Valid input example: 20:00 or 20:00-21:00',
              stage: 'Valid input example: 01:00-02:00, 03:00-04:00'
            },
            fee: 'Min value: 1',
            promoter: {
              company: 'Min length: 1 symbol',
              contact: 'Min length: 1 symbol',
              email: 'Must be a valid email address',
              phone: 'Valid input example: +1 123 456-789',
              website: 'Valid input example: http://domain.tld'
            }
          }
        },
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
        title: 'Mastering order',
        open: 'Order mastering',
        paragraph1: 'Kos.Mos.Music.Lab is an offshoot of Moscow based independent electronic music label Kos.Mos.Music, co-owned by Andrey Burtaev, better known as Electrosoul System. Since digital media started to become more and more popular, the label decided to do mastering by itself due to low mastering quality from other engineers and, therefore, release delays. That\'s how Kos.Mos.Music.Lab was born.',
        paragraph2: 'At the moment, having solid experience of cooperation with such producers as Subwave, Future Engineers, Roygreen & Protone and Electrosoul System (no, Andrey doesn’t do mastering of his own tracks) Kos.Mos.Music.Lab team is proud to provide you with mastering and mixing services for your musical content. Almost all releases of Kos.Mos.Music, beginning from 11th, were mastered by our crew and the tracks from Kos.Mos.Music are played by such dnb guru as London Elektricity and others from Med School and Hospital labels, to name a few.',
        paragraph3: 'Individual approach to each recording is our way to achive the best possible results.',
        requirements: 'Technical requirements: 320 mp3/kbps, full length version, file naming format: atrist_name - track_name (your_email@domain.tld).'
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
        close: 'Close',
        play: 'Play',
        download: 'Download',
        buy: 'Buy'
      }
    }));

  });

});
