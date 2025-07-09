import Meta from './meta.json';

export const getLanguage = (lang: string) => {
  return Meta.find((l) => l.lang === lang);
};

export const getLangID = (game: string, lang: string) => {
  return `${game}.${lang}`;
};
