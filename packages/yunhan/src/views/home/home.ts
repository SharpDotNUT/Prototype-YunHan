import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { I_GameContent } from './types';
import { useAPIStore } from '@/stores/api';
import { useI18n } from 'vue-i18n';

export const useHomeStore = defineStore('home', () => {
  const { locale } = useI18n();
  const data = ref<I_GameContent>();
  const api = useAPIStore();
  const server = ref('china');
  const game = ref('hk4e');
  const loading = ref(false);

  const fetchData = async () => {
    loading.value = true;
    await api
      .fetchAPI(
        `/hoyo-data/game-content/${server.value}/${locale.value}/${game.value}_` +
          (server.value == 'china' ? 'cn' : 'global')
      )
      .then(async (res) => (data.value = await res.json()))
      .catch()
      .finally(() => (loading.value = false));
  };
  watch([server, locale, game], fetchData);

  return {
    data,
    server,
    game,
    loading,
    fetchData
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHomeStore, import.meta.hot));
}
