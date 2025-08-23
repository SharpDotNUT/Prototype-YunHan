<script setup lang="ts">
import { sleep } from '@/script/tools';
import { useMainStore } from '@/stores/main';
import gsap from 'gsap';
import {
  nextTick,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
  type Component
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const backTo = route.query.from?.toString() ?? '/';

const step = ref(0);
const loaded = ref(-1);
const comps = shallowRef<Component[]>([]);
const allowNext = ref(false);

const store = useMainStore();

const tasks = [
  {
    name: 'res_url',
    comp: () => import('@/components/meta-url/MetaURL.vue')
  }
];

const loadComp = async () => {
  await sleep(500);
  const comp = await tasks[step.value].comp();
  comps.value = [...comps.value, comp.default];
  loaded.value++;
  nextTick(() => {
    animate();
  });
};
loadComp();

watch(
  step,
  () => {
    if (step.value >= store.initTasks.length) {
      router.push(backTo);
    }
    loadComp();
    allowNext.value = false;
  },
  {
    immediate: true
  }
);

const elements = useTemplateRef('content');
let animation: gsap.core.Tween | null = null;
const animate = () => {
  if (!elements.value) return;
  if (animation) {
    animation.kill();
  }
  const doms = elements.value.querySelectorAll('*');
  gsap.set(doms, { clearProps: 'all' });
  animation = gsap.from(doms, {
    y: 20,
    opacity: 0,
    duration: 1.5,
    stagger: 1 / doms.length,
    ease: 'power2.out'
  });
};
</script>

<template>
  <div class="container">
    <h1>{{ $t('global.init') }} {{ step + 1 }}/{{ store.initTasks.length }}</h1>
    <div id="content">
      <Transitions name="fade">
        <div v-if="step < store.initTasks.length && comps[step]" ref="content">
          <component :is="comps[loaded]" @done="allowNext = true"></component>
        </div>
      </Transitions>
    </div>
    <var-button block type="primary" @click="step++" :disabled="!allowNext">
      {{ $t('global.next-step') }}
    </var-button>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
</style>
