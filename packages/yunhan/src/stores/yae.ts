import ky from 'ky';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const BASE_URL = 'https://hoyo-textmap.sharpdotnut.com/';

export const useYaeStore = defineStore('yae', () => {
  const text: Record<string, Record<string, string>> = {};
  const meta = ref(
    [] as {
      name: string;
      path: string;
      size: number;
    }[]
  );

  let fetchMetaPromise: Promise<void> | null = null;
  async function fetchMeta() {
    if (fetchMetaPromise) return fetchMetaPromise;
    return ky
      .get(BASE_URL + '/meta.json')
      .then((res) => res.json())
      .then((data: any) => {
        meta.value = data.file;
      });
  }

  let fetchTextPromise: Promise<void> | null = null;
  async function fetchText(lang: string) {
    if (fetchTextPromise) return fetchTextPromise;
    if (!meta.value.length) {
      await fetchMeta();
    }
    const textMeta = meta.value.find((item) => item.name === lang);
    if (!textMeta) {
      return;
    }
    return ky
      .get(BASE_URL + textMeta.path)
      .then((res) => res.json())
      .then((data: any) => {
        text[lang] = data;
      });
  }

  const getText = async (lang: string, key: string) => {
    if (!text[lang]) {
      await fetchText(lang);
    }
    return text[lang]?.[key];
  };

  return { text, meta, fetchText, getText };
});
