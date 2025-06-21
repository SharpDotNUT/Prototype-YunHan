<script setup lang="ts">
import Markdown from '@/components/markdown.vue';
import type { t_QuestionsBank } from './types';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestionStore } from './store';

const isDev = import.meta.env.DEV;
const data = ref<t_QuestionsBank | null>(null);
const router = useRouter();
const store = useQuestionStore();
data.value = store.bank;
if (!data.value || store.done) {
  router.push('/quiz');
}
function handleChoiceClick(key: string) {
  if (store.answer.choice.has(key)) {
    store.answer.choice.delete(key);
  } else {
    store.answer.choice.add(key);
  }
  console.log('store.answer.choice', Array.from(store.answer.choice));
}
</script>

<template>
  <div class="__container" v-if="data != null && store.currentQuestion != null">
    <div id="question">
      <var-progress
        type="success"
        :value="(store.currentIndex / data.questions.length) * 100" />
      <h2>
        {{ $t('question.question-number', [store.currentIndex + 1]) }}
      </h2>
      <p id="tags">
        <span v-if="store.currentQuestion.type == 'choice'">
          <var-chip v-if="store.currentQuestion.answer.length == 1">
            单选
          </var-chip>
          <var-chip v-else>多选</var-chip>
        </span>
        <var-chip v-for="text in data.questions[store.currentIndex].tag">
          {{ text }}
        </var-chip>
      </p>
      <div id="text">
        <Markdown :content="store.currentQuestion.question" />
      </div>
    </div>
    <div id="actions">
      <div id="answers">
        <div
          v-if="store.currentQuestion.type == 'choice'"
          v-for="(answer, key) in store.currentQuestion.choices">
          <var-chip
            block
            @click="handleChoiceClick(key as string)"
            :type="
              store.answer.choice.has(key as string) ? 'success' : undefined
            ">
            {{ answer }}
          </var-chip>
        </div>
        <div v-if="store.currentQuestion.type == 'judge'">
          <var-chip
            block
            @click="store.answer.judge = 1"
            :type="store.answer.judge == 1 ? 'success' : undefined">
            {{ $t('quiz.answer.true') }}
          </var-chip>
          <var-chip
            block
            @click="store.answer.judge = 0"
            :type="store.answer.judge == 0 ? 'success' : undefined">
            {{ $t('quiz.answer.false') }}
          </var-chip>
        </div>
        <div v-if="store.currentQuestion.type == 'fill'">
          <var-input v-model="store.answer.fill" />
        </div>
      </div>
      <div>
        <var-button
          block
          v-if="isDev"
          type="primary"
          @click="store.currentIndex++">
          {{ $t('question.next-question') }}
        </var-button>
        <var-button
          v-if="!store.answered"
          block
          type="primary"
          @click="store.submit">
          {{ $t('question.submit-answer') }}
        </var-button>
        <var-button v-else block type="primary" @click="store.currentIndex++">
          {{ $t('question.next-question') }}
        </var-button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url('./answer.css');
</style>
