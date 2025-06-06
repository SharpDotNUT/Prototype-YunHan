<script setup lang="ts">
import { Snackbar } from '@varlet/ui'
import { useQuestionStore } from './store'
import type { t_QuestionsBankBaseInfo } from './types'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const data: Ref<Array<t_QuestionsBankBaseInfo>> = ref([])
const store = useQuestionStore()
const { t } = useI18n()
const failed = ref(false)

Snackbar.loading(t('quiz.home.download-list'))
fetch(
  'https://cdn.jsdelivr.net/gh/SharpDotNUT/Prototype-YunHan.QuizBank@main/meta.json'
)
  .then((res) => res.json())
  .then((res) => {
    Snackbar.success(t('quiz.home.download-list-success'))
    data.value = res
  })
  .catch(() => {
    Snackbar.error(t('quiz.home.download-list-fail'))
    failed.value = true
  })

function renderAuthor(author: string) {
  return author == 'Official' ? t('name') : author
}

function start(id: string) {
  Snackbar.loading(t('quiz.home.download-bank'))
  const url =
    'https://cdn.jsdelivr.net/gh/SharpDotNUT/Prototype-YunHan.QuizBank@main/question/' +
    id +
    '.json'
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      Snackbar.success(t('quiz.home.download-bank-success'))
      store.start(res)
    })
    .catch(() => {
      Snackbar.error(t('quiz.home.download-bank-fail'))
    })
}
</script>

<template>
  <div v-if="!failed" class="container">
    <div id="list">
      <var-cell
        v-for="item in data"
        border
        class="question-bank"
        type="primary">
        <h2>{{ item.name }}</h2>
        <p>
          {{ $t('global.author') }}&nbsp;:&nbsp;
          <span v-for="author in item.author" :key="author">
            {{ renderAuthor(author) }}&nbsp;
          </span>
        </p>
        <p>
          {{ item.description }}
        </p>
        <p>
          <var-link
            v-for="(link, name) in item.link"
            :key="link"
            :href="link"
            target="_blank"
            type="primary">
            {{ name }}
          </var-link>
        </p>
        <p v-if="item.date">
          {{ new Date(item.date).toLocaleDateString() }}
        </p>
        <br />
        <var-space justify="end">
          <var-button size="small" type="primary" @click="start(item.id)">
            {{ t('quiz.home.start') }}
          </var-button>
        </var-space>
      </var-cell>
    </div>
  </div>
  <div v-else id="failed">
    <p>
      {{ t('quiz.home.failed-to-load') }}
    </p>
    <router-link to="/home">
      <var-button>{{ t('home.title') }}</var-button>
    </router-link>
  </div>
</template>

<style lang="css" scoped>
@import url('./home.css');
</style>
