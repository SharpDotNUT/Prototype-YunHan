<script setup lang="ts">
import { languages, useDict } from './store';

const show = defineModel<boolean>();
const store = useDict();
</script>

<template>
  <var-popup class="dict-setting-container" v-model:show="show">
    <div id="container">
      <div v-for="lang in languages">
        <var-select
          :placeholder="$t('dictionary.voice-of', [$t('global.lang.' + lang)])"
          v-model="store.Voices[lang]">
          <var-option
            v-for="voice in store.AvailableVoices.filter((x) =>
              x.lang.startsWith(lang)
            )"
            :value="voice.name"
            :label="voice.name">
            <p>
              <span v-if="!voice.localService">
                ({{ $t('global.online') }})&nbsp;
              </span>
              <span>{{ voice.name }}</span>
            </p>
          </var-option>
        </var-select>
      </div>
    </div>
  </var-popup>
</template>

<style lang="css" scoped>
@import url('./setting.css');
</style>
