<script setup lang="ts">
import { filesize } from 'filesize';
import { useTQRTStore } from './store';
import { getLanguage } from './util';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowLeft } from '@mdi/js';

const Store = useTQRTStore();
</script>

<template>
  <div class="container-tqrt-res">
    <h3>
      <RouterLink to="/tqrt">
        <var-button type="primary" round>
          <SvgIcon type="mdi" :path="mdiArrowLeft" />
        </var-button>
      </RouterLink>
      <span>{{ $t('tqrt.manage-text-res') }}</span>
    </h3>
    <div id="panel">
      <div>
        <div v-for="(langData, id) in Store.Data.langData">
          <span>
            {{
              langData.game == 'Genshin'
                ? $t('global.game.GI')
                : $t('global.game.HSR')
            }}
          </span>
          <span>&nbsp;/&nbsp;</span>
          <span>{{ getLanguage(langData.lang)?.name }}</span>
          <span>&nbsp;({{ filesize(langData.size) }})</span>
          <var-space justify="flex-end">
            <var-button
              :disabled="Store.Local.has(id)"
              @click="Store.download(id)">
              {{
                Store.Local.has(id)
                  ? $t('global.downloaded')
                  : $t('global.download')
              }}
            </var-button>
          </var-space>
          <var-divider />
        </div>
      </div>
      <div v-if="Store.Downloading.length == 0" class="center">
        <div>{{ $t('global.none-downloading') }}</div>
      </div>
      <div v-else>
        <TransitionGroup name="list">
          <div v-for="item in Store.Downloading" :key="item.name">
            <p class="mono">{{ item.name }}</p>
            <var-space justify="space-between">
              <span>
                {{ item.progress ? filesize(item.progress) : '未知' }}
              </span>
              <span>{{ filesize(item.size) }}</span>
            </var-space>
            <var-progress
              v-if="item.progress"
              color="green"
              :value="(item.progress / item.size) * 100" />
            <var-progress v-else indeterminate />
            <var-divider />
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./resource.css');
</style>
