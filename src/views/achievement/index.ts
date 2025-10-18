import {
  LanguageTextMapDefault,
  SupportedLanguages,
  type T_SupportedLanguage
} from '@/locales/i18n';
import { useRM } from '@/stores/resource-manager';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed } from 'vue';
import { watch } from 'vue';
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

  const search = ref({
    text: ''
  });
  const currentGoal = ref('all');
  const flitter = () => {
    if (!data.value) return [];
    let groups = [] as AchievementGroup[];
    if (currentGoal.value == 'all') {
      groups = Object.values(data.value.achievementGroups);
    } else {
      data.value.achievementGoals[currentGoal.value].achievementGroups.forEach(
        (groupId) => {
          groups.push(data.value!.achievementGroups[groupId]);
        }
      );
    }
    groups = groups.filter((group) => {
      if (search.value.text) {
        let _ = false;
        group.achievements.forEach((id) => {
          if (
            text.value[data.value!.achievements[id].nameHash].includes(
              search.value.text
            ) ||
            text.value[data.value!.achievements[id].descriptionHash].includes(
              search.value.text
            )
          ) {
            _ = true;
          }
        });
        return _;
      }
      return true;
    });
    currentGroups.value = groups;
  };
  const currentGroups = ref<AchievementGroup[]>([]);
  watch([currentGoal, data.value], flitter, {
    deep: 1,
    immediate: true
  });

  const fetchData = async () => {
    data.value = await RM.get('achievement/meta.min.json');
    SupportedLanguages.forEach(async (lang) => {
      textMap.value[lang] = await RM.get(`achievement/text_${lang}.json`);
    });
    console.log(data.value);
  };
  fetchData();

  return { data, text, search, currentGoal, currentGroups, flitter, fetchData };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAchievementStore, import.meta.hot));
}
