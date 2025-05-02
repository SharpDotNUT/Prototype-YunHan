<script setup>
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { useQuestionStore } from './store'
import DTI from 'dom-to-image'
import { RouterLink, useRouter } from 'vue-router'
const store = useQuestionStore()
const router = useRouter()

const rightRate = computed(() => {
  return ((store.right / store.bank.questions.length) * 100).toFixed(2)
})

if (!store.bank) {
  router.push('/quiz')
}

const ref_result = useTemplateRef('ref_result')
const sharing = ref(false)

const exportImage = () => {
  sharing.value = true
  nextTick(() => {
    DTI.toJpeg(ref_result.value.$el, { quality: 2 }).then((dataUrl) => {
      const link = document.createElement('a')
      link.download = '测试结果.png'
      link.href = dataUrl
      link.click()
      sharing.value = false
    })
  })
}
</script>

<template>
  <div v-if="store.bank" class="container">
    <var-card id="card" ref="ref_result">
      <div id="content">
        <h2>恭喜您</h2>
        <p>在「{{ store.bank.name }} 」题库中答对了 {{ store.right }} 题</p>
        <var-table>
          <table>
            <tr>
              <th>题库</th>
              <td>{{ store.bank.name }}</td>
            </tr>
            <tr>
              <th>题库 ID</th>
              <td>
                <span v-if="sharing">{{ store.bank.id }}</span>
                <var-link
                  v-else
                  type="primary"
                  target="_blank"
                  :href="`https://github.com/SharpDotNUT/Prototype-YunHan-QuizBank/blob/main/question/${store.bank.id}.json`">
                  {{ store.bank.id }}
                </var-link>
              </td>
            </tr>
            <tr>
              <th>作者</th>
              <td>{{ store.bank.author.join(', ') }}</td>
            </tr>
            <tr>
              <th>答对</th>
              <td>{{ store.right }} / {{ store.bank.questions.length }}</td>
            </tr>
            <tr>
              <th>正确率</th>
              <td>{{ rightRate }} %</td>
            </tr>
          </table>
        </var-table>
        <div v-if="sharing">by {{ $t('name') }} - {{ $t('quiz.title') }}</div>
        <div v-else>
          <RouterLink to="/quiz">
            <var-button type="primary">
              <span>返回首页</span>
            </var-button>
          </RouterLink>
          <span>&nbsp;</span>
          <var-button type="primary" @click="exportImage">
            <span>保存结果为图片</span>
          </var-button>
        </div>
      </div>
    </var-card>
  </div>
</template>

<style lang="css" scoped>
@import url('./result.css');
</style>
