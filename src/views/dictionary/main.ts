import type { Ref } from 'vue';

export interface t_word {
  zhCN: string;
  en: string;
  ja: string;
  tags: string[];
}

export function filter(
  word: t_word,
  searchString: Ref<string>,
  searchTags: Ref<string[]>,
  searchFrom: Ref<string>
): boolean {
  const isTextMatch = checkTextMatch(
    word,
    searchString.value,
    searchFrom.value
  );
  const areTagsMatch = checkTagsMatch(word.tags, searchTags.value);
  return isTextMatch && areTagsMatch;
}

function checkTextMatch(
  word: t_word,
  searchTerm: string,
  searchField: string
): boolean {
  if (!searchTerm) return true;
  const term = searchTerm.toLowerCase();
  switch (searchField) {
    case 'zh-Hans':
      return word.zhCN?.toLowerCase().includes(term) ?? false;
    case 'en':
      return word.en?.toLowerCase().includes(term) ?? false;
    case 'ja':
      return word.ja?.toLowerCase().includes(term) ?? false;
    default:
      return (
        (word.zhCN?.toLowerCase().includes(term) ||
          word.en?.toLowerCase().includes(term) ||
          word.ja?.toLowerCase().includes(term)) ??
        false
      );
  }
}

function checkTagsMatch(wordTags: string[], searchTags: string[]): boolean {
  if (searchTags.length === 0) return true;
  if (!wordTags) return false;
  return searchTags.every((tag) => wordTags.includes(tag));
}
