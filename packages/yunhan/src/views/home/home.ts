import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { I_GameContent } from './types';
import { useAPIStore } from '@/stores/api';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const LanguageConvertor = {
  'zh-Hans': 'zh-cn',
  'zh-Hant': 'zh-tw',
  en: 'en-us',
  ja: 'ja-jp'
} as const;

const ServerConvertor = {
  china: 'cn_gf01',
  global: 'global'
} as const;

export const useHomeStore = defineStore('home', () => {
  const { locale } = useI18n();
  const data = ref<I_GameContent>();
  const api = useAPIStore();
  const server = ref('china');
  const game = ref('hk4e');
  const loading = ref(false);
  const gameBiz = computed(
    () => game.value + '_' + (server.value == 'china' ? 'cn' : 'global')
  );

  const fetchData = async () => {
    loading.value = true;
    await api
      .fetchAPI(
        `/hoyo-data/game-content/${server.value}/${locale.value}/${gameBiz.value}`
      )
      .then(async (res) => (data.value = await res.json()))
      .catch()
      .finally(() => (loading.value = false));
  };

  const AnnounceURL = computed(() => {
    return (
      'https://sdk.mihoyo.com/' +
      game.value +
      '/announcement/index.html?auth_appid=announcement&authkey_ver=1&bundle_id=' +
      gameBiz.value +
      '&channel_id=1&game=' +
      game.value +
      '&game_biz=' +
      gameBiz.value +
      '&lang=' +
      LanguageConvertor[locale.value as keyof typeof LanguageConvertor] +
      '&level=60&platform=pc&region=cn_gf01' +
      '&sdk_presentation_style=fullscreen&sdk_screen_transparent=true&sign_type=2&uid=1#/'
    );
  });

  watch([server, locale, game], fetchData);

  return {
    data,
    server,
    game,
    loading,
    AnnounceURL,
    fetchData
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHomeStore, import.meta.hot));
}
