import { createI18n } from 'vue-i18n';
import EN from './text/en/main.json';
import ZHS from './text/zh-Hans/main.json';
import ZHT from './text/zh-Hant/main.json';
import JA from './text/ja/main.json';
import EN_yae from './text/en/yae.json';
import ZHS_yae from './text/zh-Hans/yae.json';
import ZHT_yae from './text/zh-Hant/yae.json';
import JA_yae from './text/ja/yae.json';

import { Locale } from '@varlet/ui';
Locale.add('zh-Hans', Locale.zhCN);
Locale.add('zh-Hant', Locale.zhTW);
Locale.add('en', Locale.enUS);
Locale.add('ja', Locale.jaJP);

// 在源头定义支持的语言列表和类型
export const SupportedLanguages = ['zh-Hans', 'zh-Hant', 'en', 'ja'] as const;
export type T_SupportedLanguage = 'zh-Hans' | 'zh-Hant' | 'en' | 'ja';

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
    ...ZHS,
    ...ZHS_yae
  },
  'zh-Hant': {
    ...ZHT,
    ...ZHT_yae
  },
  en: {
    ...EN,
    ...EN_yae
  },
  ja: {
    ...JA,
    ...JA_yae
  }
};

const i18n = createI18n<typeof ZHS, T_SupportedLanguage>({
  locale: 'zh-Hans',
  fallbackLocale: 'zh-Hans',
  messages,
  warnHtmlMessage: false,
  legacy: false
});

export default i18n;

export const LanguageTextMapDefault = {
  'zh-Hans': {},
  'zh-Hant': {},
  en: {},
  ja: {}
} as Record<T_SupportedLanguage, Record<string, string>>;
