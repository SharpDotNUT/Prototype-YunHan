import { ref, watch } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { Themes, StyleProvider } from '@varlet/ui';

import PackageJSON from '../../package.json';
import { useRouter } from 'vue-router';
import { setGameFont } from '@/locales/i18n';
import { useI18n } from 'vue-i18n';

const GameFont = ['GI', 'HSR', 'ZZZ'];
type GameFont = 'GI' | 'HSR' | 'ZZZ';

export const useMainStore = defineStore('main', () => {
  const { locale } = useI18n();
  const title = ref('');
  const logoURL = ref('');
  const version = ref(PackageJSON.version);
  const host_name = import.meta.env.VITE_API_HOST as string;
  const theme = ref('');
  const initTasks = ref([] as string[]);
  const gameFont = ref<false | string>(false);
  const windowSize = ref({
    width: window.innerWidth,
    height: window.innerHeight
  });
  let beforeInstallPromptEvent = ref(null);
  watch(
    gameFont,
    (fontName) => {
      if (fontName) {
        setGameFont(fontName);
        locale.value = 'en';
      } else {
        setGameFont();
      }
    },
    { immediate: true }
  );
  watch(locale, () => {
    gameFont.value = false;
  });
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
    beforeInstallPromptEvent,
    windowSize
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot));
}
