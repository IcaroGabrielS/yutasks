import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json'; // Traduções em inglês
import pt from '@/locales/pt.json'; // Traduções em português
import de from '@/locales/de.json'; // Traduções em alemão

const i18n = createI18n({
  locale: 'en', // Idioma padrão
  fallbackLocale: 'en', // Idioma de fallback
  messages: {
    en, // Traduções em inglês
    pt, // Traduções em português
    de, // Traduções em alemão
  },
});

export default i18n;