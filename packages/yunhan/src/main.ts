import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Varlet from '@varlet/ui';
import i18n from './locales/i18n';
import App from './App.vue';
import router from './router/index';

import './style/main.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(Varlet);
app.mount('#app');

import VueVirtualScroller from 'vue-virtual-scroller';
app.use(VueVirtualScroller);

import '@varlet/touch-emulator';
import '@varlet/ui/es/style';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import { useMainStore } from './stores/main';
useMainStore().setTheme('system');

import { Input, Select, TimePicker } from '@varlet/ui';
Input.setPropsDefaults({
  variant: 'outlined'
});
Select.setPropsDefaults({
  variant: 'outlined'
});
TimePicker.setPropsDefaults({
  format: '24hr'
});

if (navigator.serviceWorker) {
  const regs = await navigator.serviceWorker.getRegistrations();
  regs.forEach((sw) => {
    sw.unregister();
  });
  if (regs.length) {
    window.location.reload();
  }
}
