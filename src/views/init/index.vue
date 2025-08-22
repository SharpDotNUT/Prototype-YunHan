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
import { useRoute } from 'vue-router';

const route = useRoute();
const backTo = route.query.from;

const step = ref(0);
const loaded = ref(-1);
const comps = shallowRef<Component[]>([]);
const allowNext = ref(false);

const store = useMainStore();
for (let i = 0; i < 10; i++) {
  store.initTasks.push('test');
}

const tasks = [
  {
    name: 'test',
    comp: () => import('../about/index.vue')
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

watch(step, (newStep) => {
  loadComp();
  allowNext.value = false;
});

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
    <h1>{{ $t('global.init') }} {{ step }}/{{ store.initTasks.length }}</h1>
    <div id="content">
      <Transition name="fade">
        <div v-if="comps[step]" ref="content">
          <component :is="comps[loaded]" @done="allowNext = true"></component>
        </div>
      </Transition>
    </div>
    <var-button block type="primary" @click="step++" :disabled="!allowNext">
      {{ $t('global.next-step') }}
    </var-button>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
</style>
