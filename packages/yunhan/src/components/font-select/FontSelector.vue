<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ExampleTextGI, ExampleTextHSR, ExampleTextZZZ } from './example-text';
import { useMainStore } from '@/stores/main';
import type { T_SupportedLanguage } from '@/locales/i18n';

const mainStore = useMainStore();
const i18n = useI18n();
const locale = i18n.locale as unknown as T_SupportedLanguage;

const emit = defineEmits(['done']);
emit('done');
</script>

<template>
  <div style="padding: 0 10px">
    <h3>{{ $t('global.select', [$t('setting.language.game-font')]) }}</h3>
    <br />
    <var-radio-group v-model="mainStore.gameFont">
      <div class="item" style="font-family: var(--font-gi-family)">
        <var-radio checked-value="GI"></var-radio>
        <div>
          <h3>
            {{ $t('global.game.GI') }}
          </h3>
          <p
            class="text"
            :style="{
              fontFamily: ExampleTextGI[locale][1]
            }">
            {{ ExampleTextGI?.[locale][0] }}
          </p>
        </div>
      </div>
      <div class="item" style="font-family: var(--font-hsr-family)">
        <var-radio checked-value="HSR"></var-radio>
        <div>
          <h3>
            {{ $t('global.game.HSR') }}
          </h3>
          <p
            class="text"
            :style="{
              fontFamily: ExampleTextHSR[locale][1]
            }">
            {{ ExampleTextHSR?.[locale][0] }}
          </p>
        </div>
      </div>
      <div class="item" style="font-family: var(--font-zzz-family)">
        <var-radio checked-value="ZZZ"></var-radio>
        <div>
          <h3>
            {{ $t('global.game.ZZZ') }}
          </h3>
          <p
            class="text"
            :style="{
              fontFamily: ExampleTextZZZ[locale][1]
            }">
            {{ ExampleTextZZZ?.[locale][0] }}
          </p>
        </div>
      </div>
    </var-radio-group>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
</style>
