import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import AppConfig, { AppStage } from "@/config";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: AppConfig.stage === AppStage.DEVELOPMENT,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
