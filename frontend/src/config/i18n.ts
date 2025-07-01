import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import AppConfig, { AppStage } from '@/config';

import enLang from './locales/en.json';
import ptLang from './locales/pt.json';

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
