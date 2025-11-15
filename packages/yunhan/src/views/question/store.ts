import { isEqual } from 'es-toolkit';
import type { t_QuestionsBank } from './types';
import { defineStore } from 'pinia';
import { computed, watch } from 'vue';
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { Snackbar } from '@varlet/ui';

export const useQuestionStore = defineStore('question', () => {
  const router = useRouter();
  const right = ref(0);
  const bank: Ref<null | t_QuestionsBank> = ref(null);
  const currentIndex = ref(0);
  const currentQuestion = computed(() => {
    if (!bank.value) return null;
    return bank.value.questions[currentIndex.value];
  });
  const done = ref(true);
  const answered = ref(false);
  const answer = ref({
    choice: new Set() as Set<string>,
    judge: -1,
    fill: ''
  });
  function start(data: t_QuestionsBank) {
    bank.value = data;
    currentIndex.value = 0;
    done.value = false;
    router.push('/quiz/answer');
  }
  function submit() {
    if (!currentQuestion.value) return;
    let isRight = false;
    answered.value = true;
    switch (currentQuestion.value.type) {
      case 'choice': {
        console.log(
          Array.from(answer.value.choice),
          currentQuestion.value.answer
        );
        isRight = isEqual(
          Array.from(answer.value.choice).sort(),
          currentQuestion.value.answer.sort()
        );
        break;
      }
      case 'judge': {
        if (answer.value.judge == -1) {
          return;
        }
        console.log(Boolean(answer.value.judge), currentQuestion.value.answer);
        isRight = Boolean(answer.value.judge) == currentQuestion.value.answer;
        break;
      }
      case 'fill': {
        if (!answer.value.fill) {
          return;
        }
        isRight = currentQuestion.value.answer.includes(answer.value.fill);
        break;
      }
    }
    if (isRight) {
      Snackbar.success('回答正确');
      right.value++;
    } else {
      Snackbar.error('回答错误');
    }
  }
  watch(currentIndex, () => {
    if (!bank.value) return;
    if (currentIndex.value >= bank.value.questions.length) {
      router.push('/quiz/result');
      done.value = true;
    }
    answer.value = {
      choice: new Set(),
      judge: -1,
      fill: ''
    };
    answered.value = false;
  });
  return {
    right,
    bank,
    currentIndex,
    currentQuestion,
    answer,
    answered,
    done,
    start,
    submit
  };
});
