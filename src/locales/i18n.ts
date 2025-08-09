import { createI18n } from 'vue-i18n';
import EN from './text/en/main.json';
import ZHS from './text/zh-Hans/main.json';
import ZHT from './text/zh-Hant/main.json';
import JA from './text/ja/main.json';

import { Locale } from '@varlet/ui';
Locale.add('zh-Hans', Locale.zhCN);
Locale.add('zh-Hant', Locale.zhTW);
Locale.add('en', Locale.enUS);
Locale.add('ja', Locale.jaJP);

export const status = {
  all: Object.keys(ZHS).length,
  translated: [
    { lang: 'zh-Hans', name: '简体中文', len: Object.keys(ZHS).length },
    { lang: 'zh-Hant', name: '繁體中文', len: Object.keys(ZHT).length },
    { lang: 'ja', name: '日本語', len: Object.keys(JA).length },
    { lang: 'en', name: 'English', len: Object.keys(EN).length }
  ]
};

const messages = {
  'zh-Hans': {
    ...ZHS
  },
  'zh-Hant': {
    ...ZHT
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

export const SupportedLanguages = ['zh-Hans', 'zh-Hant', 'en', 'ja'];
export type TSupportedLanguages = 'zh-Hans' | 'zh-Hant' | 'en' | 'ja';

const i18n = createI18n<typeof ZHS, (typeof SupportedLanguages)[number]>({
  locale: 'zh-Hans',
  fallbackLocale: 'zh-Hans',
  messages,
  warnHtmlMessage: false,
  legacy: false
});

export default i18n;
