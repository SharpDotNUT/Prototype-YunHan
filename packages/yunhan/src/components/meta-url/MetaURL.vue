<script setup lang="ts">
import { useRM } from '@/stores/resource-manager';
import { round } from 'es-toolkit';

const RM = useRM();

const emit = defineEmits(['done']);
emit('done');
</script>

<template>
  <div>
    <h3>{{ $t('app.init.select-res-url') }}</h3>
    <br />
    <var-radio-group v-model="RM.MetaURL">
      <div v-for="URLOption in RM.MetaURLOptions" class="radio-item">
        <var-radio :checked-value="URLOption.base"></var-radio>
        <div>
          <p class="mono">{{ URLOption.base }}</p>
          <p>by {{ URLOption.provider }}</p>
          <span>
            {{ $t('global.status') }}:
            <span v-if="URLOption.status === 'CANNOT_USE'">
              {{ $t('global.offline') }}
            </span>
            <span v-else-if="URLOption.status === 'UNKNOWN'">
              {{ $t('global.unknown') }}
            </span>
            <span v-else>{{ round(URLOption.status, 2) }} ms</span>
          </span>
          <span>&nbsp;</span>
          <var-button
            size="small"
            @click="RM.testNetStatusSync(URLOption.base)">
            {{ $t('global.test') }}
          </var-button>
        </div>
      </div>
    </var-radio-group>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
</style>
