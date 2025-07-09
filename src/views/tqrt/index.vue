<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { Dialog } from '@varlet/ui';
import { useI18n } from 'vue-i18n';

const Store = useMainStore();
const { t } = useI18n();

if (Store.windowSize.width < 600) {
  Dialog(t('global.tip.not-optimized-narrow'));
}
</script>

<template>
  <div class="container-tqrt">
    <router-view></router-view>
  </div>
</template>

<style lang="css" scoped>
.container-tqrt {
  height: 100%;
  padding: 20px;
}
</style>
