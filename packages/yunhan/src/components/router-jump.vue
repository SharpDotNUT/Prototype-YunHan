<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { NavigationData as RouteData } from '@/nav';

const mainStore = useMainStore();
import Meta from '@/meta';
</script>

<template>
  <div class="container">
    <div id="content" ref="routes">
      <h3>
        {{ $t('name') }}
        <br />
        <var-badge :value="'v' + mainStore.version"></var-badge>
      </h3>
      <var-divider />
      <var-paper
        elevation="3"
        v-for="route in RouteData"
        class="app var-button">
        <RouterLink class="app-name" :to="route.path">
          {{ $t(route.name + '.title') }}
          <var-chip v-if="route.beta" type="warning" size="small">
            Beta
          </var-chip>
        </RouterLink>
      </var-paper>
    </div>
  </div>
</template>

<style scoped>
@import url('./router-jump.css');
</style>
