<script setup lang="ts">
import PackageJSON from '../../../../package.json';
import Markdown from '@/components/markdown.vue';
import Meta from '@/meta';
import _README from '../../../../../../README.md?raw';

const README = _README.replaceAll('/public/', '/');

const show = defineModel('show', { type: Boolean, default: true });

const BuildTime = __BUILD_TIME;
const BuildEnv = __BUILD_CLIENT;
const LAST_COMMIT = __LAST_COMMIT;
</script>

<template>
  <div class="__container_about">
    <div id="card">
      <div id="main">
        <img
          src="/img/UI_NameCardPic_Yunjin_P.png"
          style="width: 100%; opacity: 0.75" />
        <div id="main_text">
          <p style="font-size: 4vmin">{{ $t('name') }}</p>
          <var-badge
            style="font-size: 1.2vmin"
            :value="'v ' + PackageJSON.version"></var-badge>
        </div>
      </div>
    </div>
    <var-card>
      <p>
        {{ $t('index.description') }}
      </p>
      <p>
        <a
          :href="`https://github.com/${Meta.repo}`"
          target="_blank"
          style="display: flex; gap: 5px">
          <img :src="`https://img.shields.io/github/stars/${Meta.repo}`" />
          <img
            :src="`https://img.shields.io/github/license/${Meta.repo}?tab=Apache-2.0-1-ov-file`" />
        </a>
      </p>
      <var-divider />
      <p>
        <span lang="zh-Hans">
          「
          <ruby>
            云先生
            <rt>云堇</rt>
          </ruby>
          可爱捏」
        </span>
        <span lang="ja">
          「
          <ruby>
            雲先生
            <rt>雲堇ちゃん</rt>
          </ruby>
          は可愛いですね」
        </span>
        <span lang="en">"Yun Jin is cute!"</span>
      </p>
    </var-card>
    <var-card id="contributors">
      <p style="display: inline-flex; justify-items: center">
        <span>Programmed By&nbsp</span>
        <var-link href="https://github.com/SharpDotNUT" target="_blank">
          <img style="height: 1em" src="\img\Logo_FB.proj.svg" />
        </var-link>
        <span>&nbspWith ❤️</span>
      </p>
      <br />
      <p>{{ $t('about.thanks-to-contributors') }}</p>
      <br />
      <a
        :href="`https://github.com/${Meta.repo}/graphs/contributors`"
        target="_blank">
        <img :src="`https://contrib.rocks/image?repo=${Meta.repo}`" />
      </a>
    </var-card>
    <var-card>
      <p>{{ $t('about.last-commit') }}</p>
      <div v-if="LAST_COMMIT">
        <p>
          Commit ID :
          <var-link
            :href="`https://github.com/${Meta.repo}/commit/${LAST_COMMIT.sha}`"
            target="_blank">
            #{{ LAST_COMMIT.sha.toUpperCase().substring(0, 17) }}
          </var-link>
        </p>
        <p>Commit Message : {{ LAST_COMMIT.commit.message }}</p>
        <p>
          Commit Time :
          {{ new Date(LAST_COMMIT.commit.author.date).toLocaleString() }}
        </p>
        <p>
          Author :
          <var-link
            :href="`https://github.com/${LAST_COMMIT.commit.author.name}`"
            target="_blank">
            {{ LAST_COMMIT.commit.author.name }}<{{
              LAST_COMMIT.commit.author.email
            }}>
          </var-link>
        </p>
      </div>
      <div v-else>
        {{ $t('about.last-commit-unknown') }}
      </div>
      <p style="margin-top: 1em">
        {{ $t('about.build-time', [new Date(BuildTime).toLocaleString()]) }}
      </p>
      <p v-if="false" style="margin-top: 1em">
        {{ $t('about.build-env', [BuildEnv]) }}
      </p>
      <var-divider />
      <p>{{ $t('about.copyright') }}</p>
    </var-card>
    <div style="display: flex; align-items: center; gap: 1em">
      <p>README.md</p>
      <var-divider />
    </div>
    <var-card>
      <Markdown :content="README" />
    </var-card>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
</style>
