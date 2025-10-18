<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { watchEffect } from 'vue';
import { computed, ref } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';

const mainStore = useMainStore();
const route = useRoute();
const router = useRouter();
const isMobile = computed(() => {
  return mainStore.windowSize.width <= 600;
});

const settings = ref(['general', 'rm', 'update-log', 'about']);
const tab = ref('general');
router.afterEach(() => {
  const reg = /settings\/(\w+)/;
  const match = route.path.match(reg);
  if (match && settings.value.includes(match[1])) {
    tab.value = match[1];
  }
});
watchEffect(() => {
  router.push(`/settings/${tab.value}`);
});
</script>

<template>
  <div class="__container_settings">
    <div id="bar" v-if="isMobile">
      <h2>
        {{ $t('setting.title') }}
        <span id="subtitle">
          &nbsp;/&nbsp;
          <var-menu style="cursor: pointer" placement="bottom">
            <span style="text-decoration: underline">
              {{ $t('setting.' + tab) }}
            </span>
            <template #menu>
              <var-cell
                v-for="set in settings"
                @click="tab = set"
                :key="set"
                :class="{ active: tab === set }">
                {{ $t('setting.' + set) }}
              </var-cell>
            </template>
          </var-menu>
        </span>
      </h2>
    </div>
    <div id="content">
      <div id="tabs-bar" v-if="!isMobile">
        <h2>{{ $t('setting.title') }}</h2>
        <var-tabs id="tabs" v-model:active="tab" layout-direction="vertical">
          <var-tab
            v-for="set in settings"
            :key="set"
            :name="set"
            :class="{ active: tab === set }">
            <div class="tab-item">
              {{ $t('setting.' + set) }}
            </div>
          </var-tab>
        </var-tabs>
      </div>
      <div id="view">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('./index.css');
</style>
