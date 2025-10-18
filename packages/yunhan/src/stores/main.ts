import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { Themes, StyleProvider } from '@varlet/ui';

import PackageJSON from '../../../../package.json';
import { useRouter } from 'vue-router';

const GameFont = ['GI', 'HSR', 'ZZZ'];
type GameFont = 'GI' | 'HSR' | 'ZZZ';

export const useMainStore = defineStore('main', () => {
  const title = ref('');
  const logoURL = ref('');
  const version = ref(PackageJSON.version);
  const host_name = import.meta.env.VITE_API_HOST as string;
  const theme = ref('');
  const initTasks = ref([] as string[]);
  const gameFont = ref<GameFont>('HSR');
  {
    const game = localStorage.getItem('YunHan:Font');
    if (game && GameFont.includes(game)) {
      gameFont.value = game as GameFont;
    }
    // else {
    //   initTasks.value.push('font');
    //   router.push('/font');
    // }
  }
  watch(
    gameFont,
    (game) => {
      document.documentElement.dataset.game = game;
      localStorage.setItem('YunHan:Font', game);
    },
    { immediate: true }
  );
  const isUsingTeyvatFont = ref(false);
  const windowSize = ref({
    width: window.innerWidth,
    height: window.innerHeight
  });
  let beforeInstallPromptEvent = ref(null);
  window.addEventListener('beforeinstallprompt', function (e: any) {
    e.preventDefault();
    beforeInstallPromptEvent.value = e;
  });
  function setTheme(themeName: string) {
    function updateThemeAuto() {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        StyleProvider(Themes.md3Dark);
        theme.value = 'dark';
      } else {
        StyleProvider(Themes.md3Light);
        theme.value = 'light';
      }
    }
    switch (themeName) {
      case 'dark':
        StyleProvider(Themes.md3Dark);
        theme.value = 'dark';
        break;
      case 'light':
        StyleProvider(Themes.md3Light);
        theme.value = 'light';
        break;
      case 'system': {
        updateThemeAuto();
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', updateThemeAuto);
      }
    }
  }
  window.addEventListener('resize', () => {
    windowSize.value = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  });
  return {
    title,
    logoURL,
    version,
    host_name,
    theme,
    gameFont,
    initTasks,
    setTheme,
    isUsingTeyvatFont,
    beforeInstallPromptEvent,
    windowSize
  };
});
