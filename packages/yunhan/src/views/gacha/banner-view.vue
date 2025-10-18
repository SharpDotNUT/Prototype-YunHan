<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import IdToName from '@/data/id_to_name.CHS.json';
import { useI18n } from 'vue-i18n';
import {
  LanguageTextMapDefault,
  SupportedLanguages,
  type T_SupportedLanguage
} from '@/locales/i18n';
import { useRM } from '@/stores/resource-manager';
import type { PoolData } from './types';

defineEmits(['select']);

const props = defineProps<{
  banner: PoolData;
  isNeedSelect: boolean;
}>();
const img = ref(null);

const i18n = useI18n();
const RM = useRM();
const locale = i18n.locale as Ref<T_SupportedLanguage>;
const textMap = ref(structuredClone(LanguageTextMapDefault));
const text = computed(() => {
  return textMap.value[locale.value];
});
const maps = ref(structuredClone(LanguageTextMapDefault));
const map = computed(() => {
  return maps.value[locale.value];
});
SupportedLanguages.forEach(async (lang) => {
  textMap.value[lang] = await RM.get(`gacha/text_map_${lang}.json`);
  maps.value[lang] = await RM.get(`id-map/id-map_${lang}.json`);
});

img.value,
  addEventListener('load', function () {
    console.log('图片加载完成');
  });
</script>

<template>
  <div class="banner" style="display: flex; flex-direction: column; gap: 10px">
    <img
      ref="img"
      :src="text?.[banner.img]"
      :alt="banner.name"
      style="width: 100%" />
    <p>
      {{ new Date(banner.from).toLocaleString() }} -
      {{ new Date(banner.to).toLocaleString() }}
    </p>
    <div
      v-if="
        new Date(banner.from) < new Date() && new Date(banner.to) > new Date()
      ">
      <p>
        进行中 - 还有
        {{ Math.floor((new Date(banner.to) - new Date()) / 86400000) }} 天
        {{
          Math.floor(((new Date(banner.to) - new Date()) % 86400000) / 3600000)
        }}
        小时
        {{ Math.floor(((new Date(banner.to) - new Date()) % 3600000) / 60000) }}
        分钟
      </p>
      <p>
        <var-progress
          :value="
            ((new Date() - new Date(banner.from)) /
              (new Date(banner.to) - new Date(banner.from))) *
            100
          " />
      </p>
    </div>
    <p>
      UP :
      <var-chip type="primary" v-for="star5 in banner.star5">
        {{ map?.[star5] }}
      </var-chip>
      <var-chip v-for="star4 in banner.star4">
        {{ map?.[star4] }}
      </var-chip>
    </p>
    <var-button
      v-if="props.isNeedSelect"
      @click="$emit('select', banner)"
      block>
      选择该卡池
    </var-button>
    <hr />
  </div>
</template>
