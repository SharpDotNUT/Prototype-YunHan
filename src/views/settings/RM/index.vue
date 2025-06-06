<script setup lang="ts">
import type { Ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { filesize } from 'filesize'
import { ref } from 'vue'
import { useRM, type CacheResourceRecord } from '@/stores/resource-manager'
const mainStore = useMainStore()

const StorageUsage: Ref<null | {
  total: number
  used: number
  cacheUsed: number
  resources: Record<string, CacheResourceRecord>
}> = ref(null)
const RM = useRM()
function loadStorageUsage() {
  RM.getLocalMeta().then((res) => {
    StorageUsage.value = res as {
      total: number
      used: number
      cacheUsed: number
      resources: Record<string, CacheResourceRecord>
    }
  })
}
loadStorageUsage()
</script>

<template>
  <div class="--rm" v-if="StorageUsage">
    <h2>{{ $t('setting.rm') }}</h2>
    <div>
      <var-progress :value="(StorageUsage.cacheUsed / 102400000) * 100" />
      <p>
        {{ filesize(StorageUsage.cacheUsed) }} /
        {{ filesize(102400000) }}
      </p>
    </div>
    <var-table id="table">
      <table id="table-content">
        <tbody>
          <tr v-for="(value, key) in StorageUsage?.resources">
            <td>
              {{ key }}
            </td>
            <td>{{ filesize(value.size) }}</td>
            <td>{{ new Date(value.updatedAt).toLocaleString() }}</td>
            <td>
              <var-button
                size="small"
                type="warning"
                @click="
                  RM.removeByKey(key).then(() => {
                    loadStorageUsage()
                  })
                ">
                {{ $t('global.action.delete') }}
              </var-button>
            </td>
          </tr>
        </tbody>
      </table>
    </var-table>
  </div>
</template>

<style lang="css" scoped>
@import url('./index.css');
</style>
