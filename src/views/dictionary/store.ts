import { useRM } from '@/stores/resource-manager';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Word } from './types';
import { difference } from 'lodash-es';
import { Snackbar } from '@varlet/ui';
import { useI18n } from 'vue-i18n';

const RM = useRM();
export const languages = ['zh', 'en', 'ja'];
export const useDict = defineStore('dictionary', () => {
  const { t } = useI18n();
  const Words = ref<Word[]>([]);
  const WordsFiltered = ref<Word[]>([]);
  const Tags = ref<Record<string, Record<string, string>>>({});
  const wordsLoaded = ref(false);
  const AvailableVoices = ref<SpeechSynthesisVoice[]>([]);
  const Voices = ref<Record<(typeof languages)[number], string | undefined>>({
    zh: undefined,
    en: undefined,
    ja: undefined
  });
  const loadVoices = () => {
    AvailableVoices.value = speechSynthesis.getVoices();
    Voices.value = {
      zh: AvailableVoices.value.find((v) => v.lang.startsWith('zh'))?.name,
      en: AvailableVoices.value.find((v) => v.lang.startsWith('en'))?.name,
      ja: AvailableVoices.value.find((v) => v.lang.startsWith('ja'))?.name
    };
  };
  loadVoices();
  speechSynthesis.addEventListener('voiceschanged', loadVoices);

  const fetchData = async () => {
    Promise.all([
      await RM.get('dictionary/genshin.min.json'),
      await RM.get('dictionary/genshin-tags.json')
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

  const utterance = new SpeechSynthesisUtterance();
  const read = (text: string, lang: (typeof languages)[number]) => {
    speechSynthesis.cancel();
    utterance.text = text;
    if (!Voices.value[lang]) {
      Snackbar.error(t('dictionary.cannot-find-voice'));
      return;
    }
    utterance.voice = AvailableVoices.value.find(
      (voice) => voice.name === Voices.value[lang]
    ) as SpeechSynthesisVoice;

    speechSynthesis.speak(utterance);
  };

  return {
    Words,
    WordsFiltered,
    Tags,
    wordsLoaded,
    AvailableVoices,
    Voices,
    fetchData,
    search,
    read
  };
});
