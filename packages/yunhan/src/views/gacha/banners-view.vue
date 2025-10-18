<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Banner from './banner-view.vue';
import { useRM } from '@/stores/resource-manager';
import type { GachaData } from './types';

defineEmits(['select']);

const props = defineProps({
  isNeedSelect: {
    type: Boolean,
    default: false
  }
});

const RM = useRM();
const Data = ref(null as GachaData | null);
const s_version = ref('');
const current = ref([] as string[]);
(async () => {
  Data.value = (await RM.get('gacha/pool.json')) as GachaData;
  s_version.value = Object.keys(Data.value.poolStruct)[0];
})();
const s_bannerIndex = ref('1');

watch(s_version, () => {
  s_bannerIndex.value = '1';
});
watch(s_bannerIndex, () => {
  current.value = Data.value?.poolStruct[s_version.value][s_bannerIndex.value]!;
});
</script>

<template>
  <div v-if="Data">
    <var-tabs v-model:active="s_version">
      <var-tab v-for="version in Object.keys(Data.poolStruct)" :name="version">
        {{ version }}
      </var-tab>
    </var-tabs>
    <var-tabs v-model:active="s_bannerIndex">
      <var-tab
        v-for="index in Object.keys(Data.poolStruct[s_version])"
        :name="index">
        第{{ ['', '一', '二', '三'][Number(index)] }}期活动祈愿
      </var-tab>
    </var-tabs>
    <!-- v-for="banner in Data.data[s_version][s_bannerIndex]"-->
    <Banner
      :v-if="false"
      v-for="banner in current"
      :banner="Data.poolData[banner]"
      :isNeedSelect="props.isNeedSelect"
      @select="$emit('select', $event)"></Banner>
  </div>
</template>

<style scoped>
@import url('./banners-view.css');
</style>
