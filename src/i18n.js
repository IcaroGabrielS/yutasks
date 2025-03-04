import { createI18n } from 'vue-i18n'

// Importar arquivos de tradução
import pt from './locales/pt.json'
import en from './locales/en.json'

// Criar e exportar a instância do i18n
export default createI18n({
  legacy: false, // Habilitar Composition API
  globalInjection: true, // Injetar $t globalmente
  locale: 'pt', // Idioma padrão
  fallbackLocale: 'pt', // Idioma de fallback
  messages: {
    pt,
    en
  }
})