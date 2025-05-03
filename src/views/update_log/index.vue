<template>
  <div class="update-log-container">
    <div class="list">
      <template v-if="UpdateLogsData.length > 0">
        <var-card
          v-for="log in UpdateLogsData"
          :key="log.version"
          class="version">
          <div class="version-content">
            <h1>
              <span style="font-family: JetBrains Mono">
                {{ log.version }}
              </span>
              <span v-if="log.zh" lang="zh-Hans">
                &nbsp- {{ log.zh }} {{ log.en }}
              </span>
            </h1>
            <h3 style="display: flex; align-items: center">
              <span class="date">{{ formatDate(log.date) }}</span>
              <span v-if="log.version.endsWith('.0.0')">&nbsp</span>
              <var-chip type="primary" v-if="log.version.endsWith('.0.0')">
                {{ $t('update-log.major-version') }}
              </var-chip>
              <span v-if="log.version.endsWith('.0')">&nbsp</span>
              <var-chip type="success" v-if="log.version.endsWith('.0')">
                {{ $t('update-log.minor-version') }}
              </var-chip>
            </h3>
            <var-divider />
            <div>
              <div
                v-for="(item, itemIndex) in log.items"
                :key="itemIndex"
                class="change-item">
                <div class="change-meta">
                  <var-chip size="small" type="primary" class="area">
                    {{ $t('update-log.area') }} :
                    {{ getArea(item.area) }}
                  </var-chip>
                </div>
                <div class="change-content">
                  <p lang="zh-Hans">{{ item.zh }}</p>
                  <p lang="en">{{ item.en }}</p>
                </div>
              </div>
            </div>
          </div>
        </var-card>
      </template>
      <div v-else class="no-results">No results found.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UpdateLogsDataText from '@/docs/update-log/logs.json5?raw'
import type { t_UpdateLog } from '@/docs/update-log/types'
import JSON5 from 'json5'
import { watch } from 'vue'

const UpdateLogsData = JSON5.parse(UpdateLogsDataText) as t_UpdateLog

const UpdateLogs = UpdateLogsData.sort(
  // 根据 版本号降序排序
  (a, b) => {
    const [aMajor, aMinor, aPatch] = a.version.split('.').map(Number)
    const [bMajor, bMinor, bPatch] = b.version.split('.').map(Number)
    return bMajor - aMajor || bMinor - aMinor || bPatch - aPatch
  }
).filter((log) => !log.released && log.released != false)

const { locale, t } = useI18n()

const formatDate = (timestamp: string | number | Date) => {
  return new Date(timestamp).toLocaleString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  })
}

const areas: Ref<any> = ref({})
watch(
  locale,
  () => {
    areas.value = {
      app: t('name'),
      i18n: t('update-log.areas.i18n'),
      others: t('update-log.areas.others')
    }
  },
  { immediate: true }
)
function getArea(key: string) {
  if (areas.value[key]) {
    return areas.value[key]
  } else {
    return t(key + '.title')
  }
}
</script>

<style scoped>
@import url('./index.css');
</style>
