<script setup lang="ts">
import { ExampleTextGI, ExampleTextHSR, ExampleTextZZZ } from './example-text';
import { useMainStore } from '@/stores/main';

const mainStore = useMainStore();

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
          <div class="text">
            <p
              v-for="(text, lang) in ExampleTextGI"
              :lang="lang"
              :style="{
                fontFamily: text[1]
              }">
              {{ text[0] }}
            </p>
          </div>
        </div>
      </div>
      <div class="item" style="font-family: var(--font-hsr-family)">
        <var-radio checked-value="HSR"></var-radio>
        <div>
          <h3>
            {{ $t('global.game.HSR') }}
          </h3>
          <div class="text">
            <p
              v-for="(text, lang) in ExampleTextHSR"
              :lang="lang"
              :style="{
                fontFamily: text[1]
              }">
              {{ text[0] }}
            </p>
          </div>
        </div>
      </div>
      <div class="item" style="font-family: var(--font-zzz-family)">
        <var-radio checked-value="ZZZ"></var-radio>
        <div>
          <h3>
            {{ $t('global.game.ZZZ') }}
          </h3>
          <div class="text">
            <p
              v-for="(text, lang) in ExampleTextZZZ"
              :lang="lang"
              :style="{
                fontFamily: text[1]
              }">
              {{ text[0] }}
            </p>
          </div>
        </div>
      </div>
    </var-radio-group>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
</style>
