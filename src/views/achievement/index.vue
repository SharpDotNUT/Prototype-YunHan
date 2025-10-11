<script setup lang="ts">
import { computed, watch } from 'vue';
import { useAchievementStore, type AchievementGroup } from '.';
import { ref } from 'vue';
import { useMainStore } from '@/stores/main';

const mainStore = useMainStore();
const store = useAchievementStore();
const currentGoal = ref('all');
const mobile = computed(() => {
  return mainStore.windowSize.width <= 768;
});
const current = ref(1);
const size = ref(50);
watch(currentGoal, () => {
  current.value = 1;
});
const currentGroups = computed(() => {
  if (!store.data) return [];
  let groups = [] as AchievementGroup[];
  if (currentGoal.value == 'all') {
    groups = Object.values(store.data.achievementGroups);
  } else {
    store.data.achievementGoals[currentGoal.value].achievementGroups.forEach(
      (groupId) => {
        groups.push(store.data!.achievementGroups[groupId]);
      }
    );
  }
  return groups;
});
const showingGroups = computed(() =>
  currentGroups.value.slice(
    (current.value - 1) * size.value,
    current.value * size.value
  )
);
</script>

<template>
  <div v-if="store.data != null" class="__container">
    <var-paper id="bar">
      <div id="goal-list">
        <var-cell
          border
          :value="-1"
          ripple
          @click="currentGoal = 'all'"
          :class="{ selected: currentGoal == 'all' }">
          <p style="font-size: 120%">{{ $t('achievement.all') }}</p>
          <p v-if="!mobile">
            {{
              $t('achievement.numbers', [
                store.data.achievementStruct?.groupsCount ?? 0,
                store.data.achievementStruct?.achievementsCount ?? 0
              ])
            }}
          </p>
        </var-cell>
        <var-cell
          border
          v-for="(goal, id) in store.data.achievementGoals"
          :value="id"
          ripple
          @click="currentGoal = id"
          :class="{ selected: currentGoal == id }">
          <p style="font-size: 120%">{{ store.text?.[goal.nameHash] }}</p>
          <p v-if="!mobile">
            {{
              $t('achievement.numbers', [
                goal.groupsCount ?? 0,
                goal.achievementsCount ?? 0
              ])
            }}
          </p>
        </var-cell>
      </div>
    </var-paper>
    <div id="list">
      <var-pagination
        :simple="mobile"
        :total="currentGroups.length"
        v-model:current="current"
        v-model:size="size" />
      <div id="list-content">
        <var-card v-for="(item, i) in showingGroups" class="card">
          <div class="texts" v-for="it in item.achievements">
            <h2>{{ store.text?.[store.data.achievements[it].nameHash] }}</h2>
            <h3>
              {{ store.text?.[store.data.achievements[it].descriptionHash] }}
            </h3>
            <p>
              {{ store.data.achievements[it].reward }}
              <img src="./img/Primo.webp" style="height: 1em" />
            </p>
            <var-divider />
          </div>
        </var-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('./index.css');
</style>
