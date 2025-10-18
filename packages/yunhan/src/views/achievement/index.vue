<script setup lang="ts">
import { computed, watch } from 'vue';
import { useAchievementStore, type AchievementGroup } from '.';
import { ref } from 'vue';
import { useMainStore } from '@/stores/main';

const mainStore = useMainStore();
const store = useAchievementStore();
const mobile = computed(() => {
  return mainStore.windowSize.width <= 768;
});
const current = ref(1);
const size = ref(50);
watch(
  () => store.currentGoal,
  () => {
    current.value = 1;
  }
);
const showingGroups = computed(() =>
  store.currentGroups.slice(
    (current.value - 1) * size.value,
    current.value * size.value
  )
);
</script>

<template>
  <div v-if="store.data != null" class="__container">
    <var-paper id="bar">
      <var-input
        v-model="store.search.text"
        @input="store.flitter"
        :placeholder="$t('global.search')" />
      <div id="goal-list">
        <var-cell
          border
          :value="-1"
          ripple
          @click="store.currentGoal = 'all'"
          :class="{ selected: store.currentGoal == 'all' }">
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
          @click="store.currentGoal = id"
          :class="{ selected: store.currentGoal == id }">
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
        :total="store.currentGroups.length"
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
