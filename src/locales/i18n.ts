import { createI18n } from 'vue-i18n';
import EN from './en.json';
import ZHS from './zh-Hans.json';
import JA from './ja.json';

import { Locale } from '@varlet/ui';
Locale.add('zh-Hans', Locale.zhCN);
Locale.add('en', Locale.enUS);
Locale.add('ja', Locale.jaJP);

export const status = {
  all: Object.keys(ZHS).length,
  translated: [
    { lang: 'zh-Hans', name: '简体中文', len: Object.keys(ZHS).length },
    { lang: 'ja', name: '日本語', len: Object.keys(JA).length },
    { lang: 'en', name: 'English', len: Object.keys(EN).length }
  ]
};

const messages = {
  'zh-Hans': {
    ...ZHS
  },
  zh: {
    ...ZHS
  },
  en: {
    ...EN
  },
  ja: {
    ...JA
  }
};

const i18n = createI18n({
  locale: 'zh-Hans',
  fallbackLocale: 'zh-Hans',
  messages,
  warnHtmlMessage: false,
  legacy: false
});

export default i18n;
