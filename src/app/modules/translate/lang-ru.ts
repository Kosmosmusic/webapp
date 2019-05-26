export const LANG_RU_NAME = 'ru';

/**
 * Russian UI dictionary.
 */
export const LANG_RU_TRANSLATIONS = {
  title: 'KOS.MOS.MUSIC',
  home: 'Дом',
  releases: 'Саундклауд',
  mastering: 'Мастеринг',
  mixes: 'Миксы',
  videos: 'Видео',
  about: 'Информация',
  language: {
    title: 'Язык',
    en: 'Английский',
    ru: 'Русский'
  },
  menu: {
    contact: 'Свяжитесь с нами'
  },
  contact: {
    open: 'Отправить сообщение',
    title: 'Контактная форма',
    result: {
      success: 'Ваше сообщение было успешно отправлено.',
      fail: 'Отправка сообщения не удалась. Пожалуйста, попробуй позже.'
    }
  },
  booking: {
    open: 'Букинг',
    title: 'Букинг',
    form: {
      date: 'Дата',
      venue: {
        title: 'Место проведения',
        name: 'Название места',
        capacity: 'Вместимость места',
        address: 'Адрес места',
        website: 'Web-сайт места'
      },
      event: {
        title: 'Информация о событии',
        name: 'Название события',
        website: 'Web-сайт события',
        ticket: 'Стоимость билета',
        lineup: 'Список исполнителей'
      },
      time: {
        start: 'Время начала',
        end: 'Время окончания',
        stage: 'Время выступления'
      },
      fee: 'Предлагаемый гонорар',
      booked: 'Артисты, приглашаемые ранее',
      promoter: {
        title: 'Информация о промоутере',
        company: 'Название компании',
        contact: 'Имя контактного лица',
        email: 'Эл. почта контактного лица',
        phone: 'Номер телефона контактного лица',
        website: 'Web-сайт промоутера'
      },
      invalid: {
        date: 'Выберите дату',
        venue: {
          name: 'Мин длина: 1 символ',
          capacity: 'Мин значение: 1',
          address: 'Мин длина: 1 символ',
          website: 'Пример правильного ввода: http://domain.tld'
        },
        event: {
          name: 'Мин длина: 1 символ',
          website: 'Пример правильного ввода: http://domain.tld'
        },
        ticketCost: 'Мин значение: 0',
        lineup: 'Мин длина: 1 символ',
        time: {
          start: 'Пример правильного ввода: 20:00 or 20:00-21:00',
          end: 'Пример правильного ввода: 20:00 or 20:00-21:00',
          stage: 'Пример правильного ввода: 01:00-02:00, 03:00-04:00'
        },
        fee: 'Мин значение: 1',
        promoter: {
          company: 'Мин длина: 1 символ',
          contact: 'Мин длина: 1 символ',
          email: 'Значение должно быть email-адресом',
          phone: 'Пример правильного ввода: +1 123 456-789',
          website: 'Пример правильного ввода: http://domain.tld'
        }
      }
    },
    result: {
      success: 'Ваше сообщение было успешно отправлено.',
      fail: 'Отправка сообщения не удалась. Пожалуйста, попробуй позже.'
    }
  },
  subscribe: {
    title: 'Подписка на email-рассылку',
    result: {
      success: 'Указанный адрес эл. почты был добавлен в список email-рассылки.',
      fail: 'Подписка на новостную email-рассылку не удалась. Пожалуйста, попробуйте позже.'
    }
  },
  services: {
    title: 'Заказ мастеринга',
    open: 'Заказать мастеринг',
    paragraph1: 'Kos.Mos.Music.Lab это "дочка" Московского независимого лейбла Kos.Mos.Music, одним из владельцев которого является Андрей Буртаев, более известный под псевдонимом Electrosoul System. C момента стновленя цифровых форматов как популярной формы распространения музыкальной продукции, команда лейбла приняла решение делать мастеринг самостоятельно, поскольку результаты выполнения этой работы другими людьми не всегда удовлетворяли, что выливалось в задержки релизов. Так появилась Kos.Mos.Music.Lab.',
    paragraph2: 'На данный момент, накопив солидный опыт и поработав с такими продюсерами как Subwave, Future Engineers, Roygreen & Protone и Electrosoul System (да, Андрей не занимается мастерингом собственных треков) команда Kos.Mos.Music.Lab рада предоставить вам свои услуги по мастерингу и сведению ваших музыкальных творений. Мастеринг почти всех релизов лейбла Kos.Mos.Music, начиная с 11-го, был сделан нами, а треки лейбла играет в своих сетах и подкастах такой неоспоримый драм-н-бейс гуру как London Elektricity, а также другие продюсеры и диск-жокеи лейблов Hospital, Med School и не только.',
    paragraph3: 'Индивидуальный подход к каждой композиции это наш способ достижения наилучших результатов.',
    requirements: 'Технические требования: 320 mp3/kbps, полная версия, формат наименования файла: псевдоним_артиста - название_трека (эл_почта@domain.tld).'
  },
  demo: {
    open: 'Отправить демо',
    title: 'Отправка демо',
    requirements: 'Технические требования: 320 mp3/kbps, полная версия, формат наименования файла: псевдоним_артиста - название_трека (эл_почта@domain.tld).',
    result: {
      success: 'Ваше демо было успешно отправлено.',
      fail: 'Отправка демо не удалась. Пожалуйста, попробуй позже.'
    }
  },
  form: {
    email: 'Эл. почта',
    name: 'Имя',
    link: 'Ссылка',
    header: 'Заголовок',
    message: 'Сообщение',
    invalid: {
      email: 'Неправильный адрес эл. почты',
      name: 'Неправильное имя: 2+ знаков',
      link: 'Неправильная ссылка, формат: http(s)://...',
      header: 'Неправильный заголовок: 3+ знаков',
      message: 'Неправильное сообщеие: 50+ знаков',
    }
  },
  action: {
    confirm: 'Подтвердить',
    cancel: 'Отмеить',
    close: 'Закрыть',
    play: 'Играть',
    download: 'Скачать',
    buy: 'Купить'
  }
};
