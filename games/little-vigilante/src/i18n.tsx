import { createI18nApi, declareComponentKeys } from 'i18nifty';
export { declareComponentKeys };

//List the languages you with to support
export const languages = ['en'] as const;

//If the user's browser language doesn't match any
//of the languages above specify the language to fallback to:
export const fallbackLanguage = 'en';

export type Language = typeof languages[number];

export type LocalizedString = Parameters<typeof resolveLocalizedString>[0];

export const {
  useTranslation,
  resolveLocalizedString,
  useLang,
  $lang,
  useResolveLocalizedString,
  /** For use outside of React */
  getTranslation,
} = createI18nApi<typeof import('./ui/organisms/chat.component').i18n>()(
  { languages, fallbackLanguage },
  {
    en: {
      Chat: {
        greating: ({ who }) => `Hello ${who}`,
      },
    },
  }
);
