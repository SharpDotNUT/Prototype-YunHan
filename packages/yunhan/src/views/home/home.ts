import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref } from 'vue';
import type { I_GameContent } from './types';
import { useAPIStore } from '@/stores/api';

export const useHomeStore = defineStore('home', () => {
  const data = ref<I_GameContent>();
  const api = useAPIStore();

  const fetchData = async () => {
    const res = await api.fetchAPI(
      '/hoyo-data/game-content/china/zh-Hans/hk4e_cn'
    );
    data.value = await res.json();
  };

  return {
    data,
    fetchData
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHomeStore, import.meta.hot));
}
