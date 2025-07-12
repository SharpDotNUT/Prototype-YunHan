import { useRM } from '@/stores/resource-manager';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Word } from './types';
import { difference } from 'lodash-es';

const RM = useRM();
export const useDict = defineStore('dictionary', () => {
  const Words = ref<Word[]>([]);
  const WordsFiltered = ref<Word[]>([]);
  const Tags = ref<Record<string, Record<string, string>>>({});
  const wordsLoaded = ref(false);

  const fetchData = async () => {
    Promise.all([
      await RM.get('dictionary/genshin'),
      await RM.get('dictionary/genshin-tags')
    ]).then(([WORDS, TAGS]) => {
      Words.value = WORDS;
      Tags.value = TAGS;
      wordsLoaded.value = true;
      search('', []);
    });
  };
  fetchData();

  const search = (text: string, searchTags: string[]) => {
    const searchText = text.toLowerCase();
    let result: Word[] = [];
    if (text === '') {
      result = Words.value;
    } else {
      result = Words.value.filter((word) => {
        if (word.text['zh-Hans'].includes(searchText)) return true;
        if (word.text.en.toLowerCase().includes(searchText)) return true;
        if (word.text.ja.includes(searchText)) return true;
        if (word.pronunciationJa?.includes(searchText)) return true;
        return false;
      });
    }
    if (searchTags.length > 0) {
      result = result.filter(
        (word) => difference(searchTags, word.tags).length === 0
      );
    }
    WordsFiltered.value = result;
  };

  return { Words, WordsFiltered, Tags, wordsLoaded, fetchData, search };
});
