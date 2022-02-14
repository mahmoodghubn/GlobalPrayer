import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import i18next from 'i18next';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      Fajr: 'Dawn',
      Sunrise: 'Sunrise',
      Dhuhr: 'Noon',
      Asr: 'Afternoon',
      Maghrib: 'Sunset',
      Isha: 'Night',
      Mute: 'Mute Settings',
      Method: 'Change Method',
      Languages: 'Languages',
    },
  },
  ar: {
    translation: {
      Fajr: 'الفجر',
      Sunrise: 'الشمس',
      Dhuhr: 'الظهر',
      Asr: 'العصر',
      Maghrib: 'المغرب',
      Isha: 'العشاء',
      Mute: 'اعدادت كتم الصوت',
      Method: 'تغيير الطريقة',
      Languages: 'تغيير اللغة',
    },
  },
  tr: {
    translation: {
      Fajr: 'Şafak',
      Sunrise: 'Güneş',
      Dhuhr: 'Öğlen',
      Asr: 'İkinde',
      Maghrib: 'Akşam',
      Isha: 'Yatsı',
      Mute: 'Sessiz Alma Ayarları',
      Method: 'Yöntemi Değiştir',
      Languages: 'Dil Değiştir',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
