import {
  LanguageTextMapDefault,
  SupportedLanguages,
  type T_SupportedLanguage
} from '@/locales/i18n';
import { useRM } from '@/stores/resource-manager';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export interface Achievement {
  id: number;
  nameHash: number;
  descriptionHash: number;
  progress: number;
  reward: number;
}

export interface AchievementGroup {
  achievements: string[]; // ids
  showCount: boolean;
  finalProgress: number;
  rewardCount: number;
}

export interface AchievementGoal {
  id: number;
  order: number;
  nameHash: number;
  rewardCount: number;
  achievementsCount: number;
  groupsCount: number;
  achievementGroups: string[]; //ids
}

export interface AchievementStruct {
  rewardCount: number;
  achievementsCount: number;
  groupsCount: number;
  goalsCount: number;
  goals: string[]; //ids
}

export interface AchievementData {
  achievements: Record<string, Achievement>;
  achievementGoals: Record<string, AchievementGoal>;
  achievementGroups: Record<string, AchievementGroup>;
  achievementStruct: AchievementStruct;
}

export const useAchievementStore = defineStore('achievement', () => {
  const { locale } = useI18n();
  const RM = useRM();

  const data = ref<AchievementData | null>(null);
  const textMap = ref(structuredClone(LanguageTextMapDefault));
  const text = computed(
    () => textMap.value[locale.value as T_SupportedLanguage]
  );

  const fetchData = async () => {
    data.value = await RM.get('achievement/meta.min.json');
    SupportedLanguages.forEach(async (lang) => {
      textMap.value[lang] = await RM.get(`achievement/text_${lang}.json`);
    });
    console.log(data.value);
  };
  fetchData();

  return { data, text, fetchData };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAchievementStore, import.meta.hot));
}
