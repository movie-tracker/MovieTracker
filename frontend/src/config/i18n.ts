import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enLang from './locales/en.json';
import ptLang from './locales/pt.json';

import LanguageDetector from 'i18next-browser-languagedetector';
import AppConfig, { AppStage } from '@/config';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: AppConfig.stage === AppStage.DEVELOPMENT,
    resources: {
      en: { translation: enLang },
      pt: { translation: ptLang },
    },
  });

export default i18n;
