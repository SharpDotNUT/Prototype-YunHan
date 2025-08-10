<script setup lang="ts">
import { filesize } from 'filesize';
import { useTQRTStore } from './store';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiClose } from '@mdi/js';
import { getLanguage } from './util';

const Store = useTQRTStore();
const show = defineModel<boolean>();

const needUpdate = (id: string) => {
  const now = Store.localLangs?.[id]?.version;
  const newest = Store.langData?.[id]?.version;
  return now !== newest;
};
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="container-tqrt-res">
      <var-space justify="space-between" align="center">
        <h3>{{ $t('tqrt.manage-text-res') }}</h3>
        <var-button type="primary" round @click="show = false">
          <SvgIcon type="mdi" :path="mdiClose" />
        </var-button>
      </var-space>
      <div id="panel">
        <div>
          <div v-for="(langData, id) in Store.langData" :key="id">
            <span v-if="langData.game == 'Genshin'">
              {{ $t('global.game.GI') }}&nbsp;
              {{ Store.gameMeta.Genshin.version }}
            </span>
            <span v-else>
              {{ $t('global.game.HSR') }}&nbsp;
              {{ Store.gameMeta.StarRail.version }}
            </span>
            <span>&nbsp;/&nbsp;</span>
            <span>{{ getLanguage(langData.lang)?.name }}</span>
            <span>&nbsp;({{ filesize(langData.size) }})</span>
            <var-space justify="flex-end">
              <var-button
                :disabled="Store.localLangs?.[id] != undefined"
                @click="Store.downloadLang(id)">
                {{
                  Store.localLangs?.[id] != undefined
                    ? $t('global.downloaded') +
                      ' ' +
                      Store.localLangs?.[id].version
                    : $t('global.download')
                }}
              </var-button>
              <var-button
                v-if="Store.localLangs?.[id] != undefined"
                :disabled="!needUpdate(id)"
                @click="Store.downloadLang(id)">
                {{ $t('app.update') }}
              </var-button>
            </var-space>
            <var-divider />
          </div>
        </div>
        <div v-if="Object.keys(Store.downloading).length == 0" class="center">
          <div>{{ $t('global.none-downloading') }}</div>
        </div>
        <div v-else>
          <TransitionGroup name="list">
            <div v-for="item in Store.downloading" :key="item.path">
              <p class="mono">{{ item.path.split('/').pop() }}</p>
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
  </Transition>
</template>

<style lang="css" scoped>
@import url('./resource.css');
</style>
