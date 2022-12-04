import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from '../locales/index.js';

const initI18Next = async () => {
  const i18n = i18next.createInstance();
  await i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'ru',
  });
  return i18n;
};

export default initI18Next;
