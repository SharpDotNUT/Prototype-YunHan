<script setup lang="ts">
import Meta from '@/meta';
import Typewriter from 'typewriter-effect/dist/core';
import { useMainStore } from '@/stores/main';
import { onMounted, useTemplateRef } from 'vue';

const ref_text = useTemplateRef('text');
onMounted(() => {
  const typewriter = new Typewriter(ref_text.value as HTMLElement, {
    loop: true,
    delay: 150
  });
  typewriter
    .typeString('「云婵娟来花婵娟，风流尽在山水间。」')
    .pauseFor(5000)
    .start();
});

const mainStore = useMainStore();
function openGithub() {
  window.open(`https://github.com/${Meta.repo}`, '_blank');
}
</script>

<template>
  <div id="container">
    <div id="main">
      <img id="background" src="/img/UI_NameCardPic_Yunjin_P.png" />
      <div id="content">
        <img src="/img/UI_ChapterIcon_Yunjin.png" style="height: 10vh" />
        <h1 id="title-name">{{ $t('name') }}</h1>
        <p id="title-description">
          <span ref="text"></span>
          <br />
          <template v-if="$i18n.locale !== 'zh-Hans'">
            {{ $t('index.s0') }}
          </template>
        </p>
        {{ $t('index.description') }}
        <a
          :href="`https://github.com/${Meta.repo}`"
          target="_blank"
          style="display: flex; gap: 5px">
          <img :src="`https://img.shields.io/github/stars/${Meta.repo}`" />
          <img :src="`https://img.shields.io/github/license/${Meta.repo}`" />
        </a>
        <div id="actions">
          <router-link to="/home">
            <var-button type="primary">
              {{ $t('index.use') }}
            </var-button>
          </router-link>
          <var-button @click="openGithub">GitHub</var-button>
          <var-button
            disabled
            @click="(mainStore.beforeInstallPromptEvent as any)?.prompt()">
            {{ $t('index.install') }}
          </var-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('./index.css');
</style>
