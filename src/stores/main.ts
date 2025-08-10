import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { Themes, StyleProvider } from '@varlet/ui';

import PackageJSON from '../../package.json';

const GameFont = ['GI', 'HSR', 'ZZZ'];
type GameFont = 'GI' | 'HSR' | 'ZZZ';

export const useMainStore = defineStore('main', () => {
  const title = ref('');
  const logoURL = ref('');
  const version = ref(PackageJSON.version);
  const host_name = import.meta.env.VITE_API_HOST as string;
  const theme = ref('');
  const gameFont = ref<GameFont>('GI');
  {
    const game = localStorage.getItem('game');
    if (game && GameFont.includes(game)) {
      gameFont.value = game as GameFont;
    }
  }
  watch(
    gameFont,
    (game) => {
      document.documentElement.dataset.game = game;
      localStorage.setItem('game', game);
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
    // 阻止默认事件
    e.preventDefault();
    // 保存事件对象
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
    setTheme,
    isUsingTeyvatFont,
    beforeInstallPromptEvent,
    windowSize
  };
});
