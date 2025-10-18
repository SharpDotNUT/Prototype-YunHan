<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { gsap } from 'gsap';
import { nextTick, useTemplateRef, watch } from 'vue';
import { mdiCog, mdiGithub, mdiInformation, mdiUpdate } from '@mdi/js';
import { useMainStore } from '@/stores/main';
import { NavigationData as RouteData } from '@/nav';

const mainStore = useMainStore();
import Meta from '@/meta';
const routes = useTemplateRef('routes');
const show = defineModel<boolean>();
let animation: gsap.core.Tween | null = null;
const animate = () => {
  if (!routes.value) return;
  if (animation) {
    animation.kill();
  }
  const doms = routes.value.children;
  gsap.set(doms, { clearProps: 'all' });
  animation = gsap.from(doms, {
    y: 20,
    opacity: 0,
    duration: 1,
    stagger: 1 / doms.length,
    ease: 'power2.out'
  });
};
watch(show, animate);

function openGithub() {
  window.open(`https://github.com/${Meta.repo}`, '_blank');
}
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="overlay full-screen" @click="show = false"></div>
  </Transition>
  <div
    :style="{
      transform: show ? 'translateX(0)' : 'translateX(calc(100% + 40px))'
    }"
    class="container">
    <div id="content" ref="routes">
      <h3>
        {{ $t('name') }}
        <var-badge :value="'v ' + mainStore.version"></var-badge>
      </h3>
      <var-divider />
      <var-paper elevation="3" class="app var-button" @click="openGithub">
        <a class="app-name">
          <SvgIcon class="icon" type="mdi" :path="mdiGithub" />
          <span>{{ $t('global.github-os-repo') }}</span>
        </a>
      </var-paper>
      <var-paper elevation="3" class="app var-button">
        <RouterLink class="app-name" to="/settings">
          <SvgIcon class="icon" type="mdi" :path="mdiCog" />
          <span>{{ $t('setting.title') }}</span>
        </RouterLink>
      </var-paper>
      <var-paper elevation="3" class="app var-button">
        <RouterLink class="app-name" to="/settings/about">
          <SvgIcon class="icon" type="mdi" :path="mdiInformation" />
          <span>{{ $t('global.about') }}</span>
        </RouterLink>
      </var-paper>
      <var-paper elevation="3" class="app var-button">
        <RouterLink class="app-name" to="/settings/update-log">
          <SvgIcon class="icon" type="mdi" :path="mdiUpdate" />
          <span>{{ $t('setting.update-log') }}</span>
        </RouterLink>
      </var-paper>
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
