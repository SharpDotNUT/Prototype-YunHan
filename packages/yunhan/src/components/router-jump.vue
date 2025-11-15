<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { NavigationData as RouteData } from '@/nav';
import { RouterLink, useRouter } from 'vue-router';
import { ref } from 'vue';

const tab = ref('home');

const router = useRouter();
const mainStore = useMainStore();

router.afterEach(() => {
  const path = router.currentRoute.value.path;
  RouteData.forEach((route) => {
    let res = [] as string[];
    if (path.startsWith(route.path)) {
      res.push(route.name);
    }
    res = res.sort((a, b) => b.length - a.length);
    if (res.length) {
      tab.value = res[0];
    }
  });
});
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
      <var-tabs
        v-model:active="tab"
        layout-direction="vertical"
        style="height: fit-content; background: transparent; padding: 0">
        <var-tab
          v-for="route in RouteData"
          elevation="3"
          style="height: fit-content"
          :name="route.name"
          @click="$router.push(route.path)">
          <h4
            style="
              width: 100%;
              margin: 10px 0px;
              font-size: large;
              text-align: start;
            ">
            {{ $t(route.name + '.title') }}
            <var-chip v-if="route.beta" type="warning" size="mini">
              Beta
            </var-chip>
          </h4>
        </var-tab>
      </var-tabs>
    </div>
  </div>
</template>

<style scoped>
@import url('./router-jump.css');
</style>
